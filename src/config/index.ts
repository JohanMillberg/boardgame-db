import merge from 'lodash.merge';
import localConfig from './local';
import prodConfig from './prod';
import testConfig from './testing';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const stage = process.env.STAGE || 'local';

let envConfig;

if (stage === 'production') {
    envConfig = prodConfig;
} else if (stage === 'testing') {
    envConfig = testConfig;
} else {
    envConfig = localConfig;
}

export default merge({
    stage,
    env: process.env.NODE_ENV,
    port: 3000,
    secrets: {
        jwt: process.env.JWT_SECRET,
        dbUrl: process.env.DATABASE_URL
    }
}, envConfig);