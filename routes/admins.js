module.exports = kunlun => {
   const { KUNLUN_ERR_CODES } = kunlun.errors;



   /**
    * Checks if the admin credentials matches
    *  Might be used before other middlewares
    */
   function check(req, res, next){
      try{
         // *Getting the admin user and pass:
         const username = req.get('Admin-Username');
         const password = req.get('Admin-Password');

         return kunlun.admins.check(username, password)
            .then(admin => {
               // *Sending a 200 'OK' response, since the authentication has been succeded:
               res.status(200);
               // *Storing the admin in the response locals:
               res.locals.admin = admin;
               // *Sending the request flow to the next middleware, if any:
               next();
            })
            .catch(err => {
               if(err.name === 'KunlunError')
                  switch(err.code){
                  case KUNLUN_ERR_CODES.ADMIN.CHECK:
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



   /**
    * Creates a new admin user
    *  Requires admin checking
    */
   function add(req, res, next){
      try{
         // *Getting the new admin user and pass:
         const username = req.body.username;
         const password = req.body.password;

         return kunlun.admins.add(null, username,password)
            .then(result => {
               res.send(201).json({ id: result.id }).end();
            })
            .catch(err => {
               if(err.name === 'KunlunError')
                  switch(err.code){
                  case KUNLUN_ERR_CODES.ADMIN.USERNAME.EXISTS:
                     res.status(400).json(new Error('This admin already exists')).end();
                     break;
                  case KUNLUN_ERR_CODES.ADMIN.USERNAME.MISSING:
                     res.status(400).json(new Error('The admin username isn\'t valid')).end();
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
   return { add, check };
};
