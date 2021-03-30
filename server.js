const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () => {
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
    // Array
    const order = req.body.order;

    pool.query("INSERT INTO res (senderMail, senderFIO, startDate, finishDate, actionComment, actionInitiator, actionType, actionLocal, budgetQuantity, budgetSize, discount, budgetFilial, budgetTT, addRemoveCSKU, TradeMarketMail, ProdName, MarkName) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                              [senderMail, senderFIO, startDate, finishDate, actionComment, actionInitiator, actionType, actionLocal, budgetQuantity, budgetSize, discount, budgetFilial, budgetTT, addRemoveCSKU, TradeMarketMail, ProdName, MarkName],
        function(err, data) {
        if(err) return console.log(err);
        res.redirect("/res.html");
    })

        switch (actionType) {
            // CSKUID   (id auto)
            case "CTPR":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.CSKUID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            // CSKUID   (id auto)
            case "LIVE":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.CSKUID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            // ProdID   (id auto)
            case "TRG":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.ProdID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            // CSKUID   (id auto)
            case "LIVE Товарный":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.CSKUID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });            break;
            // ProdID   (id auto)
            case "Разовая для Брендов":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.ProdID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            //ItemID (id auto)
            case "Разовая для GCAS":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.ItemID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            // ProdID   (id auto)
            case "Контрактная для Брендов":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.ProdID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            //ItemID (id auto)
            case "Контрактная для GCAS":
                order.map(i => {
                    pool.query("INSERT INTO ord (ID, OrderID) VALUES (?, (SELECT MAX(OrderID) AS OrderID FROM res))", [i.ItemID], function(err, data) {
                        if(err) return console.log(err);
                    });
                });
                break;
            default:
                res.sendStatus(400);
        }



    pool.query("SELECT MAX(OrderID) AS OrderID FROM res", function(err, data) {
        if(err) return console.log(err);

        sendEmail(
            `<h1>Номер заказа: ${data[0].OrderID}</h1>  <br>` +
            `<b>Почта отправителя</b>: ${senderMail} <br>` +
            `<b>ФИО отправителя</b>: ${senderFIO} <br>` +
            `<b>Дата начала акции</b>: ${startDate} <br>` +
            `<b>Дата конца акции</b>: ${finishDate} <br>` +
            `<b>Комментарий к акции</b>: ${actionComment} <br>` +
            `<b>Инициатор акции</b>: ${actionInitiator} <br>` +
            `<b>Тип акции</b>: ${actionType} <br>` +
            `<b>Тип акции(лок.)</b>: ${actionLocal} <br>` +
            `<b>Измерение бюджета</b>: ${budgetQuantity} <br>` +
            `<b>Бюджет(числ.)</b>: ${budgetSize} <br>` +
            `<b>Скидка(%)</b>: ${discount} <br>` +
            `<b>Кто подтверждает Изменения Бюджета Филиала</b>: ${budgetFilial} <br>` +
            `<b>Кто подтверждает Изменения Бюджета ТТ</b>: ${budgetTT} <br>` +
            `<b>Кто подтверждает Добавление/Удаление CSKU</b>: ${addRemoveCSKU} <br>` +
            `<b>Почта менеджера</b>: ${TradeMarketMail} <br>` +
            `<b>Продукт</b>: ${ProdName} <br>` +
            `<b>Марка</b>: ${MarkName} <br>` +
            `<h2>Заказы:</h2> <br>` +
            `<hr><hr>` +
            `<table style="border-collapse: collapse;" >` +
            `<tr>` +
            `<th style="border: 1px solid #000">ItemID</th>` +
            `<th style="border: 1px solid #000">SortNO</th>` +
            `<th style="border: 1px solid #000">CSKUID</th>` +
            `<th style="border: 1px solid #000">CSKU</th>` +
            `<th style="border: 1px solid #000">ItemName</th>` +
            `<th style="border: 1px solid #000">ProdName</th>` +
            `<th style="border: 1px solid #000">MarkName</th>` +
            `<th style="border: 1px solid #000">ProdID</th>` +
            `<th style="border: 1px solid #000">MarkID</th>` +
            `<th style="border: 1px solid #000">CSKUName</th>` +
            `<th style="border: 1px solid #000">Скидка(%)</th>` +
            `</tr>` +
            `${order.map(i =>
                `<tr>` +
                `<td style="border: 1px solid #000">${i.ItemID}</td>` +
                `<td style="border: 1px solid #000">${i.SortNO}</td>` +
                `<td style="border: 1px solid #000">${i.CSKUID}</td>` +
                `<td style="border: 1px solid #000">${i.CSKU}</td>` +
                `<td style="border: 1px solid #000">${i.ItemName}</td>` +
                `<td style="border: 1px solid #000">${i.ProdName}</td>` +
                `<td style="border: 1px solid #000">${i.MarkName}</td>` +
                `<td style="border: 1px solid #000">${i.ProdID}</td>` +
                `<td style="border: 1px solid #000">${i.MarkID}</td>` +
                `<td style="border: 1px solid #000">${i.CSKUName}</td>` +
                `<th style="border: 1px solid #000">${discount}</th>` +
                `</tr>`
            ).join('')}` +
            `</table>`
        );
    });

});

async function sendEmail(text) {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'horkovenko.k@gmail.com',
            pass: 'Astana1@'
        }
    });

    let info = await transporter.sendMail({
        from: '"Геннадий Горковенко" <gorkovenko.g@asnova.com>',
        to: ["gorkovenko.g@asnova.com"],
        subject: "SAVSERVICE Заявка на заведение промо акции",
        html: text
    });
}