module.exports = kunlun => {
   const { OP_ERR_CODES } = kunlun.errors;
   


   /**
    * Validates the application of a given request
    */
   function checkAccess(req, res, next){
      try{
      // *Getting the application token:
      const token = req.get('Application-Token');
      // *Getting the application name:
      const name = req.get('Application-Name');

      return kunlun.applications.check(name, token)
         .then(application => {
            // *Sending a 200 'OK' response, since the authentication has been succeded:
            res.status(200);
            // *Storing the application in the response locals:
            res.locals.application = application;
            // *Sending the request flow to the next middleware, if any:
            next();
         })
         .catch(err => {
            if(err.name === 'KunlunError')
               switch(err.code){
               case OP_ERR_CODES.ACCESS.CHECK.TOKEN:
               case OP_ERR_CODES.ACCESS.CHECK.USERNAME:
                  res.status(401).end();
                  break;
               default: throw err;
               }
            else throw err;
         });
      } catch(err){
         Promise.reject(err);
      }
   }



   /**
    * Creates a new application
    */
   function add(req, res, next){
      try{
         // *Getting info from request body:
         const name = req.body.name;

         kunlun.applications.add(null, name)
            .then(result => {
               res.status(201).json({ token: result.token }).end();
            })
            .catch(err => {
               if(err.name === 'KunlunError')
                  switch(err.code){
                  case OP_ERR_CODES.APPLICATION.NAME.EXISTS:
                     res.status(400).json(new Error('This application already exists')).end();
                     break;
                  case OP_ERR_CODES.APPLICATION.NAME.MISSING:
                     res.status(400).json(new Error('The application name isn\'t valid')).end();
                     break;
                  default: throw err;
                  }
               else throw err;
            });
      } catch(err){
         Promise.reject(err);
      }
   }



   // *Returning the routes:
   return { checkAccess, add };
};
