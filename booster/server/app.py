from gevent import monkey
monkey.patch_all()
import urllib3
urllib3.disable_warnings()
import bson, json, ssl
from flask_cors import CORS
from bson.json_util import dumps
from flask import Flask, request, jsonify, send_from_directory, Response
from bson.objectid import ObjectId
from helper.flat_mongo_json import _json_convert
from middleware import middleware
from connection.database import boost_package_collection, \
     transaction_collection, user_collection, ads_collection
from admin import admin_api
from user.user import user_api
from explore.explore import explore_api
from helper.response import InvalidAPIUsage, ok
from helper.google_verify_purchase import verify_purchase
from boost.boost import boost_api
import pymongo
from datetime import datetime
# SSL
ssl._create_default_https_context = ssl._create_unverified_context

# FLASK RESTFUL API
app = Flask(__name__, static_url_path='')
# calling our middleware
app.wsgi_app = middleware(app.wsgi_app)
app.register_blueprint(admin_api)
app.register_blueprint(user_api)
app.register_blueprint(explore_api)
app.register_blueprint(boost_api)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.errorhandler(InvalidAPIUsage)
def invalid_api_usage(e):
    return jsonify(e.to_dict())


@app.route('/images/<path:path>')
def send_js(path):
    return send_from_directory('tmp', path)


@app.route('/v1/api/getBoostPackages', methods=['POST'])
def get_packages():
    data = request.environ['data']
    os_name = data.get('os')
    return ok(boost_package_collection.find({'os': os_name},
                                            {
                                                'packageId': 1,
                                                'packageStar': 1
                                            }).sort([('packageStar', pymongo.ASCENDING), ('_id', pymongo.ASCENDING)]))


@app.route('/v1/api/user/purchaseStar', methods=['POST'])
def purchase_star():
    try:
        data = request.environ['data']
        orderId = data.get('orderId')
        package_name = data.get('packageName')
        product_id = data.get('productId')
        purchase_state = data.get('purchaseState')
        purchase_time = data.get('purchaseTime')
        purchase_token = data.get('purchaseToken')
        create_at = datetime.now()
        os = data.get('os')
        user_id = data.get('userId')
        verify_purchase(data)
        user = _json_convert(user_collection.find_one({'_id': ObjectId(user_id)}))

        if user is None:
            raise InvalidAPIUsage('user not found', status_code=200)
        userId = ObjectId(user.get('_id'))
        if os != 'iOS':
            transaction = transaction_collection.find_one({'orderId': orderId})
            if transaction is not None:
                raise InvalidAPIUsage('This order has exist', status_code=200)

        p_id = _json_convert(boost_package_collection.find_one({'packageId': product_id}))
        stars = int(p_id.get('packageStar'))
        pricing = float(p_id.get('pricing'))
        product_id = ObjectId(p_id.get('_id'))
        # update profile
        if 'stars' in user:
            user_stars = user.get('stars')
            stars += user_stars
        user_collection.update_one({'_id': userId}, {'$set': {'stars': stars}}, upsert=True)

        profile_json = {
            'orderId': orderId,
            'packageName': package_name,
            'productId': product_id,
            'purchaseTime': purchase_time,
            'purchaseState': purchase_state,
            'userId': userId,
            'createdAt': create_at,
            'stars': stars,
            'purchaseToken': purchase_token,
            'amount': pricing
        }

        transaction_collection.save(profile_json)
        return ok({'orderId': orderId, 'stars': stars})
    except:
        raise InvalidAPIUsage('something wrong!', status_code=200)

# GET CONFIG
@app.route('/v1/api/config', methods=['POST'])
def get_config():
    configs = ads_collection.find({})
    data = {
        'google': _json_convert(configs)
    }
    return ok(data)


# REWARD
@app.route('/v1/api/reward/video', methods=['POST'])
def get_reward():
    data = request.environ['data']
    userId = ObjectId(data.get('userId'))

    user = user_collection.find_one({'_id': ObjectId(userId)})
    if user is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    user_stars = user.get('stars')
    user_stars += 2
    user_collection.update_one({'_id': userId}, {'$set': {'stars': user_stars}})
    user['stars'] = user_stars
    return ok(user)


@app.route('/v1/api/reward/tiktok', methods=['POST'])
def follow_our_tiktok():
    data = request.environ['data']
    userId = ObjectId(data.get('userId'))
    user = user_collection.find_one({'_id': ObjectId(userId), 'hasFollowTiktok': {'$exists': False}})
    if user is None:
        return Response(json.dumps({'message': 'You have already follow us',
                                    'error': 1},
                                   default=bson.json_util.default),
                        mimetype='application/json')
    user_stars = user.get('stars')
    user_stars += 3
    user_collection.update_one({'_id': userId}, {'$set': {'stars': user_stars, 'hasFollowTiktok': True}})
    user['stars'] = user_stars
    user['hasFollowTiktok'] = True
    return ok(user)


@app.route('/v1/api/report/app', methods=['POST'])
def report_app():
    data = request.environ['data']
    userId = ObjectId(data.get('userId'))
    reason = data.get('reason')

    user = user_collection.find_one({'_id': ObjectId(userId)})
    if user is None:
        return Response(json.dumps({'message': 'You have already follow us',
                                    'error': 1},
                                   default=bson.json_util.default),
                        mimetype='application/json')
    return ok({'success': 1})


@app.route('/v1/api/report/user', methods=['POST'])
def report_user():
    data = request.environ['data']
    userId = ObjectId(data.get('userId'))
    reason = data.get('reason')

    user = user_collection.find_one({'_id': ObjectId(userId)})
    if user is None:
        return Response(json.dumps({'message': 'You have already follow us',
                                    'error': 1},
                                   default=bson.json_util.default),
                        mimetype='application/json')
    return ok({'success': 1})

if __name__ == '__main__':
    app.run('0.0.0.0', 5000)
