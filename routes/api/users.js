const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

//User Model
const Item = require('../../models/User');

//@route  POST api/users
//@desc   Register new user
//@access public
router.post('/',(req,res)=>{
   const {name,email,password}= req.body;
    
   //simple validation
   if(!name || !email || !password) {
     return res.status(400).json({msg:'please enter all fields'});
   }
   //check for existing user
   User.findOne({email})
   .then(user =>{
       if(user) return res.status(400).json({msg:'user already exists'});

       const newUser = new User({
        name,
        email,
        password
       });  
       
       //create salt and hash
       bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(newUser.password,salt,(err,hash)=>{
               if(err) throw err;
               newUser.password =hash;
               newUser.save()
               .then(user=>{
                   
                jwt.sign(
                    {id: user.id},//payload, here we can give anything
                    config.get('jwtSecret'),
                    {expiresIn:3600},//session 
                    (err,token)=>{
                        if(err) throw err;
                        res.json({
                            token,//same as token:token
                            user:{
                                id:user.id,
                                name:user.name,
                                email: user.email
                            }
                        });
                    }
                )
                
                
                
               });
           })
       })
   })
});


module.exports=router;