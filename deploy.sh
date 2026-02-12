#!/usr/bin/env bash

# Exit on error
set -e

echo "Building for production..."
npm run build

echo "Navigating to build output..."
cd dist

echo "Initializing git repository..."
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

echo "Pushing to gh-pages branch..."
git push -f git@github.com:AiyoyoSoftware/24xx-Companion.git main:gh-pages

echo "Cleaning up..."
cd ..
rm -rf dist/.git

echo "✅ Deployment complete!"
