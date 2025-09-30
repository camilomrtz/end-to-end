# DevOps Service Monitor

Aplicación de monitoreo en tiempo real con Node.js, Express y Socket.io, containerizada con Docker.

## Características
- Dashboard de monitoreo visualmente atractivo 
- Métricas en tiempo real de CPU y memoria 
- Estado de servicios simulados 
- Totalmente dockerizable 
- Interfaz responsive

## Tecnologías 
- Node.js + Express 
- Socket.io (WebSockets) 
- Docker 
- Chart.js para visualizaciones

## Despliegue
bash
docker build -t devops-monitor .
docker run -p 3000:3000 devops-monitor