import requests
import os
import urllib.request
from urllib.parse import quote
import json
from helper import response
import string
import random
import re

# TIKTOK
def tiktok_api_get_profile(username):
    r = requests.get(
        "https://tiktok.com/@{}?lang=en".format(quote(username)),
        headers={
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "path": "/@{}".format(quote(username)),
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        },
        cookies={
            "sessionid": "",
            "tt_webid_v2": "68{}".format(id_generator(16, '0123456789'))
        },
    )

    try:
        profile = __extract_tag_contents(r.text)
        return profile
    except Exception:
        return {}


def extract_raw(html):
    nonce_start = '<head nonce="'
    nonce_end = '">'
    nonce = html.split(nonce_start)[1].split(nonce_end)[0]
    j_raw = html.split(
        '<script id="__NEXT_DATA__" type="application/json" nonce="%s" crossorigin="anonymous">' % nonce
    )[1].split("</script>")[0]
    return j_raw           
    
def __extract_tag_contents(html):
        next_json = re.search(r'id=\"__NEXT_DATA__\"\s+type=\"application\/json\"\s*[^>]+>\s*(?P<next_data>[^<]+)', html)
        if (next_json):
            nonce_start = '<head nonce="'
            nonce_end = '">'
            nonce = html.split(nonce_start)[1].split(nonce_end)[0]
            j_raw = html.split(
                '<script id="__NEXT_DATA__" type="application/json" nonce="%s" crossorigin="anonymous">'
                % nonce
            )[1].split("</script>")[0]
            data = json.loads(j_raw)["props"]["pageProps"]
        
            if 'userInfo' in data:
                userInfoList = data.get('userInfo')
                user = userInfoList.get('user')
                stats = userInfoList.get('stats')
                uniqueId = user.get('uniqueId')
                nickname = user.get('nickname')
                avatarLarger = user.get('avatarLarger')
                signature = user.get('signature')
                verified = user.get('verified')
                id = user.get('id')
                followingCount = stats.get('followingCount')
                followerCount = stats.get('followerCount')
                heartCount = stats.get('heartCount')
                videoCount = stats.get('videoCount')
                jsonProfile = {
                    'signature': signature,
                    'nickname': nickname,
                    'uniqueId': uniqueId,
                    'tiktokId': id,
                    'verified': verified,
                    'following': followerCount,
                    'fans': followingCount,
                    'heart': heartCount,
                    'video': videoCount,
                    'avatarLarger': avatarLarger,
                }
                return jsonProfile
            return j_raw
        else:
            sigi_json = re.search(r'>\s*window\[[\'"]SIGI_STATE[\'"]\]\s*=\s*(?P<sigi_state>{.+});', html)
            if sigi_json:
                j_raw = sigi_json.group(1)
                json_raw = json.loads(j_raw)

                users = json_raw['UserModule']['users']
                jsonProfile = {}
                for key, value in users.items():
                    jsonProfile = {
                        'signature': value.get('signature'),
                        'nickname': value.get('nickname'),
                        'uniqueId': value.get('uniqueId'),
                        'tiktokId': value.get('id'),
                        'verified': value.get('verified'),
                        'avatarLarger': value.get('avatarLarger')
                    }
                    
                stats = json_raw['UserModule']['stats']
                for key, value in stats.items():
                    jsonProfile['fans'] = value.get('followerCount')
                    jsonProfile['following'] = value.get('followingCount')
                    jsonProfile['heart'] = value.get('heart')
                    jsonProfile['video'] = value.get('videoCount')
                return jsonProfile
            else:
                raise Exception('no json found')

def tiktok_api_get_full_profile(username):
    r = requests.get(
        "https://tiktok.com/@{}?lang=en".format(quote(username)),
        headers={
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "path": "/@{}".format(quote(username)),
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        },
        cookies={
            "sessionid": "51b679c75e8d2dc7187af95c17ab9a8d",
            "tt_webid_v2": "68{}".format(id_generator(16, '0123456789'))
        },
    )

    profile = __extract_original_tag_contents(r.text)
    ItemModule = profile['ItemModule']
    return ItemModule

def __extract_original_tag_contents(html):
    sigi_json = re.search(r'>\s*window\[[\'"]SIGI_STATE[\'"]\]\s*=\s*(?P<sigi_state>{.+});', html)
    j_raw = sigi_json.group(1)
    json_raw = json.loads(j_raw)
    return json_raw 

def freeze(d):
    if isinstance(d, dict):
        return frozenset((key, freeze(value)) for key, value in d.items())
    elif isinstance(d, list):
        return tuple(freeze(value) for value in d)
    return d

# Google
def download_avatar(url, name):
    """ Download avatar"""
    name = name + '.jpeg'
    image_save_path = os.getcwd() + '/tmp/' + os.path.basename(name)
    urllib.request.urlretrieve(url, image_save_path)
    print('avatar: {}'.format(image_save_path))
    return name


def id_generator(size=16, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
