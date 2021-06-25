var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require("mongoose");
var session = require('express-session');
var sessionAuth= require("./middewares/sessionAuth")

var config=require('config')
var indexRouter = require('./routes/index');
var teamsRouter = require('./routes/teams');
var usersRouter = require('./routes/users');


var app = express();
app.use(session({secret: 'keyboard cat', cookie :{maxAge: 60000} }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(sessionAuth); //this funvtion is called for every route
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/teams', teamsRouter);   //this router will route to available teams screen

app.use('/', usersRouter);
//app.use('/add',addRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose
.connect(config.get("db"),
{ 
  useNewUrlParser: true , 
 useUnifiedTopology: true 
})
.then(() => console.log("successfully Connected to Mongo...."))
.catch((error) => console.log(error.message));


module.exports = app;
