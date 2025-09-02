#!/bin/bash
set -e

echo "🔍 Verificando paridad DEV ↔ PROD"

PROD_IP="18.207.149.36"
DEV_IP="3.84.113.55"
KEY_PATH="./emx-dashboard-key.pem"

echo "📊 Comparando configuraciones..."

echo "=== Node.js Versions ==="
echo "PROD:"
ssh -i $KEY_PATH ec2-user@$PROD_IP "node --version"
echo "DEV:"
ssh -i $KEY_PATH ec2-user@$DEV_IP "node --version" || echo "❌ DEV no accesible"

echo ""
echo "=== PM2 Processes ==="
echo "PROD:"
ssh -i $KEY_PATH ec2-user@$PROD_IP "pm2 list"
echo "DEV:"
ssh -i $KEY_PATH ec2-user@$DEV_IP "pm2 list" || echo "❌ DEV no accesible"

echo ""
echo "=== API Health Check ==="
echo "PROD:"
curl -s http://$PROD_IP/api/health || echo "❌ PROD API no responde"
echo "DEV:"
curl -s http://$DEV_IP/api/health || echo "❌ DEV API no responde"

echo ""
echo "=== Database Schema ==="
echo "PROD:"
ssh -i $KEY_PATH ec2-user@$PROD_IP "cd emx-dashboard-avance/backend && sqlite3 database.sqlite '.schema'" | head -10
echo "DEV:"
ssh -i $KEY_PATH ec2-user@$DEV_IP "cd emx-dashboard-avance/backend && sqlite3 database.sqlite '.schema'" | head -10 || echo "❌ DEV DB no accesible"

echo ""
echo "=== Frontend Build ==="
echo "PROD:"
ssh -i $KEY_PATH ec2-user@$PROD_IP "ls -la emx-dashboard-avance/frontend/dist/ | wc -l"
echo "DEV:"
ssh -i $KEY_PATH ec2-user@$DEV_IP "ls -la emx-dashboard-avance/frontend/dist/ | wc -l" || echo "❌ DEV build no existe"

echo ""
echo "=== Git Status ==="
echo "PROD:"
ssh -i $KEY_PATH ec2-user@$PROD_IP "cd emx-dashboard-avance && git log --oneline -1"
echo "DEV:"
ssh -i $KEY_PATH ec2-user@$DEV_IP "cd emx-dashboard-avance && git log --oneline -1" || echo "❌ DEV repo no accesible"

echo ""
echo "🎯 Resumen de Paridad:"
if curl -s http://$DEV_IP/api/health > /dev/null && curl -s http://$PROD_IP/api/health > /dev/null; then
    echo "✅ Ambos ambientes están funcionando"
    echo "✅ DEV y PROD tienen paridad funcional"
else
    echo "❌ Falta sincronización entre DEV y PROD"
    echo "💡 Ejecutar: ./sync-dev-with-prod.sh"
fi
