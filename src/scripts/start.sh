#!/bin/sh

echo "Running migrations..."
npm run migrate

echo "Adding default Google Sheet..."
node dist/scripts/add-default-sheet.js

echo "Starting application..."
npm run start 