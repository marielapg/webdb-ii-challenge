const express = require("express");
const knex = require("knex");

const knexConfig = require('../knexfile.js')

// const knexConfiguration = {
//     // client answers: which type (sqlite, postgres, mysql, oracle) of database?
//     client: "sqlite3", // the db driver
//     // the rest will depend on the type of database
//     // connection could be a string or an object
//     connection: {
//         filename: "./data/car-dealer.db3",
//     },
//     useNullAsDefault: true, // ONLY needed for SQLite
// };

// db represents a connection to the database
const db = knex(knexConfig.development);

const router = express.Router();

router.get("/", (req, res) => {
    //    select  *   from  cars
    // db.select('*').from('cars').then().catch();
    db("cars")
        .then(cars => {
            res.status(200).json(cars);
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to retrieve cars" });
        });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    // select * from cars where id = 2
    db("cars")
        // .where({ id: id })
        .where("id", "=", id)
        .first()
        .then(car => {
            res.json(car);
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to retrieve car" });
        });
});

router.post("/", (req, res) => {
    const carsData = req.body;
    db("cars")
        .insert(carsData) // with SQLite, by default it returns an array with the last id
        .then(ids => {
            db("cars")
                .where({ id: ids[0] })
                .then(newCarEntry => {
                    res.status(201).json(newCarEntry);
                });
        })
        .catch(err => {
            console.log("POST error", err);
            res.status(500).json({ message: "Failed to store data" });
        });
});

module.exports = router;