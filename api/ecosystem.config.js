module.exports = {
  apps: [
    {
      name: 'altr',
      script: './index.js',
      instances: 'max',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
