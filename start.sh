#!/bin/bash

# echo "Your OS?"
# select os in "Windows" "Others"
# do
#   if [ "$os" == "" ]; then
#     echo "Please choose!";
#   else
#     break
#   fi
# done

# if [ "$os" == "Windows" ]; then
#   os="-windows"
# else
#   os=""
# fi

LIST=("local devserver staging production exit")

select n in $LIST
do
  if [ "$n" == "" ]; then
    echo "Please choose!";
  else
    break
  fi
done

if [ "$n" = "staging" ]; then
    # start docker
    docker-compose up -d --build app-staging webserver-staging

    # because staging and prod are built on one server, staging's ssl will refer to prod's ssl

    # # create ssl
    # yes_no_question=("YES NO")
    # echo "Do you want to generate a new SSL certificate?"
    # select answer in $yes_no_question
    # do
    #   if [ "$answer" == "YES" ]; then
    #     docker-compose run --rm certbot certonly --webroot -w /var/www/app -d exam-site.briswell-vn.com --email exam-site@briswell-vn.com --agree-tos --no-eff-email
    #   fi
    #   break;
    # done
    # # add cron renew-cert
    # sh config/ssl/renew.sh

    # # replace #_# to ''
    # sed -i -e "s/#_#//g" config/nginx/default-staging.conf
    # # restart nginx
    # docker-compose restart webserver-staging
    sudo docker restart app-staging
    sudo docker restart webserver-staging

elif [ "$n" = "production" ]; then
    # start docker
    docker-compose up -d --build app-production webserver-production

    # create ssl
    yes_no_question=("YES NO")
    echo "Do you want to generate a new SSL certificate?"
    select answer in $yes_no_question
    do
      if [ "$answer" == "YES" ]; then
        docker-compose run --rm certbot certonly --webroot -w /var/www/app -d exam-site.briswell-vn.com --email exam-site@briswell-vn.com --agree-tos --no-eff-email
      fi
      break;
    done
    # add cron renew-cert
    sh config/ssl/renew.sh

    # replace #_# to ''
    sed -i -e "s/#_#//g" config/nginx/default-production.conf
    # restart nginx
    docker-compose restart webserver-production

    sudo docker restart app-production
    sudo docker restart webserver-production

elif [ "$n" = "devserver" ]; then
    # start docker
    docker-compose up -d --build app-dev webserver-dev

    # create ssl
    yes_no_question=("YES NO")
    echo "Do you want to generate a new SSL certificate?"
    select answer in $yes_no_question
    do
      if [ "$answer" == "YES" ]; then
        docker-compose run --rm certbot certonly --webroot -w /var/www/app -d dev-exam-site.briswell-vn.com --email exam-site-dev@briswell-vn.com --agree-tos --no-eff-email
      fi
      break;
    done
    # add cron renew-cert
    sh config/ssl/renew.sh

    # replace #_# to ''
    sed -i -e "s/#_#//g" config/nginx/default-start.conf
    # restart nginx
    docker-compose restart webserver-dev
    
    sudo docker restart app-dev
    sudo docker restart webserver-dev

elif [ "$n" = "local" ]; then
    # start docker
    docker-compose up -d --build app-start webserver-start

else
    exit 0;
fi
