const http = require('http');
const port = process.env.PORT || 3000;

console.log('🚀 Social Wallet API starting...');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/' || req.url === '') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: '🚀 Social Wallet API is LIVE!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      status: 'Working perfectly'
    }));
  }
  else if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      healthy: true,
      uptime: process.uptime()
    }));
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not Found'
    }));
  }
});

server.listen(port, () => {
  console.log('✅ API running on port', port);
});