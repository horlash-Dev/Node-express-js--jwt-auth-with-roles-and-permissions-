const Role = require("../../models/RoleSchema")
const User = require("../../models/UserSchema")
const usersRole = require("../../models/role_user")
const Permission = require("../../models/Permission")

exports.allRoles = async (req, res) => {
    try {
    const all = await Role.getAllRoles()
    if(!all) return res.status(404).json({message: "No Record Found!"})
    return  res.status(200).json({all})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.getPermissions = async (req, res) => {
    try {
    const role = await Role.getPermission(req.params.role)
    if(!role) return res.status(404).json({message: "No Record Found!"})
    const per_ = await Permission.showAll()
    if(!per_) return res.status(404).json({message: "No Record Found!"})
    return  res.status(200).json({role, per_})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.attachPermissions = async (req, res) => {
    try {
    const role = await Role.getRole(req.params.role)
    if(!role) return res.status(404).json({message: "No Record Found!"})
    let permissions = [...req.body.data]
    role.permissions = permissions
    await role.save()
    return  res.status(200).json({role, message: "Role_Permissions Updated!"})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.getRelation = async (req, res) => {
    try {
    const all = await usersRole.getRelation()
    if(!all) return res.status(404).json({message: "No Record Found!"})

    return  res.status(200).json({all})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}


exports.checkRole = async (req, res) => {
    try {
    const role = await Role.getRole(req.params.role)
    if(!role) return res.status(404).json({message: "No Record Found!"})

    const roles = await Role.getRoles()
    if(!roles) return res.status(404).json({message: "No Record Found!"})
    
    const user = await User.getUser(req.params.email)
    if(!user) return res.status(404).json({message: "No Record Found!"})

    return  res.status(200).json({role, roles, user})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.attachRole = async (req, res) => {
    try {
    const roleUser = await usersRole.getUser(req.params.user)
    if(!roleUser) return res.status(404).json({message: "No Record Found!"})
    if (roleUser && roleUser.role_id == req.body.data?.oldID) {
        oldrole = await usersRole.deleteOne({_id: roleUser._id}).exec()
        if(oldrole.deletedCount != 1) return res.status(500).json({message: "Something went Wrong!"})
        newrole = await usersRole.create({user_id: roleUser.user_id, role_id: req.body.data?.role})
        if(!newrole) return res.status(500).json({message: "Something went Wrong!"})
        return  res.status(200).json({role: "User role Updated!"})
    }
    return  res.status(500).json({message: "Something went Wrong!"})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}