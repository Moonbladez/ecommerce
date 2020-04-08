const layout = require("../layout")

module.exports = ({
    req
}) => {
    return layout({
        content: `
        <div>
        <p>Your ID is: ${req.session.userID}</p>
            <form method="POST">
                <input placeholder="email" name="email"/>
                <input placeholder="password" name="password"/>
                <input placeholder="password confirmation" name="passwordConfirmation"/>
                <button>Sign Up</button>
            </form>
        </div>`
    });
};