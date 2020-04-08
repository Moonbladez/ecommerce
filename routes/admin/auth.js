const express = require("express")

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup")
const signinTemplate = require("../../views/admin/auth/signin")
const router = express.Router();


router.get("/signup", (req, res) => {
    res.send(signupTemplate({
        req: req
    }));
});

router.post("/signup", async (req, res) => {
    const {
        email,
        password,
        passwordConfirmation
    } = req.body;

    //check if email has already been used
    const exsistingUser = await usersRepo.getOneBy({
        email: email,
    });
    if (exsistingUser) {
        return res.send("email already in use");
    }

    //check password and password confirmation is the same
    if (password !== passwordConfirmation) {
        return res.send("passwords must match");
    }

    //create a user in our repo for person
    const user = await usersRepo.create({
        email: email,
        password: password,
    });

    //store the ID of user inside cookie
    //added by cookie session library
    req.session.userID = user.id;

    res.send("Account created");
});

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
        email: email
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