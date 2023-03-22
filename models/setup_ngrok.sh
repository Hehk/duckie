#!/bin/bash

# I am using ngrok to tunnel my local server to the internet, this automates setup on a new computer

AUTH_TOKEN="$1"

# Check if ngrok is installed
if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok not found, downloading and installing..."

  # Download ngrok
  wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz

  # Unpack ngrok
  tar -xzf ngrok-v3-stable-linux-amd64.tgz

  # Move ngrok to /usr/bin/ngrok
  sudo mv ngrok /usr/bin/ngrok

  # Cleanup downloaded file
  rm ngrok-v3-stable-linux-amd64.tgz

  # Add auth token
  ngrok config add-authtoken "$AUTH_TOKEN"
fi

# Run ngrok
ngrok http 8000