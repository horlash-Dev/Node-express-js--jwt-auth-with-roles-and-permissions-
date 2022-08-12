const { permissions, roles } = require("../../models/seedRoles")
const Role = require("../../models/RoleSchema")
const Permission = require("../../models/Permission");
const { Error } = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/UserSchema")
const usersRole = require("../../models/role_user")
const insertPermission = async () => {
    try {
        const savePermission = await Permission.insertMany(permissions)
         return savePermission;
    } catch (error) {
        throw new Error(error.message)
    }
}

const insertRoles = async () => {
    try {
        const saveRole = await Role.insertMany(roles)
         return saveRole;
    } catch (error) {
        throw new Error(error.message)
    }
}

exports.run = async (req,res) => {
    try {
        const runPerms = await insertPermission()
        const runRoles = await insertRoles()
        //attach roles to permissions
        const users_ = await Permission.where({slug: /users/i}).limit(4).lean().exec()
        const editors_ = await Permission.findOne({slug: "permissions"}).limit(1).lean().exec()
        const forEditor = [...users_, editors_]
        const adminrole = await Role.updateOne({slug: runRoles[0].slug}, {permissions: runPerms})
        const editorrole = await Role.updateOne({slug: runRoles[1].slug}, {permissions: forEditor})
        const userrole = await Role.updateOne({slug: runRoles[2].slug}, {permissions: users_})
        const hash = await bcrypt.hash("123456789", 10);
        const save = await new User({
            Email: "admin@admin.com", fname:"master", lname: "app admin",
            phone: "53533535336", Password: hash
        }).save()
        const attachRole = await usersRole.create({user_id: save._id, role_id: runRoles[0]._id})

        res.status(200).json({message: "ROLES & PERMISSION SEEDED SUCCESFULLY(SIGIN-IN THE ADMIN)"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}
