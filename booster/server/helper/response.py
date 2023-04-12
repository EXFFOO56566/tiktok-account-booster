from flask import Response
import json
import bson
from helper.flat_mongo_json import _json_convert

class InvalidAPIUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['error'] = 1
        return rv


def ok(payload):
    resp = Response(json.dumps(
        {
            'data': _json_convert(payload),
            'message': 'success',
            'error': 0
        },
        default=bson.json_util.default),
        mimetype='application/json')
    return resp


def empty():
    resp = Response(json.dumps(
        {
            'data': '',
            'message': 'success',
            'error': 0
        },
        default=bson.json_util.default),
        mimetype='application/json')
    return resp
