const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.send(`
        <div>
            <form>
                <input placeholder="email"/>
                <input placeholder="password"/>
                <input placeholder="password confirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

//listen for network requests(on port 3000)
app.listen(3000, () => {
	console.log("listening");
});
