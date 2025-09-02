#!/bin/bash
set -e

echo "🚀 Configurando DEV idéntico a PROD"

PROD_IP="18.207.149.36"
KEY_PATH="./emx-dashboard-key.pem"

# Primero verificar que PROD esté funcionando
echo "✅ Verificando PROD..."
ssh -i $KEY_PATH ec2-user@$PROD_IP "
echo 'PROD Status:'
echo 'Node: $(node --version)'
echo 'PM2: $(pm2 list | grep emx-dashboard | wc -l) processes'
echo 'API: $(curl -s localhost:3001/api/health || echo 'No response')'
"

echo ""
echo "🎯 Para configurar DEV idéntico a PROD necesitas:"
echo "1. Una instancia EC2 nueva con Amazon Linux 2"
echo "2. Security Group que permita HTTP (80) y SSH (22)"
echo "3. La misma clave SSH (emx-dashboard-key)"
echo ""
echo "📋 Configuración exacta de PROD:"
echo "- OS: Amazon Linux 2"
echo "- Node.js: v16.20.2 (via NVM)"
echo "- PM2: Para gestión de procesos"
echo "- Nginx: Proxy reverso"
echo "- SQLite: Base de datos"
echo ""
echo "🔧 Comandos para nueva instancia DEV:"
echo "1. Crear instancia EC2:"
echo "   - AMI: ami-0c02fb55956c7d316 (Amazon Linux 2)"
echo "   - Type: t3.small"
echo "   - Key: emx-dashboard-key"
echo "   - Security Group: sg-0ef6dcb56558c4a3b"
echo ""
echo "2. Una vez creada, ejecutar:"
echo "   ./sync-dev-with-prod.sh"
echo ""
echo "💡 ¿Quieres que cree la instancia DEV automáticamente? (y/n)"
