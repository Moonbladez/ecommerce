const express = require("express");
const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input placeholder="email" name="email"/>
                <input placeholder="password" name="password"/>
                <input placeholder="password confirmation" name="passwordConfirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});



app.post("/", (req, res) => {
    console.log(req.body)
    //get access to email, pw
    res.send("Account Created");
});

//listen for network requests(on port 3000)
app.listen(3000, () => {
    console.log("listening");
});