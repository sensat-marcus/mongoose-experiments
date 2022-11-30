docker build --tag db .
docker run -p 27017:27017 --network chat --net-alias db db
