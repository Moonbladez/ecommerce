const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
//encryption key
app.use(cookieSession({ keys: ["adgfythjhkkjhmljkfghhjhfdy"] }));

app.get("/", (req, res) => {
	res.send(`
        <div>
        <p>Your ID is: ${req.session.userID}</p>
            <form method="POST">
                <input placeholder="email" name="email"/>
                <input placeholder="password" name="password"/>
                <input placeholder="password confirmation" name="passwordConfirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post("/", async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;

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

//listen for network requests(on port 3000)
app.listen(3000, () => {
	console.log("listening");
});
