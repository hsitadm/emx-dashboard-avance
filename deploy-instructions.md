# 🚀 Deployment EMx Dashboard en AWS

## 📋 Pre-requisitos

1. **AWS CLI configurado** con credenciales
2. **Key Pair** creado en AWS EC2
3. **IP de tu oficina** para acceso seguro

## 🔧 Pasos de Deployment

### 1. Crear Key Pair (si no tienes)
```bash
aws ec2 create-key-pair --key-name emx-dashboard-key --query 'KeyMaterial' --output text > emx-dashboard-key.pem
chmod 400 emx-dashboard-key.pem
```

### 2. Obtener tu IP pública
```bash
curl ifconfig.me
# Ejemplo resultado: 203.0.113.12
# Usar: 203.0.113.12/32 para solo tu IP
# O usar: 203.0.113.0/24 para toda tu red
```

### 3. Desplegar CloudFormation Stack
```bash
aws cloudformation create-stack \
  --stack-name emx-dashboard \
  --template-body file://cloudformation-template.yaml \
  --parameters \
    ParameterKey=KeyPairName,ParameterValue=emx-dashboard-key \
    ParameterKey=AllowedCIDR,ParameterValue=TU-IP/32 \
    ParameterKey=InstanceType,ParameterValue=t3.small \
  --capabilities CAPABILITY_IAM
```

### 4. Monitorear el deployment
```bash
aws cloudformation describe-stacks --stack-name emx-dashboard --query 'Stacks[0].StackStatus'
```

### 5. Obtener la URL del dashboard
```bash
aws cloudformation describe-stacks --stack-name emx-dashboard --query 'Stacks[0].Outputs'
```

## 🔒 Características de Seguridad Implementadas

### ✅ Network Security
- **VPC privada** con subnet pública controlada
- **Security Group** que solo permite acceso desde IPs específicas
- **Firewall local** (firewalld) configurado
- **Elastic IP** fija para whitelist

### ✅ Application Security
- **Headers de seguridad** en Nginx
- **Proxy reverso** para ocultar backend
- **PM2** para gestión segura de procesos
- **Usuario dedicado** (emxapp) sin privilegios root

### ✅ SSL/TLS Ready
- **Certbot instalado** para certificados gratuitos
- **Nginx configurado** para SSL
- Comando para activar SSL:
```bash
sudo certbot --nginx -d tu-dominio.com
```

## 🛠️ Post-Deployment

### Conectar via SSH
```bash
ssh -i emx-dashboard-key.pem ec2-user@TU-ELASTIC-IP
```

### Ver logs de la aplicación
```bash
sudo -u emxapp pm2 logs emx-backend
```

### Actualizar la aplicación
```bash
cd /home/emxapp/emx-dashboard-avance
sudo -u emxapp git pull origin main
cd backend && sudo -u emxapp npm install
cd ../frontend && sudo -u emxapp npm install && sudo -u emxapp npm run build
sudo -u emxapp pm2 restart emx-backend
```

## 💰 Costos Estimados

- **EC2 t3.small**: ~$15/mes
- **Elastic IP**: ~$3.6/mes (si no está asociada)
- **Data Transfer**: ~$1-5/mes
- **Total**: ~$20-25/mes

## 🔧 Troubleshooting

### Si no puedes acceder:
1. Verificar Security Group permite tu IP
2. Verificar Nginx está corriendo: `sudo systemctl status nginx`
3. Verificar backend está corriendo: `sudo -u emxapp pm2 status`

### Para cambiar IPs permitidas:
```bash
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxxx --protocol tcp --port 80 --cidr NUEVA-IP/32
```

## 🗑️ Cleanup (Eliminar todo)
```bash
aws cloudformation delete-stack --stack-name emx-dashboard
```
