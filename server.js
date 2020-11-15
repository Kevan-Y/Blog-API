const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const dataService = require("./modules/data-service.js");
require("dotenv").config({ path: "./config/keys.env" });

const data = dataService(`${process.env.MONGO_CONNECTION_STRING}`);
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/api/posts", (req, res) => {
  data
    .addNewPost(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

// IMPORTANT NOTE: ?tag=#funny wll not function, but ?tag=funny will
app.get("/api/posts", (req, res) => {
  data
    .getAllPosts(
      req.query.page,
      req.query.perPage,
      req.query.category,
      req.query.tag
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.get("/api/categories", (req, res) => {
  data
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.get("/api/tags", (req, res) => {
  data
    .getTags()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.get("/api/posts/:id", (req, res) => {
  data
    .getPostById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.put("/api/posts/:id", (req, res) => {
  data
    .updatePostById(req.body, req.params.id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.delete("/api/posts/:id", (req, res) => {
  data
    .deletePostById(req.params.id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

// Connect to the DB and start the server

data
  .connect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("API listening on: " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
