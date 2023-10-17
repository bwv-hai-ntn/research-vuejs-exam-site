#!/bin/bash

DIR="/home/ec2-user/cron/";
FILE_NAME="${DIR}renew-cert.sh";
FILE_LOG="${DIR}renew-cert-`date '+%Y-%m-%d'`.log 2>&1";

mkdir -p ${DIR}

# remove existing cron
crontab -l | grep -v "${FILE_NAME}"| crontab -

# cron's content
echo "#!/bin/bash

# 証明書の更新
docker-compose run --rm certbot renew
# nginxのリロード
docker-compose restart webserver-start
docker-compose restart webserver-staging
docker-compose restart webserver-production
" > ${FILE_NAME}

# add cron
crontab -l > renewcron
echo "0 0 * * 0 sh -f ${FILE_NAME} > ${FILE_LOG}" >> renewcron
crontab renewcron
rm renewcron
