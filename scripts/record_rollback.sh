#!/bin/bash

# CID of the file to unpin
CID=$1

# Unpin the file
ipfs pin rm $CID

# Run garbage collection
ipfs repo gc

echo "Process Completed!"
