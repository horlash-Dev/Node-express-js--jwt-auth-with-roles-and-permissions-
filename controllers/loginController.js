const bcrypt = require("bcrypt");
const User = require("../models/UserSchema")
const jwt = require("jsonwebtoken")
const env = require('dotenv').config()
const usersRole = require("../models/role_user")

const handleLogin = async (req, res) => {
try {
	const cookie = req.cookies;
	 const { email, password } = req.body.data;
	const auth = await User.auth(email);
	if (!auth) return res.status(401).json({message: "Invalid Credentials check your email!"})
	const check = await bcrypt.compare(password, auth.Password);
	if (!check) return res.status(401).json({message: "Invalid Credentials check your password!"})
		//activate session
	let Email = auth.Email;
	let ref = auth._id;
	//clean old cookies
	let oldCookie = cookie.auth_token;
		if (oldCookie && oldCookie === auth.refToken) {
		res.clearCookie("auth_token", { httpOnly: true, secure: true, }); 
			auth.refToken = {};
			await auth.save();
	}
	let user_role = await usersRole.getUser(ref)
	if(!user_role) return res.status(404).json({message: "No Record Found!"})
	let roleid = user_role.role_id
	let getrole = await usersRole.getRole(roleid)
	if(!getrole) return res.status(404).json({message: "No Record Found!!"})
	let role = getrole.slug
		const accessToken = jwt.sign(
			{ Email, role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '600s'}
		);
		const refToken = jwt.sign(
			{ Email }, process.env.JWT_REF_TOKEN, { expiresIn: '1h'}
		);
		auth.refToken = refToken;
		const saveAuth = await auth.save();
		if(!saveAuth) return res.status(500).json({mesage: "Something went wrong!"})
		res.cookie('auth_token', refToken, { httpOnly: true, secure: true, maxAge: 1 * 60 * 60  * 1000})
		res.status(200).json({ "authToken": accessToken})
	
} catch (err) {
	// statements
	res.status(500).json({
	message: err.message
	})
}

}

module.exports = {
	handleLogin
}