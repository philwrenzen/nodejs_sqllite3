"use strict"

// npm install sqlite3 --save
// #--save will save it as a dependency in your package.json

const file = "test.db"

class storage {
	createField(table, field, definition) {
		let found = 0
		this._db.each("PRAGMA table_info(" + table + ")", function(err, row) {
			if (row.name == field) {
				console.log("field already exists")
				found = 1
				return
			}
		})

		if (found == 0) {
			console.log("Add field")
			this._db.run("ALTER TABLE " + table + " ADD " + field + " " + definition)
		}
	}

	createTable() {
		this._db.run("CREATE TABLE IF NOT EXISTS Stuff (thing TEXT)")
		this.createField("Stuff", "thing", "varchar(20)")
	}

	constructor() {
		this._fs = require("fs");

		var exists = this._fs.existsSync(file)

		let sqlite3 = require("sqlite3").verbose();
		this._db = new sqlite3.Database(file);

		this._db.serialize(() => {});

		this.createTable()

		this._db.each("PRAGMA table_info(Stuff)", function(err, row) {
			console.log(row)
		})
	}

	closeConnection() {
		this._db.close()
	}

	test() {
		this._db.each("SELECT * FROM Stuff", function(err, row) {
			console.log(row)
		})
	}

	parameterised(value) {
		let stmt = this._db.prepare("INSERT INTO Stuff VALUES (?)")
		stmt.run(value)
		stmt.finalize()
	}
}

let s = new storage()
s.parameterised("testing")
s.test()
s.closeConnection()
