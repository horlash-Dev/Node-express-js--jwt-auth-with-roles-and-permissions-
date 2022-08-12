const mongoose = require('mongoose')
const Role = require("../../models/RoleSchema")
const UacPermission = (...permissions) => {

return async (req,res,next) => {
    if (!req?.role) return res.sendStatus(401)
    const allowedPerms = [...permissions];
    const getPerms = await Role.getPermission(req.role)
    const checkPermissions = getPerms.permissions.map(role => allowedPerms.includes(role.slug)).find(role => role === true)
    if (!checkPermissions) return res.sendStatus(403)
    next()
}
}


module.exports = UacPermission