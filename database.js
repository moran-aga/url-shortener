const shortId = require("shortid");
const validUrl = require("valid-url");
const fs = require("fs").promises;
const dir = process.env.NODE_ENV === "test" ? "./test" : "./data";

const ValidUrl = (url) => validurl.isUri(url);

class DataBase {
 static items = [];

 static async readSavedURLs() {
  const URLdata = await fs.readFile(
   `${dir}.json`,
   "utf8",
   function (err, data) {
    if (err) {
     return console.log(err);
    }
    console.log(data);
   }
  );

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

  let pad = function (num) {
   return ("00" + num).slice(-2);
  };
  let date;
  date = new Date();
  date =
   date.getUTCFullYear() +
   "-" +
   pad(date.getUTCMonth() + 1) +
   "-" +
   pad(date.getUTCDate()) +
   " " +
   pad(date.getUTCHours()) +
   ":" +
   pad(date.getUTCMinutes()) +
   ":" +
   pad(date.getUTCSeconds());

  let item = {
   creationDate: date,
   redirectCount: 0,
   originalUrl: body.url,
   id: shortId.generate(),
  };
  this.items.push(item);
  fs.writeFile(
   `${dir}.json`,
   JSON.stringify(this.items, null, 4),
   function (err) {
    console.log("data saved");
   }
  );
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

  // return null;
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
