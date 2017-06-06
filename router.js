const errors = require('./errors');


// *Exporting this module:
module.exports = kunlun => {
   // *Building and returning the routes:
   const router = {
      admins:       require('./routes/admins')(kunlun),
      accesses:     require('./routes/accesses')(kunlun),
      challenges:   require('./routes/challenges')(kunlun),
      credentials:  require('./routes/credentials')(kunlun),
      applications: require('./routes/applications')(kunlun)
   };

   for(let routes in router){
      if(router.hasOwnProperty(routes)){
         for(let route in routes){
            if(routes.hasOwnProperty(route)){
               router[routes][route] = errors.wrapRoute.bind(router[routes][route], router[routes][route]);
            }
         }
      }
   }

   return router;
};
