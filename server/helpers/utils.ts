import { cleanEnv, email, port, str } from 'envalid';
class Utils {
  public static validateEnv = (): void => {
    cleanEnv(process.env, {
      JWT_SECRET: str(),
      PORT: port(),
      USER_NAME: email(),
      PASSWORD: str(),
      PASSKEY: str(),
    });
  };
  public static getEnvVariable(name: string, exit: boolean): string {
    if (!process.env[name]) {
      console.error(name + ' environment variable not set');
      if (exit) {
        process.exit(1);
      }
    }
    return process.env[name];
  }
}
export default Utils;
