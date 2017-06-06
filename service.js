// *Requiring the needed modules:
const dotenv = require('dotenv');
const kunlun_service = require('kunlun');
const server = require('./server');

// *Setting the finish flag:
let finish_signaled = false;



/**
 * Starts the server
 * @return {Promise} A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start(){
   // *Trying to start the server:
   try{

      // *Loading the environment:
      dotenv.config({ path: './.env' });

      // *Deploying the kunlun service:
      return kunlun_service.deploy({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || '27017',
            user: process.env.DB_USER,
            pass: process.env.DB_PASS || '',
            database: process.env.DB_SCHEMA
         })

         // *Starting the API server:
         .then(kunlun => server.start({
               kunlun,
               port: process.env.API_PORT || '80'
            }));

   } catch(err){
      // *Rejecting the promise if something went wrong:
      return Promise.reject(err);
   }
}



/**
 * Finishes all the services
 * @return {Promise} A promise that resolves when the services have been finished, or rejects if something went wrong
 */
function finish(){
   // *Checking if the finish signal has been set already, returning if it has:
   if(finish_signaled) return Promise.resolve();

   // *Setting the finish signal:
   finish_signaled = true;

   // *Disconnecting from the kunlun service:
   return kunlun_service.undeploy()
      // *Stopping the server:
      .then(() => server.stop());
}



// *Exporting this module:
module.exports = { start, finish, getName: () => 'Kunlun REST service' };
