// var express = require("express");

import express from "express";
var app = express();
import { getPriceList } from "./Scrapper.js";

app.use("/prices", async (req, res) => {
  const priceList = await getPriceList();
  res.send(priceList);
});

var server = app.listen(8083, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});
