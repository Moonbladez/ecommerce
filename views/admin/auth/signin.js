const layout = require("../layout")

module.exports = () => {
    return layout({
        content: `         
            <div>
                <form method="POST">
                    <input placeholder="email" name="email"/>
                    <input placeholder="password" name="password"/>
                    <button>Sign In</button>
                </form> 
            </div>`
    });
};