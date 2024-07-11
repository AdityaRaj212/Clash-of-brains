#!/usr/bin/env bash

# Navigate to the front-end directory and install dependencies
cd frontend
npm install

# Build the front-end
npm run build

# Navigate back to the root directory
cd ..

# Navigate to the back-end directory and install dependencies
cd backend
npm install