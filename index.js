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

	test() {
		this._db.run("INSERT INTO Stuff values (1)")

		this._db.each("SELECT * FROM Stuff", function(err, row) {
			console.log(row)
		})
	}
}

let s = new storage()
s.test()