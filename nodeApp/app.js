// nodeapp.js

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const client = require('prom-client'); // 👈 para Prometheus

const app = express();
const server = http.createServer(app);

// ======================
// 📊 Configuración Prometheus
// ======================
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const cpuGauge = new client.Gauge({
  name: 'app_cpu_usage',
  help: 'CPU usage simulated (%)'
});

const memoryGauge = new client.Gauge({
  name: 'app_memory_usage',
  help: 'Memory usage simulated (%)'
});

// Endpoint para métricas Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// ======================
// 🔌 Socket.io (opcional)
// ======================
let io;
try {
  const socketIo = require('socket.io');
  io = socketIo(server);
  console.log('✅ Socket.io cargado correctamente');
} catch (error) {
  console.error('❌ Error cargando socket.io:', error.message);
  console.log('⚠️ Ejecutando en modo sin WebSockets');
}

// Middleware para archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'index.html')
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  res.send('🚀 DevOps Monitor está funcionando (pero falta index.html)');
});

// Actualizar métricas de forma continua (siempre activo)
setInterval(() => {
  const cpu = Math.floor(Math.random() * 30) + 20;
  const memory = Math.floor(Math.random() * 15) + 60;

  // Siempre actualizar métricas Prometheus
  cpuGauge.set(cpu);
  memoryGauge.set(memory);

  // Emitir por WebSocket si hay clientes conectados
  if (io) {
    io.emit('metrics', { 
      cpu, 
      memory, 
      timestamp: new Date().toISOString() 
    });
  }
}, 2000);

// Configurar WebSocket si está disponible
if (io) {
  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);
    
    socket.emit('init', { 
      message: 'Conectado al monitor DevOps',
      timestamp: new Date().toISOString()
    });
    
    socket.on('disconnect', () => {
      console.log('🔌 Cliente desconectado:', socket.id);
    });
  });
} else {
  // Fallback: API REST si no hay WebSockets
  app.get('/api/metrics', (req, res) => {
    const metrics = {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 15) + 60,
      timestamp: new Date().toISOString(),
      message: 'Modo HTTP (sin WebSockets)'
    };

    res.json(metrics);
  });
}

// Manejo de errores
server.on('error', (error) => {
  console.error('💥 Error del servidor:', error);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor DevOps ejecutándose en puerto ${PORT}`);
  console.log(`📁 Directorio: ${__dirname}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Apagando servidor...');
  server.close(() => {
    process.exit(0);
  });
});
