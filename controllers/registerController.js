const bcrypt = require("bcrypt");
const User = require("../models/UserSchema")
const jwt = require("jsonwebtoken")
const Role = require("../models/RoleSchema")
const usersRole = require("../models/role_user")
const env = require('dotenv').config()

const handleReg = async (req, res) => {

try {
	const { email, firstname, lastname, age, postCount, phone, time, password } = req.body.data;
	const hash = await bcrypt.hash(password, 12);
	const save = await new User({
		Email: email, fname: firstname, lname: lastname,
		phone: phone, age: age, pcount: postCount, Password: hash
	});

	//activate session
	let Email = save.Email;
	let ref = save._id;
	let Urole = await Role.getRole("user")
	let role = Urole.slug;
		const accessToken = jwt.sign(
			{ Email, role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '600s'}
		);
		const refToken = jwt.sign(
			{ Email }, process.env.JWT_REF_TOKEN, { expiresIn: '1h'}
		);
		save.refToken = refToken;
		const saveAuth = await save.save();
		const attachRole = await usersRole.create({user_id: ref, role_id: Urole._id})
		if(!saveAuth) return res.status(500).json({message: "Something went wrong!"})
		res.cookie('auth_token', refToken, { httpOnly: true, secure: true, maxAge: 1 * 60 * 60  * 1000})

	res.json({"authToken": accessToken}) 
	
} catch (err) {
	// statements
	res.status(500).json({
	message: err.message
	})
}

}


module.exports = {
	handleReg
}