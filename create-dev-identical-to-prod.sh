#!/bin/bash
set -e

echo "🎯 Creando DEV idéntico a PROD"

PROD_IP="18.207.149.36"
KEY_PATH="./emx-dashboard-key.pem"

echo "✅ PROD está funcionando correctamente:"
echo "- Node.js: v16.20.2"
echo "- PM2: online"
echo "- API: Respondiendo"
echo ""

echo "📋 Para crear DEV idéntico necesitas:"
echo ""
echo "1. 🚀 Crear nueva instancia EC2:"
echo "   aws ec2 run-instances \\"
echo "     --image-id ami-0c02fb55956c7d316 \\"
echo "     --instance-type t3.small \\"
echo "     --key-name emx-dashboard-key \\"
echo "     --security-group-ids sg-0ef6dcb56558c4a3b \\"
echo "     --subnet-id subnet-0d86011d64a85bcdb \\"
echo "     --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=EMx-Dashboard-DEV-v2},{Key=Environment,Value=Development}]'"
echo ""
echo "2. 📝 Una vez creada la instancia, obtener la IP y ejecutar:"
echo "   NEW_DEV_IP=\"[NUEVA_IP_AQUI]\""
echo "   ssh -i $KEY_PATH ec2-user@\$NEW_DEV_IP"
echo ""
echo "3. 🔧 En la nueva instancia DEV, ejecutar:"
cat << 'EOF'

# Instalar NVM y Node.js 16 (igual que PROD)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 16
nvm use 16
nvm alias default 16

# Instalar PM2
npm install -g pm2

# Clonar proyecto
git clone https://github.com/hsitadm/emx-dashboard-avance.git
cd emx-dashboard-avance

# Instalar dependencias backend
cd backend
npm install

# Iniciar con PM2
pm2 start server.js --name emx-dashboard
pm2 save
pm2 startup

# Verificar
pm2 list
curl localhost:3001/api/health

EOF

echo ""
echo "4. 📊 Copiar base de datos de PROD a DEV:"
echo "   scp -i $KEY_PATH ec2-user@$PROD_IP:~/emx-dashboard-avance/backend/database.sqlite ."
echo "   scp -i $KEY_PATH database.sqlite ec2-user@\$NEW_DEV_IP:~/emx-dashboard-avance/backend/"
echo ""
echo "5. ✅ Verificar paridad:"
echo "   ./verify-dev-prod-parity.sh"
echo ""
echo "🎯 Resultado final:"
echo "- DEV y PROD con Node.js v16.20.2"
echo "- Misma base de datos"
echo "- Mismo código"
echo "- Misma configuración PM2"
echo "- APIs idénticas"
