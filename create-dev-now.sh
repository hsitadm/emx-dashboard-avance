#!/bin/bash
set -e

echo "🚀 Creando instancia DEV idéntica a PROD"

# Crear instancia
echo "📦 Creando instancia EC2..."
INSTANCE_DATA=$(aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.small \
  --key-name emx-dashboard-key \
  --security-group-ids sg-0ef6dcb56558c4a3b \
  --subnet-id subnet-0d86011d64a85bcdb \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=EMx-Dashboard-DEV-v2},{Key=Environment,Value=Development},{Key=Project,Value=EMx-Transition}]' \
  --region us-east-1)

INSTANCE_ID=$(echo $INSTANCE_DATA | jq -r '.Instances[0].InstanceId')
echo "✅ Instancia creada: $INSTANCE_ID"

# Esperar a que esté running
echo "⏳ Esperando que la instancia esté lista..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region us-east-1

# Obtener IP pública
DEV_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --region us-east-1 --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "🌐 IP DEV: $DEV_IP"

# Esperar SSH
echo "⏳ Esperando SSH (2 minutos)..."
sleep 120

# Configurar DEV
echo "🔧 Configurando DEV idéntico a PROD..."
ssh -i emx-dashboard-key.pem -o StrictHostKeyChecking=no ec2-user@$DEV_IP "
# Instalar NVM y Node.js 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
nvm install 16
nvm use 16
nvm alias default 16

# Instalar PM2
npm install -g pm2

# Clonar proyecto
git clone https://github.com/hsitadm/emx-dashboard-avance.git
cd emx-dashboard-avance/backend
npm install

# Iniciar con PM2
pm2 start server.js --name emx-dashboard
pm2 save
pm2 startup

echo '✅ DEV configurado'
"

# Copiar base de datos de PROD
echo "📊 Copiando base de datos de PROD..."
scp -i emx-dashboard-key.pem ec2-user@18.207.149.36:~/emx-dashboard-avance/backend/database.sqlite /tmp/
scp -i emx-dashboard-key.pem /tmp/database.sqlite ec2-user@$DEV_IP:~/emx-dashboard-avance/backend/

# Reiniciar DEV
ssh -i emx-dashboard-key.pem ec2-user@$DEV_IP "
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
cd emx-dashboard-avance/backend
pm2 restart emx-dashboard
"

echo "✅ DEV creado y configurado"
echo "🌐 DEV: http://$DEV_IP"
echo "🌐 PROD: http://18.207.149.36"
echo ""
echo "🔍 Verificar APIs:"
echo "curl http://$DEV_IP:3001/api/health"
echo "curl http://18.207.149.36:3001/api/health"

# Actualizar archivo de configuración
echo "{\"dev_ip\": \"$DEV_IP\", \"prod_ip\": \"18.207.149.36\", \"instance_id\": \"$INSTANCE_ID\"}" > dev-instance-info.json
echo "📝 Info guardada en dev-instance-info.json"
