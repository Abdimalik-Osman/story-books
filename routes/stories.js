const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/story");
const router = express.Router();

// get stories
router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add");
});

// get all stories  /stories
router.get("/", ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: "public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();

        res.render("stories/index", {
            stories: stories,
        });
    } catch (err) {
        console.log(err);
        res.render("error/500");
    }
});
//add new stories
router.post("/", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("error/500");
    }
});
// show single story  GET stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate("user").lean();
        if (!story) {
            return res.render("error/404");
        }
        res.render("stories/show",{story: story});
    } catch (error) {
        console.log(error);
        res.render("error/404");
    }
});
// get single story /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();

        if (!story) {
            return res.render("error/404");
        }

        if (story.user != req.user.id) {
            res.redirect("/stories");
        } else {
            res.render("stories/edit", { story: story });
        }
    } catch (err) {
        console.log(err);
        res.render("error/500");
    }
});

// update story /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();
        if (!story) {
            return res.render("error/404");
        }

        if (story.user != req.user.id) {
            res.redirect("/stories");
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            });
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
        res.render("error/500");
    }
});

// delete story stories/delete/:id
router.delete("/:id", ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id });
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render("error/500");
    }
});

// get user stories  stories/user/:userId
router.get("/user/:userId",ensureAuth, async (req, res)=>{
    try {
        let stories = await Story.find({
            user: req.params.userId,
            status:'public'})
            .populate('user')
            .lean();
        res.render("stories/index", {stories: stories});
    } catch (err) {
        console.log(err);
        res.render("error/500");
    }
});
module.exports = router;
