var express = require('express');
var router = express.Router();
var {User}= require("../schemas/user")
var bcrypt= require("bcryptjs");
const _ = require ("lodash");
const jwt=require("jsonwebtoken")
const config=require('config')
const auth=require('../middewares/auth')

const generateHashedPassword=require('../schemas/user')
/* GET users listing. */

// router.get('/register',async function(req, res, next) {
//   res.render('users/register');
// });

/* GET users listing. */
router.get('/login',async function(req, res, next) {
  res.render('users/login');

router.post('/login', async(req,res)=>{
  try{
  let user= await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send("User not registered");
  let isValid = await bcrypt.compare(req.body.password, user.password); 
  let token= jwt.sign({ _id: user._id, name:user.name},config.get('jwtPrivateKey'));
  res.redirect('/products')
  if(! isValid) return res.status(401).send("invalid password");
 
  

  res.send(token)
  
   }catch(err)
  {
      return res.send(err)
  }
})

});
router.get('/register',async function(req, res, next) {
  res.render('users/register');
});



// router.post('/login',async function(req, res, next) {  
//   let user= await User.findOne({email:req.body.email, password:req.body.password});
//   if(!user) return res.redirect("/login")
//   req.session.user=user; 
//   // console.log(req.session.user)
//   return res.redirect("/login")
// });

// router.post('/register', async function(req, res, next) {
//   let user= new User(req.body);
//   // user.name = req.body.name;
//   // user.email = req.body.email;
//   // user.password = req.body.password;
//   await user.save();
//   console.log(user)
//   res.redirect('/products');
// });
router.post("/register", async(req,res)=>{
  let user= await User.findOne({email: req.body.email});
  if(user) return res.status(400).send("User with the same email id already exists");
   user=new User();
  user.name=req.body.name;
  user.email=req.body.email;
  user.password=req.body.password;
 // user.role= req.body.role;
  await user.generateHashedPassword();
  await user.save();
  res.redirect('/teams')


 // return res.send(_.pick(user,["name","email"]));



});
// router.get('/logout', function(req, res) {
//   req.logout();
//   if (!req.session) {
//     req.session.destroy(function(err) {
//       req.flash('success_msg', 'You are logged out');
//       res.redirect('/login');
//     });
//   }
//   else {
//     res.redirect('/login');
//   }
// });
// router.get('/logout',async function(req, res, next) {
//   req.session.user=null;
//   res.redirect('/login');
// });
router.get("/logout", auth, (req, res)=>{
  User.findById(req.user._id).then((rUser)=>{
    rUser.online = false;
    rUser.save();
    });
  res.redirect("/login");
});


module.exports = router;
