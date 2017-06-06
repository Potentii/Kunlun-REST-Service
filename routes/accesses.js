module.exports = kunlun => {
   const { KUNLUN_ERR_CODES } = kunlun.errors;
   


   /**
    * Checks if the access headers are correct
    *  Does requires service checking
    */
   function check(req, res, next){
      try{
         // *Getting the request data:
         const username = req.get('Access-Username');
         const token = req.get('Access-Token');
         // *Getting the application that issued this request:
         const application = res.locals.application;

         return kunlun.accesses.check(application, username, token)
            .then(credential => {
               // *Sending a 200 'OK' response, since the authentication has been succeded:
               res.status(200);
               // *Storing the credential in the response locals:
               res.locals.credential = credential;
               // *Sending the request flow to the next middleware, if any:
               next();
            })
            .catch(err => {
               if(err.name === 'KunlunError')
                  switch(err.code){
                  case KUNLUN_ERR_CODES.ACCESS.CHECK.TOKEN:
                  case KUNLUN_ERR_CODES.ACCESS.CHECK.USERNAME:
                     res.status(401).end();
                     break;
                  default: throw err;
                  }
               else throw err;
            });
      } catch(err){
         return Promise.reject(err);
      }
   }



   // *Exporting the routes:
   return {
      check
   };
};
