const { mongoose, Schema } = require("mongoose");

const UserSchema = new Schema({

	fullname: {
		fname: {
			type: String, minLength:5, required: true, trim: true, alias: "fname"
		},
		lname: {
			type: String, minLength:5, required: true, trim: true, alias: "lname"
		}
	},

	Email: {type: String, required: true,  unique: true, lowercase: true, alias:"mail"},

	phone: { type: String, required: true, trim: true,},

	Password: { type: String, required: true},

	Date: {type: Date, default: Date.now() },

	refToken: { },

	otherInfo: {

		age:  {type: Number, alias: "age"},
		posts: {type: Number, alias: "pcount"}
	},


}, { timestamps: true});

UserSchema.statics.findAll = function () {
	return  this.find().sort({createdAt: "desc"}).exec();
}

UserSchema.statics.getUser = function (email) {
	return  this.findOne({Email: email}).select("-refToken -Password").lean().exec()
}

UserSchema.query.findWhere = function (args) {
	return  this.where(args).select("Email refToken _id").exec();
}

UserSchema.statics.auth = function (auth) {
	return  this.findOne({ Email: auth}).select("Email Password _id refToken").exec();
}

UserSchema.virtual("FullName").get(function () {
	return this.fullname.fname + " " + this.fullname.lname;
})
UserSchema.statics.FullName = function (user) {
	return user.fullname.fname + " " + user.fullname.lname;
}
module.exports = mongoose.model("User", UserSchema);


