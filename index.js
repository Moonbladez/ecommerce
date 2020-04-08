const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth")

const app = express();

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


//listen for network requests(on port 3000)
app.listen(3000, () => {
    console.log("listening");
});