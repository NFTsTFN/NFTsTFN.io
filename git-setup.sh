#!/bin/bash

echo "Initializing Git repository..."
git init

echo "Adding all files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit"

echo "Adding remote origin..."
git remote add origin https://github.com/NFTsTFN/NFTsTFN.io.git

echo "Fetching remote repository..."
git fetch origin

echo "Resetting to match remote state..."
git reset --soft origin/main

echo "Adding all changes..."
git add .

echo "Creating merge commit..."
git commit -m "Merge with remote"

echo "Pushing to remote repository..."
git push -u origin main

echo "Setup complete!"
