const jwt= require('jsonwebtoken');
const config=require('config');
const { User } = require('../schemas/user');

async function auth(req,res,next){
let token= req.header("x-auth-token");
if(!token) return res.status(400).send("Access denied.no token provided");
try{
let user= jwt.verify(token, config.get("jwtPrivateKey"));
req.user= await User.findById(user._id);
}catch(err){
    return res.status(401).send("invalid token");
}
next();


}
module.exports= auth;


