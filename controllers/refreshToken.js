const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken") 
const env = require('dotenv').config()
const User = require("../models/UserSchema")
const usersRole = require("../models/role_user")
const handleRef = async (req, res, next) => {

try {
	const token = req.cookies;
	if (!token) return res.sendStatus(401);
	let refT = token?.auth_token;
	if (!refT) {
		res.clearCookie("auth_token", { httpOnly: true, secure: true, }); 
		return res.sendStatus(401);
	} 
	res.clearCookie("auth_token", { httpOnly: true, secure: true, }); 
	confrimToken = await User.findOne().findWhere({refToken: refT})
	if (!confrimToken)  {
		//detect reused reftoken and delete in DB.
		reusedRef = jwt.verify(
			refT, process.env.JWT_REF_TOKEN, async (error, decoded) =>{
				if (error) return res.sendStatus(403);

				const reusedUser = await User.findOne().findWhere({ Email: decoded.Email });
				reusedUser.refToken = {};
				const result = await reusedUser.save();
			});
	return res.sendStatus(401);
	}
	let Email = confrimToken.Email;
	let ref = confrimToken._id;
	verifyRef = jwt.verify(
			refT, process.env.JWT_REF_TOKEN, async (error, decoded) =>{
				if (error || confrimToken.Email !== decoded.Email){
				confrimToken.refToken = {};
				await confrimToken.save(); 
				return res.sendStatus(403)
				}
				//find user role
				let user_role = await usersRole.getUser(ref)
				if(!user_role) return res.status(404).json({message: "No Record Found!"})
				let roleid = user_role.role_id
				let getrole = await usersRole.getRole(roleid)
				if(!getrole) return res.status(404).json({message: "No Record Found!"})
				let role = getrole.slug
				//new access token
			const accessToken = jwt.sign(
			{ Email, role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '600s'});

				//generate new refToken for auth.
	const newrefToken = jwt.sign({ Email }, process.env.JWT_REF_TOKEN, { expiresIn: '1h'});
	confrimToken.refToken = newrefToken;
	const saveRef = await confrimToken.save();
	res.cookie('auth_token', newrefToken, { httpOnly: true, secure: true, maxAge: 1 * 60 * 60  * 1000})
	return res.status(200).json({  accessToken })

});
	
} catch (err) {
	// statements
	res.status(500).json({
	erorr: err.message
	})
}

}

module.exports = {
	handleRef
}