# Lumenize-UI

## Resources

* This `README.md` document contains information on how you configure and run for development, testing, and production.
* `Lumenize-Temporalize Architecture.t2d` Diagram explaining the overall architecture.

## Temporalize API

The Temporalize server (temporalize-api) is a set of REST endpoints that implement the temporal data model. It's available as an NPM module and it's up on GitHub. It is currently backed with a single storage engine for DocumentDB, but can be adapted by implementing another storage engine. The temporalize API needs the following environment variables to function properly:

* `TEMPORALIZE_USERNAME` The Temporalize super-user username (which should be an email). If you are launching this for the first time, it creates this user and configures as the super-user. You can then perform any super-user operation on the Temporalize api using 
* `TEMPORALIZE_PASSWORD` The password for the Temporalize super-user.
* `NODE_ENV` Set to either `development`, `testing`, or `production`
* `DOCUMENT_DB_URL` Something like `https://<your documentdb account>.documents.azure.com:443/`
* `DOCUMENT_DB_KEY` The API key for that DocumentDB account

If you do not have a DocumentDB account, you'll have to create one to configure the above environment variables.

Once the environment variables are configured, you can launch the server with:

    npm start

You can run that command manually when in development mode. If you push to Azue's node.js service (can be configured to automatically deploy from GitHub), then Azure will automatically run `npm start`. I recommend this only for pushing to the cloud for `testing`. You'll want to control the pushing to `production`. I recommend two different Azure node.js web sites: one for `production` and the other for `testing`.

## Web UI

In `production` and `testing` modes the Temporalize server is the only one you need because it will serve up the Project-X API from the build directory (built with `npm run build`).

In `development` mode, the UI is served from the webpack-dev-server which you launch with:

    npm run dev
    
Note, the webpack-dev-server will monitor the source files and restart with your changes. It takes several minutes to launch the first time, but once it's up, it will only re-build (in memory) the parts of the system that changed and any dependencies. It's very smart in figuring out the minimum it needs to affect your changes so it restarts very fast -- often before you can switch to a browser to test your changes. This makes for a very rapid and pleasant development cycle.

There is one gotcha that has gotten me several times. In order for both servers to be running, the webpack-dev-server will proxy some of the endpoints to the temporalize-api server. This is configured on an end-point by end-point basis, so if you add any new endpoints to the temporlize api, you must remember to add it to the proxy section of the webpack-dev-server.config.js.


    

