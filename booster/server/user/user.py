from flask import Blueprint, request
from connection.database import user_collection, last_login_collection
from helper.flat_mongo_json import _json_convert
from helper.response import InvalidAPIUsage, ok, empty
from bson.objectid import ObjectId
from tiktok.tiktok import tiktok_api_get_profile, download_avatar
from datetime import datetime, timedelta
from config import API
user_api = Blueprint('user_api', __name__, url_prefix='/v1/api/user')


@user_api.route('/login', methods=['POST'])
def login():
        data = request.environ['data']
        username = data.get('username')
        print('Starting get username: {}'.format(username))
        date = datetime.now()

        jsonProfile = tiktok_api_get_profile(username)
        fans = jsonProfile.get('fans')
        heart = jsonProfile.get('heart')
        video = jsonProfile.get('video')
        following = jsonProfile.get('following')
        uniqueId = jsonProfile.get('uniqueId')
        user = user_collection.find_one({'uniqueId': username})
        if user is not None:
            url = user.get('covers')
            if len(url) == 0:
                url = download_avatar(jsonProfile.get('avatarLarger').replace('\\u0026', '&'), username)
            else:
                if 'updatedAt' in user:
                    updatedAt = user.get('updatedAt')
                    date_time = updatedAt + timedelta(days=3)
                    if date > date_time:
                        url = download_avatar(jsonProfile.get('avatarLarger').replace('\\u0026', '&'), username)
        else:
            url = download_avatar(jsonProfile.get('avatarLarger').replace('\\u0026', '&'), username)

        # MONGODB: INSERT USER COLLECTION
        if not user:
            jsonProfile['stars'] = 5
            jsonProfile['isNew'] = True
            jsonProfile['createdAt'] = date
            jsonProfile['updatedAt'] = date
            jsonProfile['covers'] = '{}images/{}'.format(API, url)
            user_collection.save(jsonProfile)
        else:
            user_id = ObjectId(user.get('_id'))
            jsonProfile['stars'] = user.get('stars')
            user_collection.update_one({'_id': user_id}, {'$set':
                                                              {
                                                               'fans': fans,
                                                               'heart': heart,
                                                               'video': video,
                                                               'following': following,
                                                               'isNew': False,
                                                               'updatedAt': date}})
        user = _json_convert(user_collection.find_one({'uniqueId': uniqueId}))
        data = _json_convert(user)
        return returnProfile(data)


def returnProfile(data):
    user_id = ObjectId(data.get('_id'))
    last_login_collection.save({
        'userId':  user_id,
        'lastLogin': datetime.now()
    })
    if 'tokens' in data:
        del data['tokens']
    if 'pageProps' in data:
        del data['pageProps']
    if 'avatarLarger' in data:
        del data['avatarLarger']
    return ok(data)


@user_api.route('/updateToken', methods=['POST'])
def update_token():
    data = request.environ['data']
    token = data.get('token')
    user_id = ObjectId(data.get('userId'))
    user = _json_convert(user_collection.find_one({'_id': user_id}))
    if 'tokens' in user:
        tokens = user.get('tokens')
        if token not in tokens:
            tokens.append(token)
            user_collection.update_one({'_id': user_id}, {'$set': {'tokens': tokens}})
    else:
        user_collection.update_one({'_id': user_id}, {'$set': {'tokens': [token]}})
    last_login_collection.save({'_id': user_id, 'lastLogin': datetime.now()})

    return empty()


@user_api.route('/profile', methods=['POST'])
def get_profile():
    data = request.environ['data']
    userId = data.get('userId')
    user = user_collection.find_one({'_id': ObjectId(userId)})
    if user is None:
        raise InvalidAPIUsage('something wrong!', status_code=200)

    return ok(user)
