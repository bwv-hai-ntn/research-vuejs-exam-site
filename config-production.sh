# start docker
docker-compose up -d --build app-production webserver-production

# create ssl
docker-compose run --rm certbot certonly --webroot -w /var/www/app -d exam-site.briswell-vn.com --email exam-site@briswell-vn.com --agree-tos --no-eff-email

# add cron renew-cert
sh config/ssl/renew.sh

# replace #_# to ''
sed -i -e "s/#_#//g" config/nginx/default-production.conf

# restart nginx
docker-compose restart webserver-production

sudo docker restart app-production
sudo docker restart webserver-production