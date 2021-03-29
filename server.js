const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
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

// Managers mail
app.get("/form", function(req, res){
    pool.query("SELECT DISTINCT TradeMarketMail FROM tbl", function(err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
});

// Prod name
app.post("/prod", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const mail = req.body.mail;

    pool.query("SELECT DISTINCT ProdName FROM tbl Where TradeMarketMail = ?", [mail], function(err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
});

// Mark name
app.post("/mark", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const mail = req.body.mail;
    const prod = req.body.prod;

    pool.query("SELECT DISTINCT MarkName FROM tbl WHERE TradeMarketMail = ? AND ProdName = ?", [mail, prod], function(err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
});

// Build Table
app.post("/tbl", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const mail = req.body.mail;
    const prod = req.body.prod;
    const mark = req.body.mark;

    pool.query("SELECT * FROM tbl WHERE TradeMarketMail = ? AND ProdName = ? AND MarkName = ?", [mail, prod, mark], function(err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
});

// Routed insert and mail (optional)

app.post("/res", urlencodedParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    const senderMail = req.body.senderMail;
    const senderFIO = req.body.senderFIO;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const actionComment = req.body.actionComment;
    const actionInitiator = req.body.actionInitiator;
    const actionType = req.body.actionType;
    const actionLocal = req.body.actionLocal;
    const budgetQuantity = req.body.budgetQuantity;
    const budgetSize = req.body.budgetSize;
    const discount = req.body.discount;
    const budgetFilial = req.body.budgetFilial;
    const budgetTT = req.body.budgetTT;
    const addRemoveCSKU = req.body.addRemoveCSKU;
    const TradeMarketMail = req.body.TradeMarketMail;
    const ProdName = req.body.ProdName;
    const MarkName = req.body.MarkName;
    const order = req.body.order;

    console.log(order);
    console.log(actionType);

    switch (actionType) {
        case "CTPR":
            console.log("CTPR QUERY");
            break;
        case "LIVE":
            console.log("LIVE QUERY");
            break;
        case "TRG":
            console.log("TRG QUERY");
            break;
        case "LIVE Товарный":
            console.log("LIVE Товарный QUERY");
            break;
        case "Разовая для Брендов":
            console.log("Разовая для Брендов QUERY");
            break;
        case "Разовая для GCAS":
            console.log("Разовая для GCAS QUERY");
            break;
        case "Контрактная для Брендов":
            console.log("Контрактная для Брендов QUERY");
            break;
        case "Контрактная для GCAS":
            console.log("Контрактная для GCAS QUERY");
            break;
        default:
            console.log("Nothing found");
            res.sendStatus(400);
    }

    // pool.query("INSERT INTO users (name, age) VALUES (?,?)", [name, age], function(err, data) {
    //     if(err) return console.log(err);
    //     res.redirect("/");
    // });
});