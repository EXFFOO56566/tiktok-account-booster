from flask import Blueprint
from flask import request
from flask import Response
from bson.objectid import ObjectId
import hashlib
import json
import bson
from connection.database import boost_package_collection, \
    last_login_collection, transaction_collection, \
    history_boost_collection, boost_stars_collection, \
    user_collection, admin_collection, role_collection, \
    ads_collection

from datetime import datetime
from helper.flat_mongo_json import _json_convert
from helper.response import InvalidAPIUsage, ok, empty

admin_api = Blueprint('admin_api', __name__, url_prefix='/v1/admin')

# GLOBAL VARIABLE
now = datetime.now()


@admin_api.route("/dashboard", methods=['POST'])
def get_dashboard():
    count_user = user_collection.count()

    booster_today = list(history_boost_collection.aggregate([
        {'$project': {'amount': 1,
                      'month': {'$month': '$createdAt'},
                      'year': {'$year': '$createdAt'},
                      'day': {'dayOfMonth': '$createdAt'}}},
        {'$match': {'year': now.year,
                    'month': now.month,
                    'day': now.day}}
    ]))

    transactions_today = _json_convert(transaction_collection.aggregate([
        {'$project': {'amount': 1,
                      'month': {'$month': '$createdAt'},
                      'year': {'$year': '$createdAt'},
                      'day': {'dayOfMonth': '$createdAt'}}},
        {'$match': {'year': now.year,
                    'month': now.month,
                    'day': now.day}},
    ]))

    amount_today = 0.0
    for transaction_today in transactions_today:
        amount_today += float(transaction_today.get('amount'))

    total_transactions = transaction_collection.find({})
    amount = 0.0
    for transaction in total_transactions:
        amount += float(transaction.get('amount'))

    return ok({
        'totalUser': count_user,
        'todayBooster': len(booster_today),
        'todayPackageBought': len(transactions_today),
        'totalPackageBought': total_transactions.count(),
        'todayRevenue': float(amount_today),
        'totalRevenue': float(amount)
    })


@admin_api.route("/getPackagesByYear", methods=['POST'])
def get_package_per_year():
    data = request.environ['data']
    package_year = int(data.get('packageYear'))
    product_Id = ObjectId(data.get('productId'))
    start = now.replace(year=package_year, month=1, day=1, minute=0, hour=0, second=0, microsecond=0)
    end = now.replace(year=package_year, month=12, day=31, minute=59, hour=13, second=59, microsecond=0)
    return ok(
        transaction_collection.find(
            {'$and': [{'createdAt': {'$gt': start}}, {'createdAt': {'$lt': end}}, {'productId': product_Id}]}
        )
    )


@admin_api.route("/getBoostByYear", methods=['POST'])
def get_boost_per_year():
    data = request.environ['data']
    package_year = int(data.get('packageYear'))
    boost_stars_id = ObjectId(data.get('boostStarsId'))
    start = now.replace(year=package_year, month=1, day=1, minute=0, hour=0, second=0, microsecond=0)
    end = now.replace(year=package_year, month=12, day=31, minute=59, hour=13, second=59, microsecond=0)
    return ok(
        history_boost_collection.find(
            {'$and': [{'createdAt': {'$gt': start}}, {'createdAt': {'$lt': end}}, {'boostStarsId': boost_stars_id}]}
        )
    )


@admin_api.route("/getAllPackages", methods=['POST'])
def get_all_packages():
    return ok(
        boost_package_collection.find({},
                                      {'createdAt': 1,
                                       'updatedAt': 1,
                                       'packageId': 1,
                                       'packageStar': 1,
                                       'packageName': 1,
                                       'pricing': 1,
                                       'os': 1
                                       })
    )


@admin_api.route("/getAllBoost", methods=['POST'])
def get_all_boost():
    return ok(
        boost_stars_collection.find({},
                                    {'createdAt': 1,
                                     'updatedAt': 1,
                                     'stars': 1,
                                     'numberOfFollower': 1,
                                     })
    )


