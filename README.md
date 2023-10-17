## License

UNLICENSED

# How to start
- install docker
  - Docker Desktop (local side): https://www.docker.com/get-started
  - Docker Engine (server side): https://docs.docker.com/engine/install/

- run migration
  - install sequelize
    >npm install -g sequelize-cli
  - set temporary environment variable
    >export NODE_ENV=your_env

    >export MYSQL_USERNAME=your_username

    >export MYSQL_PASSWORD=your_password

    >export MYSQL_PORT=3306

    >export MYSQL_HOST=your_host

    >export MYSQL_DATABASE=your_database_name
  - execute the migrate
    >npm run migrate 

- SERVER side
  - Checkout source code
  - Move to the root directory of source
  - run this shell `sh start.sh` then choose production, staging or develop mode

- Local side: not need to use docker.
  - Checkout source code
  - Move to the root directory of source
  - Install library: `npm install`
  - Compile webpack: `npm run build`
  - Start: `npm run start`
