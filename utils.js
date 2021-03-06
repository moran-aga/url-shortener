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

module.exports = { pad, date };
