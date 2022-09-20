const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 4000

// passport config
// require("./model/passport")(passport);
require("./config/passport")(passport);

connectDB();
const app = express();

// body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// method override
app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}))
// logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"));
}

const {formatDate,stripTags,truncate,editIcon, select} = require("./helpers/hbs");
// handlebars
app.engine(".hbs",exphbs.engine({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
},defaultLayout:"main",extname:".hbs"}));
app.set('view engine',".hbs");

app.use(session({
    secret: "our secret",
    resave: false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL  
      })
}))
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global variable
app.use(function(req,res,next){
    res.locals.user = req.user || null;
    next();
})
// static folder
app.use(express.static("public"));

app.use("/",require("./routes/index"));
app.use("/auth",require("./routes/auth"));
app.use("/stories",require("./routes/stories"));
app.listen(PORT, console.log(`Server is running on port ${PORT}`));