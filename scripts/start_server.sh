#!/bin/bash

# This script is setup to automate running all of the backend 
# Processes needed while testing our production server
# After restarting the server, simply run this script to start
# All backend processes needed for testing (Express Node, React Node, & IPFS Node)

# This line is ran one time at setup only
# sudo ipfs init --profile=lowpower

# Start IPFS daemon in background using &
echo "Starting IPFS daemon..."
sudo ipfs daemon &

# Give IPFS a few seconds to initialize
sleep 3

# Start the Node.js server in background using &
echo "Starting Node.js server..."
cd ../server
sudo node index.js &

# Start the React app in background using &
echo "Starting React app..."
cd ../frontend
npm start &

# Return to the root directory
cd ..

echo "All components started!"
