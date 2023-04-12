import json
import bson
from helper.response import InvalidAPIUsage, ok
from flask import Blueprint, request, Response
from connection.database import feed_collection, user_collection, history_boost_collection, boost_stars_collection
from bson.objectid import ObjectId
from helper.flat_mongo_json import _json_convert
from datetime import datetime
boost_api = Blueprint('boost_api', __name__, url_prefix='/v1/api/feed')


@boost_api.route('/getAllBoost', methods=['POST'])
def get_all_boost():
    return ok(
        boost_stars_collection.find({})
    )


@boost_api.route('/boost', methods=['POST'])
def boost():
    data = request.environ['data']
    stars = data.get('stars')
    boost_star_id = ObjectId(data.get('boostStarsId'))
    userId = ObjectId(data.get('userId'))
    user = _json_convert(user_collection.find_one({'_id': userId}))

    if user is None:
        raise InvalidAPIUsage('something wrong! user is None', status_code=200)
    uniqueId = user.get('uniqueId')
    real_star = user.get('stars')
    if real_star < stars:
        raise InvalidAPIUsage('something wrong!, real_star < stars', status_code=200)

    feed = _json_convert(feed_collection.find_one({'uniqueId': uniqueId}))
    date = datetime.now()

    # Feed Collection
    if feed is None:
        if '_id' in user:
            del user['_id']
            del user['stars']
        feed = user
        feed['boostStars'] = stars
        feed['createdAt'] = date
        feed['updatedAt'] = date
        feed_collection.save(feed)
    else:
        stars += feed.get('boostStars')
        feed_id = ObjectId(feed.get('_id'))
        feed_collection.update_one({'_id': feed_id},
                                   {'$set': {'boostStars': stars,
                                             'updatedAt': date}},
                                   upsert=True)

    # User Collection
    stars_after_used = real_star - data.get('stars')
    print('real_star: {}, stars {}, stars_after_used {}'.format(real_star, stars, stars_after_used))
    user_collection.update_one({'_id': userId}, {'$set': {'stars': stars_after_used}}, upsert=True)

    # History Collection
    history_boost_collection.save({
        'createdAt': date,
        'updatedAt': date,
        'userId': userId,
        'profile': uniqueId,
        'boostStars': data.get('stars'),
        'boostStarsId': boost_star_id
    })
    return ok({'boost': data.get('stars')})
