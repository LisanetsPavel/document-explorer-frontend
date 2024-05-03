import amplifyconfig from '../amplifyconfiguration.json';
import amplifyconfigDefault from '../default_amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
    const amplifyConfig = amplifyconfig || amplifyconfigDefault;

    Amplify.configure({
        ...amplifyConfig,
        /*     @ts-expect-error TS2353: Object literal may only specify known properties, and aws_appsync_graphqlEndpoint does not exist in type*/
        aws_appsync_graphqlEndpoint: process.env.GRAPTHQL_ENDPOINT,
        aws_appsync_region: process.env.APPSYNC_REGION,
        aws_appsync_authenticationType: process.env.AUTHENTIFICATION_TYPE,
        aws_user_pools_web_client_id: process.env.CLIENT_ID,
        aws_user_pools_id: process.env.USER_POOL_ID,
        aws_cognito_identity_pool_id: process.env.IDENTITY_POOL_ID,
    });
};