@admin_api.route("/getLastLoginByMonth", methods=['POST'])
def get_last_login_by_month():
    data = request.environ['data']
    yeah = int(data.get('year'))
    month = int(data.get('month'))
    return ok(
        last_login_collection.aggregate([
            {'$project': {'userId': 1,
                          'month': {'$month': '$lastLogin'},
                          'year': {'$year': '$lastLogin'},
                          'day': {'$dayOfMonth': '$lastLogin'}}},

            {'$match': {'month': month,
                        'year': yeah}}

        ])
    )


@admin_api.route("/getListUser", methods=['POST'])
def get_list_user():
    user = user_collection.aggregate([
        {'$lookup': {
            'from': 'transactions',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'transaction'
        }},

        {'$lookup': {
            'from': 'history-boost',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'historyBoost'
        }},

        {'$project': {
            '_id': '$_id',
            'uniqueId': '$uniqueId',
            'following': '$following',
            'like': '$heart',
            'fans': '$fans',
            'covers': '$covers',
            'wallet': '$stars',
            'numOfTransaction': {'$size': '$transaction'},
            'transaction': {'$arrayElemAt': ["$transaction", -1]},
            'numOfBoost': {'$size': '$historyBoost'},
            'historyBoost': {'$arrayElemAt': ["$historyBoost", -1]}
        }},

    ])
    return ok(
        user
    )


@admin_api.route("/getUserDetail", methods=['POST'])
def get_user_detail():
    data = request.environ['data']
    userId = ObjectId(data.get('userId'))
    user = user_collection.aggregate([
        {'$match': {'_id': userId}},
        {'$lookup': {
            'from': 'transactions',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'transaction'
        }},
        {'$lookup': {
            'from': 'boost-package',
            'localField': 'transaction.productId',
            'foreignField': '_id',
            'as': 'transaction'
        }},
        {'$sort': {'transaction.createdAt': 1}},
        {'$lookup': {
            'from': 'history-boost',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'historyBoost'
        }},
        {'$sort': {'historyBoost.createdAt': 1}},
        {'$project': {
            '_id': '$_id',
            'uniqueId': '$uniqueId',
            'following': '$following',
            'like': '$heart',
            'fans': '$fans',
            'wallet': '$stars',
            'numOfTransaction': {'$size': '$transaction'},
            'transaction': '$transaction',
            'numOfBoost': {'$size': '$historyBoost'},
            'historyBoost': '$historyBoost',
            'covers': '$covers'
        }},
    ])
    return ok(
        user
    )


@admin_api.route("/createBoost", methods=['POST'])
def create_boost():
    data = request.environ['data']
    stars = int(data.get('stars'))
    number_of_follower = int(data.get('numberOfFollower'))
    boost = boost_stars_collection.find({'stars': stars}).count()

    if boost != 0:
        raise InvalidAPIUsage('Stars has exists', status_code=200)
    boost_stars_collection.save({
        'stars': stars,
        'numberOfFollower': number_of_follower,
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })

    return empty()


@admin_api.route("/updateBoost", methods=['POST'])
def update_boost():
    data = request.environ['data']
    boost_id = data.get('boostId')
    stars = int(data.get('stars'))
    number_of_follower = int(data.get('numberOfFollower'))

    if None in (boost_id, stars, number_of_follower):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    boost = _json_convert(boost_stars_collection.find_one({'_id': ObjectId(boost_id)}))
    if boost is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)

    boost_stars_collection.update_one(
        {'_id': ObjectId(boost.get('_id'))},
        {'$set': {'stars': stars,
                  'numberOfFollower': number_of_follower,
                  'updatedAt': datetime.now()}}
    )
    return ok(
        boost_stars_collection.find_one({'_id': ObjectId(boost_id)})
    )


