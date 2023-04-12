#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# Detect OS
# $os_version variables aren't always in use, but are kept here for convenience
if grep -qs "ubuntu" /etc/os-release; then
	os="ubuntu"
	os_version=$(grep 'VERSION_ID' /etc/os-release | cut -d '"' -f 2 | tr -d '.')
	group_name="nogroup"
elif [[ -e /etc/debian_version ]]; then
	os="debian"
	os_version=$(grep -oE '[0-9]+' /etc/debian_version | head -1)
	group_name="nogroup"
elif [[ -e /etc/centos-release ]]; then
	os="centos"
	os_version=$(grep -oE '[0-9]+' /etc/centos-release | head -1)
	group_name="nobody"
elif [[ -e /etc/fedora-release ]]; then
	os="fedora"
	os_version=$(grep -oE '[0-9]+' /etc/fedora-release | head -1)
	group_name="nobody"
else
	echo "This installer seems to be running on an unsupported distribution.
Supported distributions are Ubuntu, Debian, CentOS, and Fedora."
	exit
fi

if [[ "$os" == "ubuntu" && "$os_version" -lt 1804 ]]; then
	echo "Ubuntu 18.04 or higher is required to use this installer.
This version of Ubuntu is too old and unsupported."
	exit
fi

if [[ "$os" == "debian" && "$os_version" -lt 9 ]]; then
	echo "Debian 9 or higher is required to use this installer.
This version of Debian is too old and unsupported."
	exit
fi

if [[ "$os" == "centos" && "$os_version" -lt 7 ]]; then
	echo "CentOS 7 or higher is required to use this installer.
This version of CentOS is too old and unsupported."
	exit
fi

# Get public IP and sanitize with grep
get_public_ip=$(grep -m 1 -oE '^[0-9]{1,3}(\.[0-9]{1,3}){3}$' <<< "$(wget -T 10 -t 1 -4qO- "http://ip1.dynupdate.no-ip.com/" || curl -m 10 -4Ls "http://ip1.dynupdate.no-ip.com/")")
read -p "Public IPv4 address / hostname [$get_public_ip]: " public_ip
# If the checkip service is unavailable and user didn't provide input, ask again
until [[ -n "$get_public_ip" || -n "$public_ip" ]]; do
	echo "Invalid input."
	read -p "Public IPv4 address / hostname: " public_ip
done
[[ -z "$public_ip" ]] && public_ip="$get_public_ip"

# Get database name
get_database_name="witbooster"
read -p "Database Name [witbooster]: " database_name
[[ -z "$database_name" ]] && database_name="$get_database_name"

# Get bundle id
get_shared_secret_key="witBooster!@#"
read -p "Shared Secret key [witBooster!@#]: " shared_secret_key
[[ -z "$shared_secret_key" ]] && shared_secret_key="$get_shared_secret_key"


echo " 
################################################
#                UPDATING REPO                 #
################################################
"
apt-get update upgrade
apt-get -y install wget
clear

echo " 
################################################
#               INSTALL PYTHON 3               #
################################################
"

apt-get install software-properties-common -y
add-apt-repository ppa:deadsnakes/ppa
apt-get install python3.8 -y
apt-get install python3-distutils -y
echo " 
################################################
#                 INSTALL PIP 3                #
################################################
"
wget https://bootstrap.pypa.io/get-pip.py
python3.8 get-pip.py
clear

echo " 
################################################
#              INSTALL DEPENDENCY              #
################################################
"
python3.8 -m pip install flask google 
python3.8 -m pip install google-cloud-storage --ignore-installed six oauth2client
python3.8 -m pip install pymongo==3.11.3
python3.8 -m pip install urllib3
python3.8 -m pip install flask_cors
python3.8 -m pip install gevent
python3.8 -m pip install google-api-python-client

echo " 
################################################
#                INSTALL NODEJS                #
################################################
"

apt-get -y install curl software-properties-common
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
apt-get -y install nodejs
clear

echo " 
################################################
#           Installing YARN & PM2              #
################################################
"
npm install yarn pm2 -g
clear

echo " 
################################################
#             Installing MONGODB               #
################################################
"
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -


if [[ "$os" == "debian" && "$os_version" == 10 ]]; then
	echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
fi
if [[ "$os" == "debian" && "$os_version" == 9 ]]; then
	echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
fi

if [[ "$os" == "ubuntu" && "$os_version" == 1804 ]]; then
	echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
fi
if [[ "$os" == "ubuntu" && "$os_version" == 1604 ]]; then
	echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
fi
if [[ "$os" == "ubuntu" && "$os_version" == 2004 ]]; then
	echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
fi

apt-get -y update
apt-get -y install mongodb-org

service mongod restart
clear
echo " 
################################################
#              INSTALL SUCCESSFUL              #
################################################
"

#INSTALL SERVER
path=`pwd`

cat > config.py <<EOF
API = "http://$public_ip:5000/"
kUser_Not_Found = "User not found"
kFeed_Not_Found = "Feed not found"
kTiktok_Not_Found = "Tiktok not found"
kPrivate_Key = "$shared_secret_key"

# DATABASE
kDatabase_Name = "$database_name"
kDatabase_Host = "localhost"
kDatabase_Port = 27017
kDatabase_Username = ""
kDatabase_Password = ""

EOF

mv config.py server/config.py

#INSTALL CMS ADMIN
cat > .env <<EOF
#ENV FOR API
PROXY_API="$public_ip"
API="/v1/"

#ENV FOR APP
APP_ENV=production
APP_VERSION=1.0.0
APP_CODE="witboost"
APP_NAME="Bootser CMS"
APP_DESC="bootser CMS"
APP_FAVICON="/logo.png"
APP_BACKGROUND="#FFF"
APP_COLOR="#FFF"
HASH_CODE="$shared_secret_key"
BUNDLE_CODE="$package_name"
EOF

mv .env admin/.env

cd admin
yarn 
yarn add helmet
yarn build
cd ..
clear

#CREATE STARTING SCRIPT SERVER
cat > start_server.sh <<EOF
cd ./server
pm2 start app.py --interpreter=python3.8 --name=WitBooster-API
EOF

#CREATE STARTING SCRIPT ADMIN
cat > start_admin.sh <<EOF
cd ./admin
NODE_ENV=production PORT=9000 HASH_CODE='$shared_secret_key' PROXY_API='http://$public_ip:5000' pm2 start server/index.js --no-automation --name booster-admin -- start
EOF

chmod +x start_server.sh
chmod +x start_admin.sh

./start_server.sh
./start_admin.sh

echo " 
################################################
#             Congratulations!                 #
################################################

Your WitBooster server is running.
   1. API: http://$public_ip:5000
   2. CMS Admin: http://$public_ip:9000
   3. Database: $database_name
   4. Shared Secret Key: $shared_secret_key
"