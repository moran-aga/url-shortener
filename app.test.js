const app = require("./app");
const request = require("supertest");
const fs = require("fs");
const DataBase = require("./database");

const req = "https://www.google.com";

const exceptedRes = {
 original_URL: "https://www.google.com",
 short_URL: "http://localhost:3000/sNDmPXmFd",
};

describe("get requests", () => {
 it("should redirect to original url by id", async () => {
  const res = await request(app).get("/sNDmPXmFd");
  expect(res.status).toBe(302);
  expect(res.header.location).toEqual("https://www.google.com");
 });
});

describe("post requests", () => {
 it("should response with original url and short url with id", async () => {
  const res = await request(app)
   .post("/api/shorturl/new")
   .type("form")
   .send({ url: "https://www.google.com" });
  expect(res.status).toBe(200);
  console.log(req, res.body);
  expect(res.text).toEqual(exceptedRes);
 });

 it("should return error if the orginial url is invalid", async () => {
  const res = await request(app)
   .post("/api/shorturl/new")
   .send("https://www.google.commmm");
  expect(res.status).toBe(400);
 });
});

// get
// 1) should get original url by id
// 2) should return error if short id dosnt excist
// 4) should return error if the short id is invalid

// post
// 1)should response with original url and short url
// 3) should return error if the orginial url is invalid
