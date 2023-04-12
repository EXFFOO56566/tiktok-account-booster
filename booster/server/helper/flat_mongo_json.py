import json
from flask import Flask, make_response
import datetime
from bson.objectid import ObjectId
from bson.tz_util import utc
from bson import EPOCH_AWARE, SON
from bson.py3compat import iteritems
from bson.py3compat import text_type

"""
Adapted from bson.json_util module
"""


def _default(obj):
    # We preserve key order when rendering SON, DBRef, etc. as JSON by
    # returning a SON for those types instead of a dict.
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime.datetime):
        if not obj.tzinfo:
            obj = obj.replace(tzinfo=utc)
        if obj >= EPOCH_AWARE:
            off = obj.tzinfo.utcoffset(obj)
            if (off.days, off.seconds, off.microseconds) == (0, 0, 0):
                tz_string = 'Z'
            else:
                tz_string = obj.strftime('%z')
            return "%s.%03d%s" % (
                obj.strftime("%Y-%m-%dT%H:%M:%S"),
                int(obj.microsecond / 1000),
                tz_string)

    raise TypeError("%r is not JSON serializable" % obj)


def _json_convert(obj):
    """Recursive helper method that converts BSON types so they can be
    converted into json.
    """
    if hasattr(obj, 'iteritems') or hasattr(obj, 'items'):
        return SON(((k, _json_convert(v))
                    for k, v in iteritems(obj)))
    elif hasattr(obj, '__iter__') and not isinstance(obj, (text_type, bytes)):
        return list((_json_convert(v) for v in obj))
    try:
        return _default(obj)
    except TypeError:
        return obj


def json_response(obj, code=200):
    """
    Build a JSON response
    """
    data = json.dumps(_json_convert(obj))
    resp = make_response(data, code)
    resp.headers.extend({'content-type': 'application/json'})
    return resp
