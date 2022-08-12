const { mongoose, Schema } = require("mongoose");
const Role = require("./RoleSchema")
const usersRole = new Schema({
    user_id: {type: Schema.Types.ObjectId, unique: true, ref: "User" }, 
    role_id: {type: Schema.Types.ObjectId, ref: "Role"}
},{ collection: "user_role"})

usersRole.statics.getUser = function (id){
    return this.findOne({user_id: id}).exec()
}

usersRole.statics.getRelation = function (){
    return this.find().populate("role_id user_id").exec()
}


usersRole.statics.getRole = async function (role){
   return await Role.findOne({_id: role}).select("slug").exec()

}
module.exports = mongoose.model("usersRole", usersRole)