@admin_api.route("/removeBoost", methods=['POST'])
def remove_boost():
    data = request.environ['data']
    boost_id = data.get('boostId')

    if boost_id is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    boost = _json_convert(boost_stars_collection.find_one({'_id': ObjectId(boost_id)}))
    if boost is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)

    boost_stars_collection.remove({'_id': ObjectId(boost_id)})

    return empty()


@admin_api.route("/createPackage", methods=['POST'])
def create_package():
    data = request.environ['data']
    packageId = data.get('packageId')
    os = data.get('os')
    package_name = data.get('packageName')
    package_star = int(data.get('packageStar'))
    pricing = float(data.get('pricing'))
    package = boost_package_collection.find({'packageId': packageId, 'os': os}).count()

    if package != 0:
        raise InvalidAPIUsage('Package has exists', status_code=200)
    boost_package_collection.save({
        'packageId': packageId,
        'os': os,
        'packageName': package_name,
        'packageStar': package_star,
        'pricing': pricing,
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })

    return empty()


@admin_api.route("/updatePackage", methods=['POST'])
def update_package():
    data = request.environ['data']
    package_id = ObjectId(data.get('packageId'))
    os = data.get('os')
    package_name = data.get('packageName')
    package_star = int(data.get('packageStar'))
    pricing = float(data.get('pricing'))

    if None in (package_id, os, package_name, package_star, pricing):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    package = _json_convert(boost_package_collection.find_one({'_id': package_id, 'os': os}))
    if package is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)

    boost_package_collection.update_one(
        {'_id': ObjectId(package.get('_id'))},
        {'$set': {'packageName': package_name,
                  'packageStar': package_star,
                  'pricing': pricing,
                  'updatedAt': datetime.now()}}
    )

    return ok(
        boost_package_collection.find_one({'_id': package_id})
    )


@admin_api.route("/removePackage", methods=['POST'])
def remove_package():
    data = request.environ['data']
    package_id = ObjectId(data.get('packageId'))
    os = data.get('os')

    if None in (package_id, os):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    package = _json_convert(boost_package_collection.find_one({'_id': package_id, 'os': os}))
    if package is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    boost_package_collection.remove({'_id': ObjectId(package.get('_id'))})
    return empty()


@admin_api.route("/getProfile", methods=['POST'])
def get_profile():
    admin = len(_json_convert(admin_collection.find({})))
    status = 0
    if admin > 0:
        status = 1
    to_insert = [
        {"title": "viewer"},
        {"title": "admin"}
    ]
    role = len(_json_convert(role_collection.find({})))
    if role == 0:
        role_collection.insert_many(to_insert)
    resp = Response(json.dumps({'data': status,
                                'message': 'success',
                                'error': 0},
                               default=bson.json_util.default),
                    mimetype='application/json')
    return resp


@admin_api.route("/signup", methods=['POST'])
def signup():
    data = request.environ['data']
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    print('firstname: {}, lastname: {}, email: {}, password: {}'.format(first_name, last_name, email, password))
    if None in (email, password, first_name, last_name):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    admin = _json_convert(admin_collection.find({}))
    print('admin count: {}'.format(admin))
    if len(admin) != 0:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    role = _json_convert(role_collection.find_one({'title': 'admin'}))
    if role is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)

    admin = _json_convert(admin_collection.insert({
        'firstName': first_name,
        'lastName': last_name,
        'email': email,
        'password': hashlib.md5(password.encode('utf-8')).hexdigest(),
        'role': ObjectId(role.get('_id')),
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    }))

    return ok({
        '_id': admin,
        'firstName': first_name,
        'lastName': last_name,
        'email': email,
        'role': role
    })


