const mExpress		= require("express");
const mBodyParser	= require("body-parser");
const mSession		= require('express-session');
const mFs			= require("fs");

const gApp = mExpress();

// VIEW 에 대한 설정
gApp.set("views", __dirname + "/views");
gApp.set("view engine", "ejs");
gApp.engine("html", require("ejs").renderFile);

// Static Folder 에 대한 설정
gApp.use(mExpress.static("resource"));

// Body Parser 에 대한 설정
gApp.use(mBodyParser.json());
gApp.use(mBodyParser.urlencoded({ extended : true }));
gApp.use(mSession({
	secret: '@#@$MYSIGN#@$#$',
	resave: false,
	saveUninitialized: true
}));

// Router Loading.
require('./router/main')(gApp, mFs);

gApp.listen(3000, () => {
	console.log("aaa");
	console.log("Example app listening on port 3000!");
});