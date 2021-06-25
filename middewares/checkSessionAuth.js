function checkSessionAuth(req,res,next){
    //set variables for every pug file
    if((res.locals.user = req.session.user)) next(); //if user exists
    else return res.redirect("back")
}
module.exports = checkSessionAuth;