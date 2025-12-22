module.exports = {
  apps: [
    {
      name: "church-api",
      script: "server.js",
      
      // Use fork mode for Socket.IO compatibility
      // (Cluster mode requires sticky sessions for WebSocket)
      instances: 1,
      exec_mode: "fork",
      
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      
      // Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
      
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/error.log",
      out_file: "logs/output.log",
      merge_logs: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: true,
      
      // Restart strategy
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: "5s",
    },
  ],
};

