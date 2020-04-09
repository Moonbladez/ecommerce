const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const Repository = require("./repository")

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
	async create(attributes) {
		//random id
		attributes.id = this.randomId();

		//generate salt
		const salt = crypto.randomBytes(8).toString("hex");
		const hashed = await scrypt(attributes.password, salt, 64);

		//load data
		const records = await this.getAll();
		const record = {
			...attributes,
			//override plain password in attributes with hashed password
			password: `${hashed.toString("hex")}.${salt}`,
		};
		//add user
		records.push(record);
		await this.writeAll(records);

		return record;
	}


	//compare passwords
	async comparePasswords(saved, supplied) {
		//saved is password saved in database
		//supplied is password supplied by user
		const result = saved.split(".");
		const hashed = result[0];
		const salt = result[1];

		const hashedSupplied = await scrypt(supplied, salt, 64);
		//compare both
		return hashed === hashedSupplied.toString("hex");
	}
}

module.exports = new UserRepository("users.json");