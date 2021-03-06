const shortId = require("shortid");
const validUrl = require("valid-url");
const { pad, date } = require("./utils");
const fs = require("fs").promises;
const dir = process.env.NODE_ENV === "test" ? "./test" : "./data";

class DataBase {
 static items = [];

 static async readSavedURLs() {
  const URLdata = await fs.readFile(`${dir}.json`, "utf8");

  this.items = JSON.parse(URLdata);
 }

 static async addUrl(body) {
  await this.readSavedURLs();

  if (!validUrl.isUri(body.url)) {
   return "invalid url";
  }

  for (let item of this.items) {
   if (body.url === item.originalUrl) {
    return item.id;
   }
  }

  let item = {
   creationDate: date,
   redirectCount: 0,
   originalUrl: body.url,
   id: shortId.generate(),
  };

  this.items.push(item);
  fs.writeFile(`${dir}.json`, JSON.stringify(this.items, null, 4));
  return item.id;
 }

 static async getOriginalUrl(id) {
  await this.readSavedURLs();
  for (let item of this.items) {
   if (id === item.id) {
    item.redirectCount += 1;
    fs.writeFile(`${dir}.json`, JSON.stringify(this.items, null, 4));
    return item.originalUrl;
   }
  }
  return "id not exist";
 }

 static async getUrlData(id) {
  await this.readSavedURLs();
  for (let item of this.items) {
   if (id === item.id) {
    return item;
   }
  }
  return "id not exist";
 }
}

module.exports = DataBase;
