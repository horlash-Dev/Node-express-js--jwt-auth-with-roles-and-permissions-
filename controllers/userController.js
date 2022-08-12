const User = require("../models/UserSchema")

exports.fetchAll = async (req,res) => {
try {
	const all = await User.findAll();
	if(!all) return res.status(404).json({message: "no record found!"});
	res.status(200).json({users: all})
} catch (error) {
	let err = error.message
	res.status(500).json({err})
}

}

exports.show = async (req,res) => {
	let mail = req.params.user;
	try {
		const user = await User.getUser(mail)
		if (!user) return res.status(404).json({message: "no record found!"})
		let fullname =  User.FullName(user)
		res.status(200).json({"user": user, fullname});	
	} catch(error) {
		// statements
		let err = error.message
		res.status(500).json({err})
	}
}

exports.createUser = async (req,res,next) => {
		
try {
	const { email, firstname, lastname, age, postCount, phone, time, password } = req.body;
	const hash = await bcrypt.hash(password, 12);
	const save = await new User({
		Email: email, fname: firstname, lname: lastname,
		phone: phone, age: age, pcount: postCount, Password: hash
	}).save();
	res.json({data: save}) 
	
} catch(error) {
	// statements
	let err = error.message
	res.status(500).json({err})
}

}

exports.updateUser = async (req,res) => {
	try {
		const {Fname, Lname, Email, phone } = req.body.data
		let user = req.params.user;
		const updateUser = await User.findOne({Email: user}).exec()
		updateUser.fname = Fname;
		updateUser.lname = Lname;
		updateUser.Email = Email;
		updateUser.phone = phone;

		updateUser.save((err, updatedInfo) => {
			if (err) return res.status(500).json({message: "something is wrong!"})
			else return res.status(200).json({updatedInfo})
		})
	} catch (error) {
		let err = error.message
		res.status(500).json({err})
	}

}

exports.Delete = async (req,res) => {
	let id = req.params.user;
	try {
		const user = await User.findOneAndDelete({Email: id}).exec();
		if (!user) return res.status(404).json({message: "no record found!"})
		res.status(200).json({message: 'User deleted successfully!'});	
	} catch(error) {
		// statements
		let err = error.message
		res.status(500).json({err})
	}
}