require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { urlencoded } = require("body-parser");
const DataBase = require("./database");
const app = express();

app.use(cors());
app.use("/public", express.static(`./public`));
app.use(urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
 res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new", async (req, res) => {
 await DataBase.addUrl(req.body);
 res.send(200);
});

app.get("/:id", async (req, res) => {
 const id = req.params.id;
 let url = await DataBase.getOriginalUrl(id);
 res.redirect(url);
});

module.exports = app;
