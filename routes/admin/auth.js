const express = require("express");
const {
    check,
    validationResult
} = require("express-validator");

const usersRepo = require("../../repositories/users");

const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExsists,
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

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(
                signupTemplate({
                    req,
                    errors,
                })
            );
        }

        const {
            email,
            password,
            passwordConfirmation
        } = req.body;

        //create a user in our repo for person
        const user = await usersRepo.create({
            email: email,
            password: password,
        });

        //store the ID of user inside cookie
        //added by cookie session library
        req.session.userID = user.id;

        res.send("Account created");
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
    [requireEmailExsists, requireValidPasswordForUser],
    async (req, res) => {
        const errors = validationResult(req);
        //if errors is not empty, throw template with errors included
        if (!errors.isEmpty()) {
            return res.send(signinTemplate({
                errors
            }))
        }
        //check someone has signed up already with email
        const {
            email
        } = req.body;

        const user = await usersRepo.getOneBy({
            email: email,
        });

        //set user
        req.session.userID = user.id;

        res.send("You have successfully signed up");
    }
);

module.exports = router;