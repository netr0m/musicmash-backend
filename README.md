# MusicMash API
> MusicMash is an API that lets you search for music across Spotify, SoundCloud and YouTube from a single endpoint.

## Table of contents
- [Setting up and running](#setting-up-and-running)
- [Environment variables example](#environment-variables-example)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Contribution](#contribution)
- [License](#license)
- [Contributors](#contributors)

## Setting up and running
### Run
1. **Create a virtual environment using a virtual environment tool of your choice, e.g.**

    `nodeenv .env` or `virtualenv .env`
1. **Activate the new environment**

    `source .env/bin/activate`
3. **Load the .envvars file with variables**

    `source .envvars`
4. **Install the required dependencies**

    `npm install` or `yarn install`
5. **Finally, run the server with the following command**

    `npm start` or `yarn start`

### Run the API in a container (option 1)
#### Step 1
##### Build the Docker image
```
docker build -t musicmash-api .
```
##### Run the API
```
docker run -d \
    --name musicmash-api \
    --env-file .env.list \
    -p 8080:80 \
    -p 8080:443 \
    musicmash-api
```

### Run in containers (option 2)
**MongoDB and the API**
#### Step 1
**Create data folder for Mongo**
```
sudo mkdir -p /musicmash/data/datadir
```
**Run MongoDB**
```
docker run -d \
    --name musicmash-mongo \
    -v /musicmash/data/datadir:/data/db \
    --expose 27017 \
    mongo --auth
```

#### Step 2
##### Build the Docker image
```
docker build -t musicmash-api .
```
##### Run the API
```
docker run -d \
    --name musicmash-api \
    --env-file .env.list \
    -p 8080:80 \
    -p 8080:443 \
    --link musicmash-mongo:mongo \
    musicmash-api
```

### Run in containers (option 3)
**With NGINX proxy, automatic Let's Encrypt certificate creation/renewal, MongoDB and the API**
#### Step 1
**NGINX Proxy**
_[See here for full reference on usage](https://github.com/jwilder/nginx-proxy)_
```
docker run -d -p 80:80 -p 443:443 \
    --name musicmash-nginx-proxy \
    -v $HOME/certs:/etc/nginx/certs:ro \
    -v /etc/nginx/vhost.d \
    -v /usr/share/nginx/html \
    -v /var/run/docker.sock:/tmp/docker.sock:ro \
    --label com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy \
    jwilder/nginx-proxy
```

#### Step 2
**LetsEncrypt NGINX companion**
_[See here for full reference on usage](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion)_
```
docker run -d \
    --name musicmash-nginx-letsencrypt \
    -v $HOME/certs:/etc/nginx/certs:rw \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    --volumes-from musicmash-nginx-proxy \
    jrcs/letsencrypt-nginx-proxy-companion
```

#### Step 3 (Optional*)
_*Optional to run in Docker, but a database is required for the API to work_
**Create data folder for Mongo**
```
sudo mkdir -p /musicmash/data/datadir
```
**Run MongoDB**
```
docker run -d \
    --name musicmash-mongo \
    -v /musicmash/data/datadir:/data/db \
    --expose 27017 \
    mongo --auth
```

#### Step 4
##### Build the Docker image
```
docker build -t musicmash-api .
```
##### Run the API
```
docker run -d \
    --name musicmash-api \
    --env-file .env.list \
    -e 'VIRTUAL_HOST=sub.domain.com' \
    -e 'LETSENCRYPT_HOST=sub.domain.com' \
    -e 'LETSENCRYPT_EMAIL=you@domain.com' \
    -p 8080:8080 \
    --link musicmash-mongo:mongo \
    musicmash-api
```

### Environment variables example
_Templates can be found in the files `.envvars.example` and `.env.list.example` (for Docker)_
```
SPOTIFY_ID=app_id
SPOTIFY_SECRET=secret
SOUNDCLOUD_ID=app_id
YOUTUBE_KEY=api_key
HOST=localhost
PORT=8080   // Port to run the server on
NODE_ENV=production
APP_SECRET=super secret phrase  // Used by JWT
MONGO_HOST=mongo    // If using Dockerized mongo, use the alias specified when running the container.
MONGO_PORT=27017
MONGO_USERNAME=user
MONGO_PASSWORD=secret
MONGO_DATABASE=musicmash
```

## API documentation
[**API docs are hosted with _Postman_ here**](https://documenter.getpostman.com/view/4961373/RWgrzJhh)

## Features
Coming soon! In the meantime, see the [API documentation](#api-documentation)

## Contribution
I would love your help in the development of MusicMash. Please follow the guidelines on [Contribution](#contribution) on how to report bugs and request features you'd like to see, in addition to how you can contribute with development.
By following these guidelines, we make sure that communication is efficient and understandable, which will hopefully help to improve the project.

## Bugs and feature requests
If you want to submit a feature request or bug, please keep this in mind:
- Stay on topic, both regarding the request/bug itself and any discussion around it.
- Please avoid opening issues if it involves lines of code you do not understand.

### Bug reports
Definition of a bug:
A bug is an error, fault or failure in the application which is caused by the sourcecode found in this repository, which results in an incorrect or unexpected result.

I appreciate feedback of any sort, and it helps me in developing a great service and growing as a developer. Thank you!
- Please browse the [issue tracker](https://github.com/mortea15/musicmash-backend/issues) before you submit a bug or feature, to avoid duplicate entries.
- Before submitting, make sure to pull the latest version to check if the bug is fixed, or feature is implemented.
- Stick to ONE bug per issue.
#### Please use the following format when submitting:

**Short description of what happened**

*Description*

**Expected behaviour**

*Description*

**Actual Behaviour**

*Description*

**Steps to reproduce**

*Description*

**Your enviroment**

*Operative system and version, Node Version, [Docker version], and any other information of relevance*

### Feature requests
I'm open to suggestions for new features, but please keep in mind that it should be of relevance to this project.
> Including details when submitting feature requests is essential. It makes it easier for the developers to understand the request.

### Pull requests 
- Please include documentation on all code submitted
- If a new feature is implemented, it should be explained in detail in the [Wiki](https://github.com/mortea15/musicmash-backend/wiki)

## License
[GPL3.0](https://github.com/mortea15/musicmash-backend/blob/master/LICENSE)

## Contributors
**Developed by:** [Morten Amundsen (@mortea15)](mortenamundsen.me)