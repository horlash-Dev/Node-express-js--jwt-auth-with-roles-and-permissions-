const Role = require("../models/RoleSchema")
exports.index = (req, res) => {
	res.status(200).redirect("/user");
}

exports.getPermissions = async (req, res) => {
    try {
    const role = await Role.getPermission(req.body.data.role)
	let permissions_ = role.permissions
    if(!role) return res.status(403).json({message: "Forbidden!"})
    return  res.status(200).json({permissions_})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}
