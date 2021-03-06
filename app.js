require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { urlencoded } = require("body-parser");
const DataBase = require("./database");
const app = express();
// const router = express.Router();

app.use(cors());
app.use("/public", express.static(`./public`));
app.use(urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
 res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new", async (req, res) => {
 let id = await DataBase.addUrl(req.body);
 if (id === "invalid url") {
  return res.status(400).send("invalid url");
 } else {
  res.status(200).json({
   original_URL: req.body.url,
   short_URL: `http://localhost:3000/${id}`,
  });
 }
});

app.get("/:id", async (req, res) => {
 const { id } = req.params;
 let url = await DataBase.getOriginalUrl(id);
 if (url === "id not exist") {
  return res.status(404).send("url not found");
 } else {
  return res.redirect(url);
 }
});

app.get("/api/statistic/:id", async (req, res) => {
 const { id } = req.params;
 let data = await DataBase.getUrlData(id);
 res.status(200).json(data);
});

module.exports = app;
// module.exports = router;
