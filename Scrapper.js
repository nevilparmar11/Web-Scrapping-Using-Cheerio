const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const fetchUrls = async () => {
  try {
    const SITE_URL =
      "https://www.gujaratbajarbhav.com/p/north-gujarat-marketing-yard-bhav.html";
    const response = await axios.get(SITE_URL);

    const html = response.data;
    const $ = cheerio.load(html);
    const urls = [];

    $(".modal-content > iframe").each((_idx, el) => {
      const url = $(el).attr("src");
      urls.push(url);
    });

    return urls;
  } catch (error) {
    throw error;
  }
};

const fetchTable = async (DATASHEET_URL) => {
  try {
    const response = await axios.get(DATASHEET_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    var scrapedData = [];

    $(".ritz > table > tbody > tr > td").each((_idx, el) => {
      let row = $(el);
      if (row.text() != "") {
        scrapedData.push(row.text());
      }
    });

    return scrapedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const savePriceListToFile = async (priceList) => {
  fs.writeFile("PriceList.json", JSON.stringify(priceList), function (err) {
    if (err) throw err;
    console.log("complete");
  });
};

const printTables = async () => {
  const urls = await fetchUrls();
  let priceList = [];

  await Promise.all(
    urls.map(async (url) => {
      url = url.replace(/&/g, "&amp;");
      const table = await fetchTable(url);
      priceList.push(table);
    })
  );

  await savePriceListToFile(priceList);
};

printTables();
