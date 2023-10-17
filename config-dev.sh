# start docker
docker-compose up -d --build app-dev webserver-dev

# create ssl
docker-compose run --rm certbot certonly --webroot -w /var/www/app -d dev-exam-site.briswell-vn.com --email exam-site-dev@briswell-vn.com --agree-tos --no-eff-email

# add cron renew-cert
sh config/ssl/renew.sh

# replace #_# to ''
sed -i -e "s/#_#//g" config/nginx/default-start.conf

# restart nginx
docker-compose restart webserver-dev

sudo docker restart app-dev
sudo docker restart webserver-dev
