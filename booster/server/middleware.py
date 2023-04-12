import hashlib
import json
import time
from werkzeug.wrappers import Request, Response
import config
from tracking.tracking import wit_tracking

class middleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        try:
            request = Request(environ)
            if request.url.find('/images/') != -1:
                return self.app(environ, start_response)

            my_json = request.data.decode('utf8').replace("'", '"')
            data = json.loads(my_json)
            hash = data.get('hash')
            t = int(data.get('time'))
            bundle_id = data.get('bundleId')
            unix = int(time.time())
            key = '{}|{}'.format(t, config.kPrivate_Key)
            hash256 = hashlib.sha256(key.encode('utf-8')).hexdigest()
            ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
            # VERIFY TOKEN
            if (hash256 != hash):
                res = Response(u'Authorization failed', mimetype='text/plain', status=401)
                return res(environ, start_response)
            environ['data'] = data
            # LOGGING
            wit_tracking(request)
            return self.app(environ, start_response)
        except:
            res = Response(u'Authorization failed', mimetype='text/plain', status=401)
            return res(environ, start_response)



