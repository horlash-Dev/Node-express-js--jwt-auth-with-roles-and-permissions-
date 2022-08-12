const express = require("express")
const app = express();
const router = express.Router();
const handleRoleConfirm = require("../controllers/uac/roleUserConfirm")
const { index, getPermissions } = require("../controllers/homeController.js")

const { handleReg } = require("../controllers/registerController")
const { handleLogin } = require("../controllers/loginController");
const { run } = require("../controllers/uac/runUac")

router.get("/", index)

router.post("/register", handleReg);
router.post("/login", handleLogin);

//get permission to frontend
router.post("/access", handleRoleConfirm, getPermissions)

//seed roles and permission for the app.
router.get("/uac-setup", run)
module.exports = router; 