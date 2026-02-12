#!/usr/bin/env bash

# Exit on error
set -e

echo "Building for production..."
npm run build

echo "Navigating to build output..."
cd dist

echo "Cleaning up any existing git repository..."
rm -rf .git

echo "Initializing git repository..."
git init
echo "Creating .nojekyll file..."
touch .nojekyll
git add -A
git commit -m 'Deploy to GitHub Pages'

echo "Pushing to gh-pages branch..."
git push -f https://github.com/AiyoyoSoftware/24xx-Companion.git master:gh-pages

echo "Cleaning up..."
cd ..
rm -rf dist/.git

echo "✅ Deployment complete!"