@admin_api.route("/login", methods=['POST'])
def login():
    data = request.environ['data']
    email = data.get('email')
    password = data.get('password')
    if None in (email, password):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    admin = _json_convert(admin_collection.aggregate([
        {'$match': {'$and':  [{'email': email, 'password': hashlib.md5(password.encode('utf-8')).hexdigest()}]}},
        {'$lookup': {
            'from': 'role',
            'localField': 'role',
            'foreignField': '_id',
            'as': 'role'
        }},
        {'$project': {
            '_id': '$_id',
            'email': '$email',
            'firstName': '$firstName',
            'lastName': '$lastName',
            'role': {'$arrayElemAt': ["$role", -1]}
        }}
    ]))
    if len(admin) == 0:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    return ok(
        admin[0]
    )


@admin_api.route("/updateProfile", methods=['POST'])
def update_profile():
    data = request.environ['data']
    user_id = ObjectId(data.get('userId'))
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    if None in (first_name, last_name, user_id):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    admin_collection.find_one_and_update(
        {'_id': user_id},
        {'$set':  {'firstName': first_name,
                   'lastName': last_name,
                   }}
    )
    admin = _json_convert(admin_collection.aggregate([
        {'$match': {'_id': user_id}},
        {'$lookup': {
            'from': 'role',
            'localField': 'role',
            'foreignField': '_id',
            'as': 'role'
        }},
        {'$project': {
            '_id': '$_id',
            'email': '$email',
            'firstName': '$firstName',
            'lastName': '$lastName',
            'role': {'$arrayElemAt': ["$role", -1]}
        }}
    ]))
    return ok(
        admin[0]
    )


@admin_api.route("/changePassword", methods=['POST'])
def change_password():
    data = request.environ['data']
    user_id = data.get('userId')
    password = data.get('password')
    new_password = data.get('newPassword')
    if None in (password, user_id, new_password):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    admin = _json_convert(admin_collection.find_one({'_id': ObjectId(user_id)}))
    if admin is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    password = hashlib.md5(password.encode('utf-8')).hexdigest()
    new_password = hashlib.md5(new_password.encode('utf-8')).hexdigest()
    old_password = admin.get('password')
    if old_password != password:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    admin_collection.find_one_and_update(
        {'_id': ObjectId(user_id)},
        {'$set':  {'password': new_password}}
    )
    return empty()


@admin_api.route("/getAdPackge", methods=['POST'])
def get_ads():
    ads = _json_convert(ads_collection.find({}))
    if len(ads) > 0:
        resp = Response(json.dumps({'data': ads,
                                    'message': 'success',
                                    'error': 0},
                                   default=bson.json_util.default),
                        mimetype='application/json')
        return resp

    ads_collection.insert({
        "adsType": "bottom-ads",
        "configType": "ads",
        "adsName": "Bottom Ads",
        "adsId": "",
        "enable": True
    })

    ads_collection.insert({
        "adsType": "full-ads",
        "configType": "ads",
        "adsName": "Full Screen",
        "adsId": "",
        "enable": True
    })

    ads_collection.insert({
        "adsType": "video-ads",
        "configType": "ads",
        "adsName": "Video Reward",
        "adsId": "",
        "enable": True
    })
    return get_ads()


@admin_api.route("/updateAds", methods=['POST'])
def update_ads():
    data = request.environ['data']
    id = data.get('id')
    ads_id = data.get('adsId')
    enable = bool(data.get('enable'))
    if None is (id, ads_id, enable):
        raise InvalidAPIUsage('something wrong!', status_code=200)
    ads = _json_convert(ads_collection.find_one({'_id': ObjectId(id)}))
    if ads is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    ads_collection.update_one(
        {'_id': ObjectId(id)},
        {'$set': {'adsId': ads_id, 'enable': enable}}
    )
    ads = _json_convert(ads_collection.find_one({'_id': ObjectId(id)}))
    return ok(
        ads
    )


@admin_api.route("/deleteUser", methods=['POST'])
def delete_user():
    data = request.environ['data']
    ids = data.get('userIds')

    if ids is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)
    ids = list(map(lambda x: ObjectId(x), ids))
    user_collection.delete_many({
        '_id': {'$in': ids}
    })
    return empty()


