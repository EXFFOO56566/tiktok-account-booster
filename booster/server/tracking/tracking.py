from connection.database import tracking_collection
from re import search
from bson.objectid import ObjectId
from datetime import datetime

# LOGGING
def wit_tracking(request):
    environ = request.environ
    data = environ['data']
    uri = environ.get('REQUEST_URI')

    # RETURN IF USER IS ADMIN
    if search('v1/admin', uri):
        return
    userId = ObjectId(data.get('userId'))
    imei = data.get('imei')
    screen_display_id = data.get('screen_display_id')
    model = data.get('model')
    manufacturer = data.get('manufacturer')
    os_codename = data.get('os_codename')
    os_version = data.get('os_version')
    product = data.get('product')
    hardware = data.get('hardware')
    display_version = data.get('display_version')
    bundleId = data.get('bundleId')
    versionCode = data.get('versionCode')
    versionName = data.get('versionName')
    packageName = data.get('packageName')
    hash = data.get('hash')
    time = data.get('time')

    content_type = environ.get('CONTENT_TYPE')
    http_user_agent = environ.get('HTTP_USER_AGENT')
    http_host = environ.get('HTTP_HOST')
    http_accept_encoding = environ.get('HTTP_ACCEPT_ENCODING')
    remote_port = environ.get('REMOTE_PORT')
    tracking_collection.insert({
        'userId': userId,
        'imei': imei,
        'screenDisplayId': screen_display_id,
        'model': model,
        'manufacturer': manufacturer,
        'osCodename': os_codename,
        'osVersion': os_version,
        'product': product,
        'hardware': hardware,
        'displayVersion': display_version,
        'bundleId': bundleId,
        'versionCode': versionCode,
        'versionName': versionName,
        'packageName': packageName,
        'hash': hash,
        'time': time,
        'uri': uri,
        'contentType': content_type,
        'http_user_agent': http_user_agent,
        'http_host': http_host,
        'http_accept_encoding': http_accept_encoding,
        'remote_port': remote_port,
        'createdAt': datetime.now()
    })


