module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    env: {
      has_database_url: !!process.env.DATABASE_URL,
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV
    }
  });
};