module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'dist/api/index.js',
        watch: false,
        out_file: '/var/www/pm2-logs/backend.log',
        error_file: '/var/www/pm2-logs/backend.log',
      },
    ],
  };