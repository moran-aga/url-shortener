const shortId = require("shortid");
const fs = require("fs").promises;

class DataBase {
 static items = [];

 static async readSavedURLs() {
  const URLdata = await fs.readFile("data.json", "utf8", function (err, data) {
   if (err) {
    return console.log(err);
   }
   console.log(data);
  });

  this.items = JSON.parse(URLdata);
 }

 static async addUrl(body) {
  await this.readSavedURLs();

  for (let item of this.items) {
   if (body.url === item.originalUrl) {
    return item.id;
   }
  }

  let item = {
   creationDate: Date.now(),
   redirectCount: 0,
   originalUrl: body.url,
   id: shortId.generate(),
  };
  this.items.push(item);
  fs.writeFile("data.json", JSON.stringify(this.items), function (err) {
   console.log("data saved");
  });
  return item.id;
 }

 static async getOriginalUrl(id) {
  await this.readSavedURLs();
  for (let item of this.items) {
   if (id === item.id) {
    item.redirectCount += 1;
    fs.writeFile("data.json", JSON.stringify(this.items));
    return item.originalUrl;
   }
  }

  return null;
 }

 static async getUrlData(id) {
  await this.readSavedURLs();
  for (let item of this.items) {
   if (id === item.id) {
    return item;
   }
  }
  return null;
 }
}

module.exports = DataBase;
