const { mongoose, Schema } = require("mongoose");

const Role = new Schema({
    name: {
        type: String, required: true, unique: true, trim: true,
    },
    slug: {
        type: String, required: true, unique: true
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission"}]
}, { timestamps: true })


Role.statics.getPermission = function (role){
    return this.findOne({slug: role}).populate("permissions").exec()
}
Role.statics.getRole = function (role){
    return this.findOne({slug: role}).select("slug").exec()
}
Role.statics.getRoles = function (){
    return this.find().select("name slug").exec()
}

Role.statics.getAllRoles = function (){
    return this.find().populate("permissions").lean().exec()
}
module.exports = mongoose.model("Role", Role)