# musicmash-backend

## Running

### Running with a mongo Docker container
```
// Build the image
$ sudo docker build -t musicmash-api .
// Create a data directory for the mongo Docker container
$ sudo mkdir -p /musicmash/data/datadir
// Run the DB used for user authentication
$ sudo docker run -d --name musicmash-mongo -v /musicmash/data/datadir:/data/db -p 27017:27017 mongo --auth
// Run the API image
$ sudo docker run --name musicmash-api --env-file .env.list -p 8080:8080 -d --link musicmash-mongo:mongo musicmash-api
```
### Running just the API
*The mongo database connection properties can be specified in the .env.list file*

```
$ sudo docker build -t musicmash-api .
$ sudo docker run --name musicmash-api --env-file .env.list -p 8080:8080 -d musicmash-api
```

#### Environment variables example
*A template can be found in the file .env.list.example`

```
SPOTIFY_ID=app_id
SPOTIFY_SECRET=secret
SOUNDCLOUD_ID=app_id
YOUTUBE_KEY=api_key
HOST=localhost
PORT=8080   // Port to run the server on
APP_SECRET=super secret phrase  // Used by JWT
MONGO_HOST=mongo    // If using Dockerized mongo, use the alias specified when running the container.
MONGO_PORT=27017
MONGO_USERNAME=user
MONGO_PASSWORD=secret
MONGO_DATABASE=musicmash
```

## API documentation

[**API docs are hosted with _Postman_ here**](https://documenter.getpostman.com/view/4961373/RWgrzJhh)