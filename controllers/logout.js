const jwt = require("jsonwebtoken") 
const env = require('dotenv').config()
const User = require("../models/UserSchema")

const handleSignout = async (req, res, next) => {

try {
	const token = req.cookies;
	if (!token) return res.sendStatus(204);
	let refT = token.auth_token;
	if (!refT) {
		res.clearCookie("auth_token", { httpOnly: true, secure: true, }); 
		return res.sendStatus(204);
	}

	confrimToken = await User.findOne().findWhere({refToken: refT})
	if (!confrimToken)  {
	res.clearCookie("auth_token", { httpOnly: true, secure: true, }); 
	return res.sendStatus(204);
	} 
	confrimToken.refToken = {};
	const result = await confrimToken.save(); 

	res.clearCookie("auth_token", { httpOnly: true, secure: true, }); 
	return res.sendStatus(204);

	
} catch (err) {
	// statements
	res.status(500).json({
	message: err.message
	})
}

}

module.exports = handleSignout