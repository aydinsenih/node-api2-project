// implement your posts router here

const Posts = require("./posts-model");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    Posts.find()
        .then((posts) => res.status(200).json(posts))
        .catch(() =>
            res.status(500).json({
                message: "The posts information could not be retrieved",
            })
        );
});

router.get("/:id", (req, res) => {
    if (!req.params.id) {
        res.status(404).json({
            message: "The post with the specified ID does not exist",
        });
    }
    Posts.findById(req.params.id).then((posts) => {
        if (posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
            });
        }
    });
});

router.post("/", (req, res) => {
    const { title, contents } = req.body;
    //const created_at = Date.now();
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        });
    }
    Posts.insert({ title, contents })
        .then((post) =>
            res.status(201).json({
                id: post.id,
                title,
                contents,
            })
        )
        .catch(() => {
            res.status(500).json({
                message:
                    "There was an error while saving the post to the database",
            });
        });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { title, contents } = req.body;
    //const updated_at = Date.now();
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        });
    }
    Posts.update(id, { title, contents })
        .then((updatedPost) => {
            if (updatedPost === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist ",
                });
            } else {
                res.status(200).json({ id, title, contents });
            }
        })
        .catch(() => {
            res.status(500).json({
                message: "The post information could not be modified",
            });
        });
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    Posts.remove(id)
        .then((post) => {
            if (post === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist ",
                });
            } else {
                res.status(200).json({ message: "deleted successfully" });
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The post could not be removed" });
        });
});

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;

    Posts.findPostComments(id)
        .then((comments) => {
            if (comments === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist ",
                });
            } else {
                res.status(200).json(comments);
            }
        })
        .catch(() =>
            res.status(500).json({
                message: "The comments information could not be retrieved",
            })
        );
});

module.exports = router;
