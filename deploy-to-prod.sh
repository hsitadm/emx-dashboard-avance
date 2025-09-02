#!/bin/bash
set -e

echo "🚀 Deploy DEV → PROD - EMx Dashboard"

DEV_IP="3.84.113.55"
PROD_IP="18.207.149.36"

echo "📦 Building frontend en DEV..."
ssh -i ~/Downloads/emx-dashboard-key.pem ec2-user@$DEV_IP "
cd emx-dashboard-avance/frontend
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
nvm use 16
npm run build
"

echo "📤 Copiando build a PROD..."
scp -i ~/Downloads/emx-dashboard-key.pem -r ec2-user@$DEV_IP:~/emx-dashboard-avance/frontend/dist/* /tmp/emx-build/
scp -i ~/Downloads/emx-dashboard-key.pem -r /tmp/emx-build/* ec2-user@$PROD_IP:/tmp/

echo "🔄 Actualizando PROD..."
ssh -i ~/Downloads/emx-dashboard-key.pem ec2-user@$PROD_IP "
sudo rm -rf /var/www/html/*
sudo cp -r /tmp/* /var/www/html/
sudo chown -R nginx:nginx /var/www/html/
sudo chmod -R 755 /var/www/html/
"

echo "✅ Deploy completado: http://$PROD_IP"
