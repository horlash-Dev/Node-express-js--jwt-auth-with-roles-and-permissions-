const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const env = require('dotenv').config()
const User = require("../models/UserSchema")
const { handleRef } = require("./refreshToken")
const handleVerify = async (req, res, next) => {

try {
	const token = req.headers.authorization;
	if (!token) return res.sendStatus(401);
	const auth_verify = token.split(" ")[1];
		const verifyToken = jwt.verify(
			auth_verify, process.env.JWT_ACCESS_TOKEN, (error, decoded) =>{
				if (error) {
					return res.sendStatus(403)
				}
				req.isAuth = { decoded }
				req.role = decoded.role
				next();
			});
	
} catch (err) {
	// statements
	res.status(500).json({
	err: err.message
	})
}

}


module.exports = {
	handleVerify
}