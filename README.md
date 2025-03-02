# Welcome

hi

## SETUP

install deps
`npm install`

load all vars into dynamodb
`npm run sst:load:all`

## START

start local server
`npm run sst`

## Deploy

open file `sst.config.ts` 

`lens.loklok.org`
change domain to your own domian if using route53.
comment out domain if not using route53

Deploy using:
`npm run sst:deploy:production`