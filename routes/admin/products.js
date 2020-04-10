const express = require("express");
const multer = require("multer");

const {
    handleErrors
} = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const {
    requireTitle,
    requirePrice
} = require("./validators");

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
});

//product listing to admin route
router.get("/admin/products", (req, res) => {});

//show form to add product
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});

//form submition
router.post(
    "/admin/products/new",
    upload.single("image"),
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString("base64");
        const {
            title,
            price
        } = req.body;

        await productsRepo.create({
            title,
            price,
            image
        });

        res.send("submitted");
    }
);

module.exports = router;