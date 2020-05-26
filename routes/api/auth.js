const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//User Model
const Item = require('../../models/User');

//@route  POST api/auth
//@desc   Authenticate user
//@access public
router.post('/',(req,res)=>{
   const {email,password}= req.body;
    
   //simple validation
   if(!email || !password) {
     return res.status(400).json({msg:'please enter all fields'});
   }
   //check for existing user
   User.findOne({email})
   .then(user =>{
       if(!user) return res.status(400).json({msg:'user does not exist'});

       //validate password
       bcrypt.compare(password,user.password)
       .then(isMatch=>{
           if(!isMatch) return res.status(400).json({msg:'Invalid credentials'});

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
        })
       
   })
});

//@route  GET api/auth/user
//@desc   Get user data
//@access private
router.get('/user',auth,(req,res)=>{
    User.findById(req.user.id)
    .select('-password')
    .then(user=>res.json(user));
});


module.exports=router;