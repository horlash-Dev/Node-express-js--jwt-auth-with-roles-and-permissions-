const express = require("express")
const app = express();
const router = express.Router();
const UacPermission = require("../controllers/uac/UacMiddleware")

const { fetchAll, createUser, updateUser, show, Delete } = require("../controllers/userController.js")

router.route('/').get(UacPermission("users.edit","users.view","master.admin"), fetchAll).post(UacPermission("users.create","master.admin"),createUser);

router.route('/:user').get(UacPermission("users.view","master.admin"), show).put(UacPermission("users.edit","master.admin"),updateUser).delete(UacPermission("users.delete","master.admin"), Delete);


module.exports = router;