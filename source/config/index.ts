import path from 'path';

interface IEnvPostfixObject {
  production: string,
  staging: string,
  development: string
  [key: string]: string;
}

const ENV_POSTFIX:IEnvPostfixObject = {
  production: 'prod',
  staging: 'stage',
  development: 'dev',
  dockerDebug: 'dockerDebug'
};

const env = process.env.NODE_ENV && Object.keys(ENV_POSTFIX).includes(process.env.NODE_ENV)
  ? ENV_POSTFIX[process.env.NODE_ENV]
  : 'dev';
/* tslint:disable-next-line */
const config = require(path.join(__dirname, `config-${env}`)).default;

export default config;