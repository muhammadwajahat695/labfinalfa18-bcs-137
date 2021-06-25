
const mongoose= require("mongoose");
const Joi= require('@hapi/joi');
var bcrypt= require("bcryptjs");
var userSchema= mongoose.Schema(
{
    email: {
        type: String,
        required: true,
       },
       password: {
        type: String,
        required: true
       },
       role: {
        type: String,
        default: 'user',
        
       }
})
userSchema.methods.generateHashedPassword = async function () {
    let salt= await bcrypt.genSalt(10);   //authorization
    this.password= await bcrypt.hash(this.password, salt)  //password of user will be saved via hashing
}

const User= mongoose.model("User",userSchema);

function validateUser(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        //email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','edu'] } }),
       email: Joi.string().email().min(0).required(),
        password: Joi.string().min(0).max(50).required(),
       // role: Joi.string().min(2).max(7).required(),


    });
    return schema.validate(data,{abortEarly: false});
}

function validateUserLogin(data){
    const schema = Joi.object({
        email: Joi.String().email().min(0).required(),
        password: Joi.String().min(0).max(50).required(),


    });
    return schema.validate(data,{abortEarly: false});
}
module.exports.User= User;
module.exports.validate= validateUserLogin;// for signup
module.exports.validateUserLogin= validateUser; //for Login
module.exports.generateHashedPassword=this.generateHashedPassword;