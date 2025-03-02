/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "AppDataBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "AppDataCDN": {
      "type": "sst.aws.Router"
      "url": string
    }
    "ConnectionsTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "CredentialTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "GlobalVarsTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "MyWeb": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
    "RestAPI": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "SESSION_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SocketAPI": {
      "managementEndpoint": string
      "type": "sst.aws.ApiGatewayWebSocket"
      "url": string
    }
    "UserTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}