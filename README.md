## Etkot Discord bot V2

Brand spanking new Etkot Discord bot V2

### Installation

2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start the server in development mode
4. Run `npm run build` to build the project

### Configuration

The configuration is done via environment variables in the .env file. The following variables are available:

-   `DC_TOKEN` - Discord bot secret

### Other stuff

-   The project uses [Prettier](https://prettier.io/) to format the code
-   Esbuild is used to transpile the typescript code to javascript
-   Nodemon is used to restart the server when the code changes
-   Currently it uses a custom [node loader](https://nodejs.org/docs/latest-v18.x/api/esm.html#loaders) from [here](./scripts/loader.js) to achieve CommonJS like module resolution. This might change in future versions of Node.js so it might be removed in the future.
