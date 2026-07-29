#!/bin/sh
set -e  # exit immediately if a command fails

echo "🏗️  Starting Futballero build..."

# 1. Clean old build (optional)
rm -rf dist

# 2. Fetch SEO data — leagues + team logos saved to public/seo/
# Vite copies public/ to dist/ automatically, so this must run before vite build
echo "🔍 Fetching SEO data..."
ts-node build-project/fetch-seo-data.ts
echo "📝 Generating SEO footer snippet..."
ts-node build-project/generate-seo-footer/generate-seo-footer.ts

# 3. Compile TypeScript
echo "📘 Compiling TypeScript..."
tsc -b

# 4. Build with Vite (picks up public/seo/ automatically)
echo "⚡ Running Vite build..."
vite build

echo "🔗 Injecting SEO footer into dist/index.html..."
ts-node build-project/inject-seo-footer.ts

# 5. Copy static files
echo "📄 Copying robots.txt..."
cp ./robots.txt ./dist/robots.txt

echo "🖼️  Copying logo..."
cp ./src/app/assets/logo/logo.png ./dist/logo.png

echo "🖼️  Copying icon..."
cp ./src/app/assets/images/ball.png ./dist/ball.png

echo "📄 Copying privacy policy..."
cp ./privacy-policy.html ./dist/privacy-policy.html

# 6. Generate sitemap
echo "🔍 Running SEO generation..."
ts-node build-project/googleseo.ts



echo "✅ Build completed successfully!"
