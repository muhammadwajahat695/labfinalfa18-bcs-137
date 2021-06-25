
const mongoose= require("mongoose")
const Joi= require('@hapi/joi')
var teamSchema= mongoose.Schema(
{
    name:String,

})

const Team= mongoose.model("Team",teamSchema);


module.exports.Team= Team;
