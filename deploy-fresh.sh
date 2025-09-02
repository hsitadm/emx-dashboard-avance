#!/bin/bash
set -e

echo "🚀 Iniciando despliegue limpio de EMx Dashboard..."

# 1. Build local limpio
echo "📦 Construyendo aplicación..."
cd frontend
rm -rf dist node_modules/.vite
npm run build

# 2. Verificar que el build tiene UserManagement
if grep -q "Usuarios" dist/assets/*.js; then
    echo "✅ UserManagement encontrado en build"
else
    echo "❌ UserManagement NO encontrado en build"
    exit 1
fi

# 3. Crear nueva instancia EC2
echo "🏗️ Creando nueva instancia EC2..."
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --instance-type t3.small \
    --key-name emx-dashboard-key \
    --security-group-ids sg-0ef6dcb56558c4a3b \
    --subnet-id subnet-0d86011d64a85bcdb \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=EMx-Dashboard-Fresh},{Key=Project,Value=EMx-Transition}]' \
    --region us-east-1 > new-instance.json

# 4. Obtener IP de nueva instancia
INSTANCE_ID=$(cat new-instance.json | grep -o '"InstanceId": "[^"]*"' | cut -d'"' -f4)
echo "🆔 Nueva instancia: $INSTANCE_ID"

# Esperar que esté running
echo "⏳ Esperando que la instancia esté lista..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region us-east-1

# Obtener IP pública
NEW_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --region us-east-1 --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "🌐 Nueva IP: $NEW_IP"

echo "✅ Nueva instancia lista: $NEW_IP"
echo "📋 Siguiente paso: Configurar la nueva instancia"
