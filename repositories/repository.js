const fs = require("fs");
const crypto = require("crypto");



module.exports = class Repository {
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

    async create(attributes) {
        attributes.id = this.randomId();

        const records = await this.getAll();
        records.push(attributes);
        await this.writeAll(records);

        return attributes;
    }

    async getAll() {
        //open filename that is being poited at
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: "utf8",
            })
        );
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