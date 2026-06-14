import app from './app';
import { environment } from './config/environment';
import LoggerUtil from './utilities/logger.util';

const PORT = environment.PORT;

const server = app.listen(PORT, () => {
  LoggerUtil.info(`✓ Backend server running on port ${PORT}`);
  LoggerUtil.info(`✓ Environment: ${environment.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  LoggerUtil.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    LoggerUtil.info('Server closed');
    process.exit(0);
  });
});

export default server;