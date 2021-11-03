const express = require("express");
const app = express();
const bluebird = require("bluebird");
const axios = require("axios");
const static = express.static(__dirname + "/public");
const flat = require("flat");
const unflatten = flat.unflatten;
const redis = require("redis");
const client = redis.createClient();
const exphbs = require("express-handlebars");
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.get("/show/:id", async (req, res) => {
  let cacheForshowPageExists = await client.getAsync(req.params.id);
  if (cacheForshowPageExists) {
    res.send(cacheForshowPageExists);
  } else {
    const id = req.params.id;
    try {
      name1 = show.data.name;
      if (Object.keys(show).length === 0) {
        res.status(404).render("show/error", {error:"show cannot be found" });
        return
      }
      res.render(
        "show/showDetail",
        { show: show.data },
        async function (err, html) {
          await client.setAsync(
            req.params.id,
            html
          );
          res.render("show/showDetail", { show: show.data });
        }
      );
    } catch (e) {
      res.status(400).render("show/error", { error: "Cannot find show with id" });
    }
  }
});

app.get("/", async (req, res) => {
  let cacheForHomePageExists = await client.getAsync("homePage");
  if (cacheForHomePageExists) {
    res.send(cacheForHomePageExists);
  } else {
    try {
      const shows = await axios.get("http://api.tvmaze.com/shows");
      res.render(
        "show/showsPage",
        { shows: shows.data },
        async function (err, html) {
          await client.setAsync("homePage", html);
          res.render("show/showsPage", { shows: shows.data });
        }
      );
    } catch (e) {
      res.status(404).render("show/error", { error: e });
    }
  }
});

app.post("/search", async (req, res) => {
  var exists = false;
  try {
    if (req.body.search_term.trim() === "") {
      res.render("show/error", { error: "Please enter a non empty string" });
      return;
    }
    await client.exists(req.body.search_term, async function (err, result) {
      result === 0 ? (exists = false) : (exists = true);
      if (exists) {
        await client.zincrby("sortedSet", 1, req.body.search_term);
      }
    });
    let cache = await client.getAsync(req.body.search_term);
    if (cache) {
      res.render("show/search", function (err, html) {
        res.send(cache);
      });
    } else {
      await client.zadd("sortedSet", 1, req.body.search_term);
      const shows = await axios.get(
        "http://api.tvmaze.com/search/shows?q=" + req.body.search_term
      );
      res.render(
        "show/search",
        { shows: shows.data },
        async function (err, html) {
            await client.setAsync(
            req.body.search_term,
            html
          );
          res.render("show/search", { shows: shows.data });
        }
      );
    }
  } catch (e) {
    res.status(400).render("show/error", { error: e });
  }
});
app.get("/popularsearches", async (req, res) => {
  try {
    let popularsearches = await client.zrevrange(
      "sortedSet",0,9,
      function (err,search_terms) {
        res.render("show/popularSearches", { search_terms: search_terms });
      }
    );
  } catch (e) {
    res.status(400).render("show/error", { error: e });
  }
});
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
