# uSocial

> The uPort Social Module

[![Build Status](https://travis-ci.org/rhizomik/usocial.svg?branch=master)](https://travis-ci.org/rhizomik/usocial)<br/>

[Deployment] https://usocial.rhizomik.net

- [uSocial Tools](https://github.com/rhizomik/usocial/tree/development/packages/usocial)

## Getting started

```
npm install
npm start
```

## Production

```
export NODE_ENV=production
export PORT=3000
export API_PORT=3001
export REACT_APP_CLIENT=http://localhost:3000
export REACT_APP_API=http://localhost:3001
npm run build
npm run serve
```

## Environment variables

- NODE_ENV: `production` or `development`
- REACT_APP_CLIENT: Client base URL (i.e. `http://localhost:3000`)
- REACT_APP_API: API base URL (i.e. `http://localhost:3001`). When not set, the client will default
to `http://localhost:3001` and API will automatically initialize a new ngrok instance on boot to
handle uPort callbacks.
- PORT: Client port to listen to (i.e. `3000`). For the client, PORT > 3000
- API_PORT: API port to listen to (i.e. `3001`. For the API, API_PORT > PORT > 3001
- UPORT_PRIVATE_KEY: uPort signing key. Can be generated through
`const { did, privateKey } = Credentials.createIdentity()` or
[uPort My Appps](https://developer.uport.me/myapps)

Client is only aware of environment variables starting with `REACT_APP_`.

Environment variables can also be set through `.env` files, see `.env.example` in `packages/<name>/`. 

## Thanks

- [Attester](https://github.com/rhizomik/attester)

## License

Developed as part of the MSc Thesis:

**Verification of Self-Sovereign Identities in Ethereum applied to a Media Reuse Smart Contracts Scenario**.
[https://repositori.udl.cat/handle/10459.1/65956](https://repositori.udl.cat/handle/10459.1/65956)

Author: Gerard Rovira Sánchez

Supervisors: Juan Manuel Gimeno Illa, Roberto García González
