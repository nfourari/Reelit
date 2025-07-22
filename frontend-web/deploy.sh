#!/bin/bash
echo "🔨 Building frontend..."
npm run build

echo "🚀 Deploying to Digital Ocean..."
rsync -avz --progress --delete dist/ thu@24.144.111.2:/var/www/shuzzy/frontend/dist/

echo "✅ Deployment complete!"