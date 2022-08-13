const express = require('express');
const app = express();

const mongoose = require('mongoose')
const env = require('dotenv').config()
const morgan = require('morgan')
const path = require("path")
const cookieParser = require("cookie-parser")
//routers
const route = require("./route/routes")
const auth = require("./route/authRoute")
const routeUsers = require("./route/users")

//token authentication middleware
const { handleVerify } = require("./controllers/verifyToken")
const { handleRef } = require("./controllers/refreshToken")
//logout
const logOut = require("./controllers/logout")
//app log from any request before cors and after
const { logEvent } = require("./controllers/logger")
//cors and protection
const cors = require("cors")
app.use(logEvent)
const whiteList = ['https://mysite.com','http://localhost:4000', 'http://localhost:3000'];
const corsOptions = {
	origin: (origin,callback) => {
		if (whiteList.indexOf(origin) !== -1 || !origin) {
			callback(null,true)
		}else {
			callback(new Error("CORS BLOCKED THIS REQUEST!!"));
		}
	},
	OptionsSucessStatus: 200
}
const credentials = (req, res, next) => {
	if (whiteList.includes(req.headers.origin)) {
		res.header("Access-Control-Allow-Credentials", true)
	}
	next()
}
app.use(credentials)
app.use(cors(corsOptions))
//mongo db connection
connect();
 async function connect() {
	try {
		await mongoose.connect(process.env.MONGODB_URI)
	} catch(error) {
		// statements
		throw error.message
	}
}
//middlewares
app.use(morgan("dev"))
app.use(cookieParser());
app.use(express.json())
//siginup/in
app.use(auth)
app.use('/logout',logOut)
//refresh token
app.use('/refresh',handleRef)
//authticated user access 
app.use(handleVerify)
app.use(route)
app.use("/user", routeUsers)
//express custom error stack
app.use((err,req,res,next)=>{
//	console.error(err.stack);
	res.status(500).json(err.message);
	next()
})

//server Listen
app.listen(process.env.PORT || 5000, console.log(`SERVER STARTED @${process.env.PORT}`))

