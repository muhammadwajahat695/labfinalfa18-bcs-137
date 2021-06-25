const { func } = require("@hapi/joi");

function authUser(req,res,next){
    if(req.user==null){
    res.status(403).send('You need to Signin/Register first')
    }
    next();
}

function basicAuth(req,res,next){
    
}