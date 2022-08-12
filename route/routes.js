const express = require("express")
const app = express();
const router = express.Router();
const { createPermission, allPermission, deletePermission } = require("../controllers/uac/permissionController")
const { allRoles, attachPermissions, getPermissions, checkRole, attachRole, getRelation } = require("../controllers/uac/roleController")
const UacPermission = require("../controllers/uac/UacMiddleware.js");

router.post("/create-permission", UacPermission("master.admin","roles"), createPermission)
router.get("/permissions",UacPermission("master.admin","permissions"), allPermission)
router.delete("/permission/:name/delete",UacPermission("master.admin","roles"), deletePermission)

router.get("/roles",UacPermission("master.admin","roles"), allRoles)
router.get("/edit/:role/permissions",UacPermission("master.admin","roles"), getPermissions)
router.put("/attach/:role/permissions",UacPermission("master.admin","roles"), attachPermissions)
router.get("/user-roles",UacPermission("master.admin","roles"), getRelation)
router.get("/confirm/:email/user/:role",UacPermission("master.admin","roles"), checkRole)
router.put("/attach/:user/role",UacPermission("master.admin","roles"), attachRole)

module.exports = router; 