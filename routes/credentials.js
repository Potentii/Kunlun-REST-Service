module.exports = kunlun => {
   const { OP_ERR_CODES } = kunlun.errors;



   /**
    * Adds a new credential
    */
   function add(req, res, next){
      try{
      // *Getting the request data:
      const username = req.body.username;
      const password = req.body.password;
      // *Getting the application of this request:
      const application = res.locals.application;

      // TODO fix the 'kunlun.credentials.add' method
      return kunlun.credentials.add(application, username, password, null)
         .then(result => {
            res.status(201).json({ id: result.id }).end();
         })
         .catch(err => {
            if(err.name === 'KunlunError')
               switch(err.code){
               case OP_ERR_CODES.CREDENTIALS.USERNAME.EXISTS:
                  res.status(400).json(new Error('This credentials already exists')).end();
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
   return { add };
};
