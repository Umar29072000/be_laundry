import app from './app';
import { env } from './config/env';

const port = env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  const server = app.listen(port, () => {
    console.log(`✅ App running on port ${port}...`);
  });

  process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
