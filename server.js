// *Requiring the needed modules:
const Configurator = require('w-srvr');
const router = require('./router');

// *Creating a new server configurator:
const server = new Configurator();



/**
 * Configures and starts the API server
 * @param  {Kunlun} kunlun      The kunlun instance
 * @param  {String|Number} port The server port
 * @return {Promise}            A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start({ kunlun, port }){
   const routes = router(kunlun);

   // *Returning the starting promise:
   return server

      // *Setting the server port:
      .port(port)

      // *Configuring the API:
      .api

         // *Setting up the body parser:
         .most('/api/v1/*')
            .advanced
               .parseJSON()
               .done()

         .post('/api/v1/admins', [routes.admins.check, routes.admins.add])

         .post('/api/v1/applications', [routes.admins.check, routes.applications.add])

         .get('/dev/v1/credentials/usernames', [routes.applications.checkAccess, routes.credentials.getAllUsernames])
         .post('/api/v1/credentials',          [routes.applications.checkAccess, routes.credentials.add])

         .post('/api/v1/challenges/:id', [routes.applications.checkAccess, routes.challenges.answer])
         .post('/api/v1/challenges',     [routes.applications.checkAccess, routes.challenges.generateNew])

         .get('/api/v1/accesses',        [routes.accesses.check])

         // *Finishing the API routes configuration:
         .done()

      // *Starting the server:
      .start();
}



/**
 * Stops all the server connections
 * @return {Promise} A promise that resolves if everything went fine, or rejects if something went wrong
 */
function stop(){
   // *Stopping the server:
   return server.stop();
}



// *Exporting this module:
module.exports = { start, stop };
