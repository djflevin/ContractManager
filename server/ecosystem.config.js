

module.exports = {
  apps: [
    {
      name: 'server',
      script: './bin/www',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};


// pm2 restart ecosystem.config.js --update-env
// 