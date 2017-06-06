
/**
 * Logs the error on console and sends a 500 response to client
 * @param  {obejct} res The Expressjs response obejct
 * @param  {Error} err  The error to be logged
 */
function send(res, err){
   // *Logging the error:
   console.error(err);
   // *Sending the error response:
   res.status(500).end();
}



function wrapRoute(route, req, res, next){
   route(req, res, next)
      .catch(err => send(res, err));
}



// *Exporting this module:
module.exports = { wrapRoute };
