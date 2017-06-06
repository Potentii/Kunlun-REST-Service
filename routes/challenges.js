module.exports = kunlun => {
   const { KUNLUN_ERR_CODES } = kunlun.errors;



   /**
    * Proposes a new challenge
    *  Does requires service checking
    */
   function generateNew(req, res, next){
      try{
         // *Getting the request data:
         const username = req.body.username;
         const client_nonce = req.body.client_nonce;

         return kunlun.challenges.generateNew(username, client_nonce)
            .then(result => {
               res.status(201).json(result).end();
            })
            .catch(err => {
               if(err.name === 'KunlunError')
                  switch(err.code){
                  case KUNLUN_ERR_CODES.CHALLENGE.USERNAME.NOTFOUND:
                     res.status(401).json(new Error('Invalid credentials')).end();
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
    * Checks if the answer to a proposed challenge is correct
    *  Does requires service checking
    */
   function answer(req, res, next){
      try{
         // *Getting the request data:
         const id = req.params.id;
         const client_proof = req.body.client_proof;

         kunlun.challenges.checkAnswer(id, client_proof)
            .then(result => {
               res.status(201)
                  .json({
                     token: result.token,
                     signature: result.server_signature
                  })
                  .end();
            })
            .catch(err => {
               if(err.name === 'KunlunError')
                  switch(err.code){
                  case KUNLUN_ERR_CODES.CHALLENGE.USERNAME.NOTFOUND:
                     res.status(401).json(new Error('The credentials don\'t exist anymore')).end();
                     break;
                  case KUNLUN_ERR_CODES.CHALLENGE.PROOF.CHECK:
                     res.status(401).json(new Error('Incorrect answer')).end();
                     break;
                  case KUNLUN_ERR_CODES.CHALLENGE.TYPE:
                  case KUNLUN_ERR_CODES.CHALLENGE.NOTFOUND:
                     res.status(400).json(new Error('The given challenge doesn\'t exist or it has been answered already')).end();
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
   return { generateNew, answer };
};
