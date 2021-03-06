const app = require("./app");
const request = require("supertest");
const fs = require("fs");
const DataBase = require("./database");

const req = "https://www.google.com";

const exceptedRes = {
 original_URL: "https://www.google.com",
 short_URL: "http://localhost:3000/ec9CCeqPX",
};

const expectedStatisticRes = {
 creationDate: "2021-03-06 11:03:20",
 redirectCount: 11 + 1,
 originalUrl: "https://www.google.com",
 id: "ec9CCeqPX",
};

describe("get requests", () => {
 it("should redirect to original url by id", async () => {
  const res = await request(app).get("/ec9CCeqPX");
  expect(res.status).toBe(302);
  expect(res.header.location).toEqual("https://www.google.com");
 });

 it("should return error if id not exist", async () => {
  const res = await request(app).get("/sNDmPXmFd123");
  expect(res.status).toBe(404);
  expect(res.text).toBe("url not found");
 });

 it("statistic request should return error if id not exist", async () => {
  const res = await request(app).get("/api/statistic/LRGxzIL9L12312");
  expect(res.status).toBe(404);
  expect(res.text).toBe("id not exist");
 });

 it("statistic request should return with id information", async () => {
  const res = await request(app).get("/api/statistic/ec9CCeqPX");
  expect(res.status).toBe(200);
  //   expect(res.body).toBe(expectedStatisticRes);
 });
});

describe("post requests", () => {
 it("should response with original url and short url with id", async () => {
  const res = await request(app)
   .post("/api/shorturl/new")
   .type("form")
   .send({ url: "https://www.google.com" });
  expect(res.status).toBe(200);
  expect(res.body).toEqual(exceptedRes);
 });

 it("should add new URL item to the database", async () => {
  const res = await request(app)
   .post("/api/shorturl/new")
   .type("form")
   .send({ url: "https://www.youtube.com" });
  expect(res.status).toBe(200);
  expect(DataBase.items.length).toEqual(2);
 });

 it("should return error if the orginial url is invalid", async () => {
  const res = await request(app)
   .post("/api/shorturl/new")
   .send("invalid.url.com");
  expect(res.status).toBe(400);
 });
});

// get
// 1) should get original url by id v
// 2) should return error if short id dosnt exist v
// 3) should return error if the short id is invalid

// post
// 1)should response with original url and short url v
// 3) should return error if the orginial url is invalid
