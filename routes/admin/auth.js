const express = require("express");
const {
    check,
    validationResult
} = require("express-validator");

const usersRepo = require("../../repositories/users");

const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send(
        signupTemplate({
            req: req,
        })
    );
});

router.post(
    "/signup",
    [
        //email validation
        check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("must be a valid email address")
        .custom(async (email) => {
            const exsistingUser = await usersRepo.getOneBy({
                email
            });
            if (exsistingUser) {
                throw new Error("email in use")
            }
        }),

        //password validation
        check("password")
        .trim()
        .isLength({
            min: 4,
            max: 20
        })
        .withMessage("Must be between 4 and 20 characters"),

        //password matches
        check("passwordConfirmation")
        .trim()
        .isLength({
            min: 4,
            max: 20
        })
        .withMessage("Must be between 4 and 40 characters")
    ],





    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
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
    res.send(signinTemplate());
});

//deap with signin
router.post("/signin", async (req, res) => {
    //check someone has signed up already with email
    const {
        email,
        password
    } = req.body;

    const user = await usersRepo.getOneBy({
        email: email,
    });

    if (!user) {
        return res.send("Email not found");
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );
    //check password
    if (!validPassword) {
        return res.send("Invalid password");
    }

    //set user
    req.session.userID = user.id;

    res.send("You have successfully signed up");
});

module.exports = router;