const app = require('./app');
const { testConnection } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 UpBridge Rwanda API running on http://localhost:${PORT}`);
  });
};

startServer();
