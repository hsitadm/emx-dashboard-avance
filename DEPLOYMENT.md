# 🚀 EMx Dashboard - Deployment Guide

## 📋 Arquitectura de Deployment

### Componentes
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **Proxy**: Nginx
- **Process Manager**: PM2
- **CI/CD**: GitHub Actions + Webhooks

### Infraestructura
- **AWS EC2**: t3.small (2 vCPU, 2GB RAM)
- **OS**: Amazon Linux 2
- **Security**: Security Groups + Firewall
- **SSL**: Ready para Let's Encrypt

## 🔄 Proceso de Deployment

### Automático (Recomendado)
1. **Push a main branch** → Trigger automático
2. **GitHub Actions** ejecuta tests y build
3. **Webhook** notifica al servidor
4. **Script de deployment** actualiza la aplicación
5. **Verificación** automática de servicios

### Manual
```bash
# En el servidor
/opt/emx-deployment/deploy.sh
```

## 🛠️ Scripts de Deployment

### `/opt/emx-deployment/deploy.sh`
- ✅ Backup automático
- ✅ Clone/pull desde GitHub
- ✅ Instalación de dependencias
- ✅ Build del frontend
- ✅ Restauración de base de datos
- ✅ Deployment de archivos
- ✅ Reinicio de servicios
- ✅ Verificación de salud
- ✅ Rollback automático en caso de error

### `/opt/emx-deployment/monitor.sh`
- 📊 Estado de servicios
- 📊 Uso de recursos
- 📊 Logs de aplicación

## 🔐 Configuración de Seguridad

### Security Groups (AWS)
```
HTTP (80)    - 0.0.0.0/0
HTTPS (443)  - 0.0.0.0/0
SSH (22)     - Tu IP específica
Webhook (8080) - GitHub IPs
```

### Firewall Local
```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-port=8080/tcp
```

## 📊 Monitoreo

### Verificar Estado
```bash
/opt/emx-deployment/monitor.sh
```

### Logs
```bash
# Backend logs
pm2 logs emx-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Webhook logs
sudo journalctl -u emx-webhook -f
```

## 🔄 Rollback

### Automático
Si el deployment falla, se ejecuta rollback automático

### Manual
```bash
/opt/emx-deployment/deploy.sh rollback
```

## 🌐 URLs del Sistema

- **Dashboard**: http://3.226.212.87
- **API Health**: http://3.226.212.87/api/health
- **Webhook**: http://3.226.212.87:8080/webhook

## 📝 Configuración de GitHub

### Secrets Requeridos
```
WEBHOOK_URL=http://3.226.212.87:8080/webhook
WEBHOOK_SIGNATURE=sha256=<signature>
```

### Webhook Configuration
- **URL**: http://3.226.212.87:8080/webhook
- **Content Type**: application/json
- **Secret**: emx-webhook-secret-2025
- **Events**: push (main branch only)

## 🚨 Troubleshooting

### Backend no responde
```bash
pm2 restart emx-backend
pm2 logs emx-backend
```

### Frontend no carga
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Webhook no funciona
```bash
sudo systemctl status emx-webhook
sudo journalctl -u emx-webhook -n 50
```

### Base de datos corrupta
```bash
# Restaurar desde backup
ls -la /opt/backups/database_*.sqlite
cp /opt/backups/database_YYYYMMDD_HHMMSS.sqlite /opt/emx-dashboard/backend/database.sqlite
pm2 restart emx-backend
```

## 📈 Escalabilidad

### Próximos Pasos
1. **Load Balancer** para múltiples instancias
2. **RDS** para base de datos externa
3. **CloudFront** para CDN
4. **Auto Scaling Groups**
5. **Container deployment** con Docker

## 🔧 Mantenimiento

### Actualizaciones de Sistema
```bash
sudo yum update -y
sudo reboot
```

### Limpieza de Backups
```bash
# Mantener solo últimos 10 backups
find /opt/backups -name "emx-dashboard_*" -type d | sort -r | tail -n +11 | xargs rm -rf
find /opt/backups -name "database_*.sqlite" | sort -r | tail -n +11 | xargs rm -f
```

### Rotación de Logs
```bash
# PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```
