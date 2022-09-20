const express = require('express');
const router = express.Router();
const passport = require('passport');
// auth google 
router.get('/google', passport.authenticate('google',{scope:["profile"]}))

// callback 
router.get('/google/callback',passport.authenticate('google',
{
    failureRedirect: '/'
 }),
    (req,res) => {
        res.redirect("/dashboard");
    }
)

// logout user
router.get("/logout",(req,res, next)=>{
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect("/");
        });
})
module.exports = router;