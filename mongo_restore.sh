#!/bin/bash

# Load the .env file
export $(grep -v '^#' .env | xargs)

# Check if MONGO_CLOUD_URI is set
if [ -z "$MONGO_CLOUD_URI" ]; then
  echo "MONGO_CLOUD_URI is not set in the .env file."
  exit 1
fi

# Create dumps directory if it doesn't exist
mkdir -p dumps

# Dump the MongoDB database from the cloud to a local file
mongodump --uri="$MONGO_CLOUD_URI" --out=dumps

# Start local MongoDB instance
brew services start mongodb-community@7.0

# Wait for MongoDB to start
sleep 5

# Restore the dumped data to the local MongoDB instance
mongorestore --uri="mongodb://localhost:27017" dumps

# Update .env file with the local MongoDB URI
LOCAL_MONGO_URI="mongodb://localhost:27017"
sed -i.bak "s|MONGO_URI=.*|MONGO_URI=$LOCAL_MONGO_URI|" .env

echo "Database dumped and restored successfully. .env updated with local MongoDB URI."
