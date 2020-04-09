const {
    check
} = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
    //email validation
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("must be a valid email address")
        .custom(async (email) => {
            //check to see if email has already been used
            const exsistingUser = await usersRepo.getOneBy({
                email
            });
            if (exsistingUser) {
                throw new Error("email in use");
            }
        }),
    //password check
    requirePassword: check("password")
        .trim()
        .isLength({
            min: 4,
            max: 20,
        })
        .withMessage("Must be between 4 and 20 characters"),

    //check passwords match
    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({
            min: 4,
            max: 20,
        })
        .withMessage("Must be between 4 and 20 characters")
        .custom((passwordConfirmation, {
            req
        }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error("passwords must match");
            } else {
                return true;
            }
        }),

    //email
    requireEmailExsists: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must provide a valid email")
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({
                email: email,
            });
            if (!user) {
                throw new Error("Email not found");
            }
        }),

    //password for signin

    requireValidPasswordForUser: check("password")
        .trim()
        .custom(async (password, {
            req
        }) => {
            const user = await usersRepo.getOneBy({
                email: req.body.email,
            });
            if (!user) {
                throw new Error("Invalid password");
            }

            //compare both passwords
            const validPassword = await usersRepo.comparePasswords(
                user.password,
                password
            );
            //check password
            if (!validPassword) {
                throw new Error("Invalid password");
            }
        }),
};