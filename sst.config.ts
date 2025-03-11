// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

const SST_AWS_REGION = 'us-west-1'

export default $config({
    app(input) {
        return {
            name: 'cloud-data-hub-sst',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            // removal: 'remove',
            home: 'aws',
            providers: {
                aws: {
                    region: SST_AWS_REGION,
                },
            },
        }
    },
    async run() {
        const GlobalVarsTable = new sst.aws.Dynamo('GlobalVarsTable', {
            fields: {
                itemID: 'string',
            },
            primaryIndex: { hashKey: 'itemID' },
        })

        const UserTable = new sst.aws.Dynamo('UserTable', {
            fields: {
                itemID: 'string',
            },
            primaryIndex: { hashKey: 'itemID' },
        })

        const CredentialTable = new sst.aws.Dynamo('CredentialTable', {
            fields: {
                itemID: 'string',
            },
            primaryIndex: { hashKey: 'itemID' },
        })

        const ConnectionsTable = new sst.aws.Dynamo('ConnectionsTable', {
            fields: {
                itemID: 'string',
            },
            primaryIndex: { hashKey: 'itemID' },
        })

        const ConnectionTokensTable = new sst.aws.Dynamo('ConnectionTokensTable', {
            fields: {
                itemID: 'string',
            },
            primaryIndex: { hashKey: 'itemID' },
        })

        const appDataBucket = new sst.aws.Bucket('AppDataBucket', {
            access: 'public',
            cors: {
                allowHeaders: ['*'],
                allowOrigins: ['*'],
                allowMethods: ['DELETE', 'GET', 'HEAD', 'POST', 'PUT'],
                exposeHeaders: ['E-Tag'],
                maxAge: '3600 seconds',
            },
        })

        const appDataCDN = new sst.aws.Router('AppDataCDN', {
            routes: {
                '/*': {
                    bucket: appDataBucket,
                },
                // '/bucket/*': {
                //     bucket: myUGCBucket,
                // },
            },
        })

        //

        const wss = new sst.aws.ApiGatewayWebSocket('SocketAPI')

        const SESSION_SECRET = new sst.Secret('SESSION_SECRET')

        const api = new sst.aws.ApiGatewayV2('RestAPI')

        const environment = {
            SST_AWS_REGION: SST_AWS_REGION,
            CURRENT_STAGE: $app.stage,
            SESSION_SECRET: SESSION_SECRET.value,
            SocketAPI: wss.url,
        }

        let domain = {
            name: 'company-control-center.loklok.land',
        }

        if ($app.stage === 'preview') {
            domain = {
                name: 'company-control-center-preview.loklok.land',
            }
        }

        const getCommonLinks = () => [
            ConnectionsTable,
            wss,
            api,
            SESSION_SECRET,
            UserTable,
            CredentialTable,
            GlobalVarsTable,
            ConnectionTokensTable,
        ]

        // api.route('POST /api/connections/connections/getOnlineClients', {
        //     link: [appDataBucket, appDataCDN, api],
        //     environment: environment,
        //     handler: '/src/sst/http/connections/connections.getOnlineClients',
        // })

        api.route('POST /api/files/signGenericFile', {
            link: [appDataBucket, appDataCDN, api],
            environment: environment,
            handler: 'src/sst/http/files/files.signGenericFile',
        })
        api.route('POST /api/files/removeUserGenericFile', {
            link: [appDataBucket, appDataCDN, api],
            environment: environment,
            handler: 'src/sst/http/files/files.removeUserGenericFile',
        })
        api.route('GET /api/files/getFileLink', {
            link: [appDataBucket, appDataCDN, api],
            environment: environment,
            handler: 'src/sst/http/files/files.getFileLink',
        })

        let nextjs = new sst.aws.Nextjs('MyWeb', {
            environment: environment,
            link: [...getCommonLinks()],
            domain: domain,
            dev: {
                autostart: false,
                command: '',
                url: `http://localhost:3001`,
            },
        })

        let devCmd = new sst.x.DevCommand('NextJSCommand', {
            link: [...getCommonLinks()],
            environment: environment,
            dev: {
                autostart: true,
                command: 'npm run devnext',
            },
        })

        wss.route('$connect', {
            handler: 'src/sst/ws/connect.handler',
            link: [...getCommonLinks()],
            environment: environment,
        })

        wss.route('$disconnect', {
            handler: 'src/sst/ws/disconnect.handler',
            link: [...getCommonLinks()],
            environment: environment,
        })

        wss.route('$default', {
            handler: 'src/sst/ws/default.handler',
            link: [...getCommonLinks()],
            environment: environment,
        })

        return { nextjs: nextjs.url }
    },
})
