var express = require('express');
var router = express.Router();

var {Team}= require('../schemas/Team')
var checkSessionAuth= require("../middewares/checkSessionAuth")

/* GET home page. */

const db=require("../config/default.json");
const auth= require("../middewares/auth")
const admin=require('../middewares/admin');
const sessionAuth = require('../middewares/sessionAuth');

//First middleware(auth) ensures that user is logged in, and (admin) ensures that user is an ADMIN only
// router.get('/',async(req,res)=>{
//     console.log(req.user);
//     let page= Number(req.query.page ? req.query.page : 1);
//     let perPage= Number(req.query.perPage ? req.query.perPage : 10);
//     let skipRecords= (perPage*(page-1))
//     let teams= await Team.find().skip(skipRecords).limit(perPage);
//     console.log(teams)
//     res.render('teams/teamslist',{title:"LIST OF AVAILABLE TEAMS", teams});
    

// });

router.get("/", async function(req, res, next) {
  let teams= await Team.find()
  console.log(req.session.user)
  console.log(teams)
  res.render('teams/teamslist',{title:"Available teams for PSL",teams});
});

router.get("/add",auth, async function(req, res, next) {
  res.render("teams/add");
});
//stores data in db
router.post("/add", async function(req, res, next) {
  console.log(req.body)
  let team= new Team(req.body);
  await team.save();
  res.redirect('/teams')
 
});
router.get("/delete/:id",auth,async function(req, res, next) {
  let team=await Team.findByIdAndDelete(req.params.id) 
  res.redirect('/teams');
  
 
});
//cthis ground option contains list of teams that has been selected
router.get("/ground/:id", async function(req, res, next) {
 
    var temp=0;
    let team= await Team.findById(req.params.id);
    console.log("PLAY")
    let ground=[];
    // ADD team IN ground
    if(temp<=2)
    {
    if(req.cookies.ground)ground = req.cookies.ground;
    ground.push(team);
    temp=temp+1;
    res.cookie("ground",ground)
    team.remove({_id: req.body.id})
    res.redirect('/teams');
    }
    else
    res.redirect('/teams');

 
  //


 
  
 

});


//ground delete operation
router.get("/ground/remove/:id", async function(req, res, next) {
  let ground=[];
  if(req.cookies.ground)ground = req.cookies.ground;
  ground.splice(
    ground.findIndex((c)=>(c._id == req.params.id)),
    1
  );
  res.cookie("ground",ground)
  res.redirect('/teams');
 
 
});

//eid your teams  operation

router.get("/edit/:id", async function(req, res, next) {
  let team= await Team.findById(req.params.id);
  res.render('teams/edit',{ team });
   res.redirect('/teams');
 
 

});
router.post("/edit/:id", async function(req, res, next) {
  let team= await Team.findById(req.params.id);
  team.name = req.body.name;
  await team.save();
  res.redirect('/teams');
 

});


module.exports = router;
