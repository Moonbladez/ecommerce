const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UserRepository {
	constructor(filename) {
		//check filename was provided
		if (!filename) {
			throw new Error("Creating a new repository requires a filename");
		}
		// save filename as variable
		this.filename = filename;
		//check filename already exsists
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, "[]");
		}
	}

	async getAll() {
		//open filename that is being poited at
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: "utf8",
			})
		);
	}

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

	async writeAll(records) {
		//write new data. Add to seperate lines in JSON- 2 levels of indentation
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	//make random ID for each item
	randomId() {
		return crypto.randomBytes(4).toString("hex");
	}

	//get one item by passing ID
	async getOne(id) {
		//get all records
		const records = await this.getAll();
		//return with specific id
		return records.find((record) => record.id === id);
	}

	//delete a record
	async delete(id) {
		const records = await this.getAll();
		const filterRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filterRecords);
	}

	//update item
	async update(id, attributes) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);
		//see if we have found an item.
		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}

		//takes properties/key value pairs from attribute object and copy onto record object
		Object.assign(record, attributes);
		//take array and write to json file
		await this.writeAll(records);
	}

	//filtering
	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			//iterate through filters object
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			//if found is still true
			if (found) {
				return record;
			}
		}
	}
}

module.exports = new UserRepository("users.json");
