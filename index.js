const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth")
const productsRouter = require("./routes/admin/products")

const app = express();

//public folder
app.use(express.static("public"))

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
//encryption key
app.use(cookieSession({
    keys: ["adgfythjhkkjhmljkfghhjhfdy"]
}));

app.use(authRouter)
//products router
app.use(productsRouter)


//listen for network requests(on port 3000)
app.listen(3000, () => {
    console.log("listening");
});