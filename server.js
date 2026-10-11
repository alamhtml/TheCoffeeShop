"use strict";

const path = require("node:path");
const fs = require("node:fs");
const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

const pages = [
  ["index.html", ["/", "/index.html"]],
  ["Drinks.html", "/Drinks.html"],
  ["Pastries.html", "/Pastries.html"],
  ["About_Us.html", "/About_Us.html"],
  ["checkout.html", "/checkout.html"],
  ["sytle.css", "/sytle.css"],
  ["cart.js", "/cart.js"]
];

const publicFiles = new Map(
  pages.map(([file]) => [file, fs.readFileSync(path.join(__dirname, file))])
);

for (const [file, route] of pages) {
  app.get(route, (_request, response) => {
    response.type(file).send(publicFiles.get(file));
  });
}

app.use("/image", express.static(path.join(__dirname, "image")));
app.use((_request, response) => response.sendStatus(404));

app.listen(port, () => {
  console.log(`MY Coffee Shop is available at http://localhost:${port}`);
});
