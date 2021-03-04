const app = require("./app");
// const router = require("./statistic");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log(`Listening on port ${PORT}`);
});
