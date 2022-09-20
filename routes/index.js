const express = require('express');
const {ensureAuth, ensureGuest} = require("../middleware/auth");
const mongoose = require('mongoose');
const Story = require("../models/story");
const router = express.Router();
// login 
router.get('/', ensureGuest, (req, res) => {
    res.render("login",{layout:"login"})
});

// dashboard 
router.get('/dashboard', ensureAuth ,async(req, res) => {
    try{
        const stories = await Story.find({user: req.user.id}).lean()
        res.render("dashboard",{
            name: req.user.firstName,
            stories: stories
        })
    }catch(err){
        console.log(err);
        res.render("error/500")
    }
})

module.exports = router;