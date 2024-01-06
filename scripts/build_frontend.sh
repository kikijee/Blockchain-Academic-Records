#!/bin/bash

# Navigate to your project directory (update this if needed)
cd /home/cjledet/Blockchain-Education-Records/frontend/

# Run the build process
echo "Starting npm build..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Exiting."
    exit 1
fi

echo "Build completed successfully!"

# Transfer the build directory to the server
echo "Transferring build to server..."
scp -r -i ../../education_records.pem ./build ubuntu@52.53.105.2:/var/www/html/

if [ $? -ne 0 ]; then
    echo "Transfer failed. Exiting."
    exit 1
fi

echo "Transfer completed successfully!"
