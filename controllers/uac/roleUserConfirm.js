const Role = require("../../models/RoleSchema")
const User = require("../../models/UserSchema")
const usersRole = require("../../models/role_user")

const VerifyRoleUser = async (req, res, next) => {

    try {
        const role = await Role.getPermission(req.body.data.role)
        if(!role) return res.status(403).json({message: "Forbidden!"})

        const crfR = await User.getUser(req.body.data.user)
        if(!crfR) return res.status(403).json({message: "Forbidden!"})

        const rlRole = await usersRole.findOne({user_id: crfR._id}).populate("user_id")
        if(!rlRole) return res.status(403).json({message: "Forbidden!"})
        if(rlRole.user_id?.Email != crfR.Email) return res.status(403).json({message: "Forbidden!"})
        
        next()
    } catch (err) {
        // statements
        res.status(500).json({
        err: err.message
        })
    }
    
    }
    
    module.exports = VerifyRoleUser