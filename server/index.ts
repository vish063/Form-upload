import Server from './server';
import Utils from './helpers/utils';
import Logger from './helpers/logger';
Utils.validateEnv();
process.on('SIGINT', async () => {
  Logger.info('Stopping the server...');
  if (Server.getInstance()) {
    try {
      await Server.stop();
      Logger.info('Server stopped');
      process.exit(0);
    } catch (e) {
      console.log(e);
      process.exit(0);
    }
  } else {
    process.exit(1);
  }
});

(async () => {
  await Server.start();
})();
