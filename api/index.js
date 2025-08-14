// Vercel serverless function
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/' || req.url === '') {
    return res.status(200).json({
      success: true,
      message: '🚀 Social Wallet API is LIVE on Vercel!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
  
  if (req.url === '/health') {
    return res.status(200).json({
      status: 'OK',
      healthy: true,
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(404).json({
    error: 'Not Found',
    path: req.url
  });
};