const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(4000, () => {
    console.log("Server is running on port 4000.");
});


const pool = mysql.createPool({
    connectionLimit: 5,
    host: "remotemysql.com",
    user: "7dh90283k0",
    database: "7dh90283k0",
    password: "tzDgaLk4OI"
});

pool.getConnection(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

app.get("/mail", function(req, res){
    pool.query("SELECT Distinct TradeMarketMail FROM tbl", function(err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
});

app.post("/prod", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const mail = req.body.mail;

    pool.query("SELECT Distinct ProdName FROM tbl Where TradeMarketMail = ?", [mail], function(err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
});

// app.post("/create", urlencodedParser, function (req, res) {
//
//     if(!req.body) return res.sendStatus(400);
//     const name = req.body.name;
//     const age = req.body.age;
//     pool.query("INSERT INTO users (name, age) VALUES (?,?)", [name, age], function(err, data) {
//         if(err) return console.log(err);
//         res.redirect("/");
//     });
// });