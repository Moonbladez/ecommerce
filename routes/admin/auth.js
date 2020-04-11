const express = require("express");

const {
    handleErrors
} = require("./middlewares")
const usersRepo = require("../../repositories/users");

const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidPasswordForUser
} = require("./validators");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send(
        signupTemplate({
            req
        }));
});

router.post(
    "/signup",
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),
    async (req, res) => {
        const {
            email,
            password,
        } = req.body;

        //create a user in our repo for person
        const user = await usersRepo.create({
            email: email,
            password: password,
        });

        //store the ID of user inside cookie
        //added by cookie session library
        req.session.userID = user.id;

        res.redirect("/admin/products");
    }
);

//signout
router.get("/signout", (req, res) => {
    req.session = null;
    res.send("Successfully logged out");
});

//signup
router.get("/signin", (req, res) => {
    res.send(signinTemplate({}));
});

//with signin
router.post(
    "/signin",
    [requireEmailExists, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req, res) => {
        const {
            email
        } = req.body;

        const user = await usersRepo.getOneBy({
            email: email,
        });

        //set user
        req.session.userID = user.id;

        res.redirect("/admin/products");
    }
);

module.exports = router;