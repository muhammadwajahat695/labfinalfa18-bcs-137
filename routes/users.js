var express = require('express');
var router = express.Router();
var { User } = require("../schemas/user")
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken")
const config = require('config')
const auth = require('../middewares/auth')

const generateHashedPassword = require('../schemas/user')

router.get('/login', async function (req, res, next) {
  res.render('users/login');

  router.post('/login', async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send("User not registered");
      let isValid = await bcrypt.compare(req.body.password, user.password);
      let token = jwt.sign({ _id: user._id, name: user.name }, config.get('jwtPrivateKey'));
      res.redirect('/products')
      if (!isValid) return res.status(401).send("invalid password");



      res.send(token)

    } catch (err) {
      return res.send(err)
    }
  })

});
router.get('/register', async function (req, res, next) {
  res.render('users/register');
});




router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with the same email id already exists");
  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  await user.generateHashedPassword();
  await user.save();
  res.redirect('/teams')






});
router.get("/logout", auth, (req, res) => {
  User.findById(req.user._id).then((rUser) => {
    rUser.online = false;
    rUser.save();
  });
  res.redirect("/login");
});


module.exports = router;
