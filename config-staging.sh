# start docker
docker-compose up -d --build app-staging webserver-staging
sudo docker restart app-staging
sudo docker restart webserver-staging