
module.exports = service => {
   // *Trying to fetch the service module, if a string is given:
   service = typeof service === 'string'
      ? require(service)
      : service;

   if(!service) throw new Error('Service not set');

   // *Setting the service name, if it provides a 'getName' function:
   const service_name = typeof service.getName === 'function'
      ? (service.getName() || 'Application')
      : 'Application';

   // *Setting the finish flag:
   let finish_signaled = false;



   // *When process is interrupted, finishing the program:
   process.on('SIGINT', stop);

   // *When the process doesn't have any other task left:
   process.on('exit', code => {
      // *Checking if the application has finished with errors:
      if(code>0)
         // *If it has:
         // *Logging it out:
         console.log(service_name + ' finished with errors');
      else
         // *If it hasn't:
         // *Logging it out:
         console.log(service_name + ' finished');
   });



   function start(){
      // *Starting the service:
      service.start()
         .then(() => {
            // *Logging that the service have started:
            console.log(service_name + ' started');
         })
         .catch(err => {
            // *If some error happens:
            // *Logging the error:
            console.error(err);
            // *Finishing the service:
            stop(1);
         });
   }



   /**
    * Finishes all the services, and then kills the process
    */
   function stop(code = 0){
      // *Checking if the finish signal has been set already, returning if it has:
      if(finish_signaled) return;

      // *Setting the finish signal:
      finish_signaled = true;

      // *Finishing the service:
      service.finish()
         // *Stopping the process:
         .then(() => process.exit(code))
         .catch(err => {
            // *If some error happens:
            // *Logging the error:
            console.error(err);
            // *Stopping the process:
            process.exit(1);
         });
   }



   return { start, stop };
};
