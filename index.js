"use strict"

// npm install sqlite3 --save
// #--save will save it as a dependency in your package.json

const file = "test.db"

class storage {
	constructor() {
		this._fs = require("fs");

		var exists = this._fs.existsSync(file)

		let sqlite3 = require("sqlite3").verbose();
		this._db = new sqlite3.Database(file);

		this._db.serialize(function() {
		  if(!exists) {
		    this._db.run("CREATE TABLE Stuff (thing TEXT)")
		  }
		});
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
