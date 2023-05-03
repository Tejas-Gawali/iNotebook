const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { request } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_Secret = 'Iamagoodboy';
//Route 1
// sign up or create user  using post "api/auth/createuser" no login required
router.post('/createuser',[
    // validate if response sent is correct or not

    body('name','Enter a valid name').isLength({ min: 1 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 })
], async (req,res)=>{
  let success = false;
    // if there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    try {
      
    // validate if email already exixts or not
    let user =  await User.findOne({email:req.body.email});
    console.log(user);
    if (user) {
      return res.status(400).json({success ,error:"A user with this email already exixts"})
    }

    const salt = await bcrypt.genSaltSync(10);
    secPass =  await bcrypt.hashSync(req.body.password, salt);
    //create new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })
      // .then(user => res.json(user))
      // .catch(err=>{console.log(err)
      //   res.json({error:"Email already exixts", message:err.message})})
      const data ={
        user:{
          id:user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_Secret);
      


      // res.json(user)
      success  = true;
      res.json({success,authtoken});
    } 
    catch (error) {
      console.log(error.message)
      res.status(500).send("Some erroe occured")
    }
    
})

//Route 2
// Authticate a user using post "/api/auth/login" no login required
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
], async (req,res)=>{
  // if there are errors return bad request and errors
  let success = false;
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const {email,password} = req.body;
  try {
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({error:"Wrong credentials "});
    }
    const passwordCompare =  await bcrypt.compare(password,user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({success ,error:"Wrong credentials "});
    }
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_Secret);
    success = true;
    res.json({success, authtoken});
  }catch (error) {
    console.log(error.message)
    res.status(500).send("Internal server error")
  }
})

//Route 3
// Get logged in user details using post "/api/auth/getuser"  login required
router.post('/getuser',fetchuser, async (req,res)=>{
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user);
} catch (error) {
  console.log(error.message)
  res.status(500).send("Internal server error")
}
})
module.exports = router;