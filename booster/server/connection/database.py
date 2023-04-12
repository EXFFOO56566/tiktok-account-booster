from pymongo import MongoClient
from config import kDatabase_Host, \
    kDatabase_Name, kDatabase_Password,\
    kDatabase_Username, kDatabase_Port

# PYMONGO ORM
client = MongoClient(host=kDatabase_Host,
                     port=kDatabase_Port,
                     username=kDatabase_Username,
                     password=kDatabase_Password)

db = client.get_database(kDatabase_Name)
user_collection = db.get_collection('users')
feed_collection = db.get_collection('feeds')
transaction_collection = db.get_collection('transactions')
history_boost_collection = db.get_collection('history-boost')
history_follow_collection = db.get_collection('history-follow')
boost_package_collection = db.get_collection('boost-package')
boost_stars_collection = db.get_collection('boost-stars')
last_login_collection = db.get_collection('last-login')
admin_collection = db.get_collection('admin')
role_collection = db.get_collection('role')
ads_collection = db.get_collection('ads')
tracking_collection = db.get_collection('trackings')
