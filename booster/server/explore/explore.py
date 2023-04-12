import json
import bson
import pymongo
from helper.response import InvalidAPIUsage, ok
from flask import Blueprint, request, Response
from connection.database import feed_collection, user_collection, history_follow_collection
from bson.objectid import ObjectId
from helper.flat_mongo_json import _json_convert
from config import kUser_Not_Found, kTiktok_Not_Found
from datetime import datetime
from tiktok.tiktok import tiktok_api_get_profile
explore_api = Blueprint('explore_api', __name__, url_prefix='/v1/api/feeds')


@explore_api.route('/get', methods=['POST'])
def feeds():
    data = request.environ['data']
    return get_fedd(data)


def get_fedd(data):
    page_num = data.get('page')
    page_size = data.get('size')
    userId = data.get('userid')
    skips = page_size * (page_num - 1)

    # QUERY HISTORY FIRST
    if len(userId) == 24:
        # QUERY USER TO GET UNIQUEID
        user = user_collection.find_one({'_id': ObjectId(userId)})
        if user is None:
            raise InvalidAPIUsage(kUser_Not_Found, status_code=200)
        histories = [ObjectId(userId)]
        history_follow = _json_convert(history_follow_collection.find({'userId': ObjectId(userId)}))
        for history in history_follow:
            histories.append(ObjectId(history.get('feedId')))
        return ok(feed_collection.find({'$and': [{'covers': {'$exists': True}},
                                           {'_id': {'$nin': histories}},
                                           {'uniqueId': {'$ne': user.get('uniqueId')}}]},
                                 {'nickname': 1,
                                  'uniqueId': 1,
                                  'signature': 1,
                                  '_id': 1,
                                  'covers': 1}).sort(
                [('boostStars', pymongo.DESCENDING), ('_id', pymongo.DESCENDING)]).skip(skips).limit(page_size))
    else:
        return ok(feed_collection.find({'covers': {'$exists': True}},
                                 {'nickname': 1,
                                  'uniqueId': 1,
                                  'signature': 1,
                                  '_id': 1,
                                  'covers': 1}).sort(
                [('boostStars', pymongo.DESCENDING), ('_id', pymongo.DESCENDING)]).skip(skips).limit(page_size))

@explore_api.route('/follow', methods=['POST'])
def follow():
    data = request.environ['data']
    user_id = ObjectId(data.get('userId'))
    feed_id = ObjectId(data.get('feedId'))

    user = _json_convert(user_collection.find_one({'_id': user_id}))
    if user is None:
        raise InvalidAPIUsage(kUser_Not_Found, status_code=200)
    if 'fans' not in user:
        raise InvalidAPIUsage(kUser_Not_Found, status_code=200)
    feed = _json_convert(feed_collection.find_one({'_id': feed_id}))
    if feed is None:
        raise InvalidAPIUsage(kUser_Not_Found, status_code=200)
    if 'uniqueId' not in user:
        raise InvalidAPIUsage(kUser_Not_Found, status_code=200)
    try:
        # check if user following

        tiktok = tiktok_api_get_profile(user.get('uniqueId'))

        tiktok_fans = tiktok.get('fans')
        user_fans = user.get('fans')

        if tiktok_fans > user_fans:
            # Remove 1 booster
            if 'boostStars' in feed:
                boost_stars = int(feed.get('boostStars'))
                if boost_stars > 0:
                    boost_stars -= 1
                    feed_collection.update_one({'_id': feed_id},
                                               {'$set': {'boostStars': boost_stars,
                                                         'updatedAt': datetime.now()}})

            # Give 1 stars reward for user
            stars = user.get('stars')
            stars += 1
            user_collection.update_one({'_id': user_id}, {'$set': {'stars': stars, 'fans': tiktok_fans}}, upsert=True)
            user['stars'] = stars

            # CHECK IF HISTORY IS EXIST
            history = history_follow_collection.find_one({'$and': [{'feedId': feed_id}, {'userId': user_id}]})
            if history is None:
                history_follow_collection.save({
                    'feedId': feed_id,
                    'userId': user_id,
                    'createdAt': datetime.now()
                })
            history_follow_collection.save({
                'feedId': feed_id,
                'userId': user_id,
                'createdAt': datetime.now()
            })
            return ok({'success': 1})
        else:
            return ok({'success': 0})
    except:
        raise InvalidAPIUsage(kTiktok_Not_Found, status_code=200)
