const path = require("path");
const fs = require("fs");
const express = require("express");
const https = require("https");
const PORT = process.env.PORT || 8080;
const app = express();
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.9,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],

  });

  res.send(completion.data.choices[0].text);

});

const defaultRoute = (req, res) => {
  const {
    title = "Postcard - Travel",
    description = "Discover mindful travel through the art of storytelling.",
    imageURL = "https://postcard.travel/assets/images/HomePage/theme_1.png",
  } = req.params;

  fs.readFile(
    path.resolve(__dirname, "..", "build/index.html"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("An error occurred");
      }

      data = data
        .replace(/__TITLE__/g, title)
        .replace(/__DESCRIPTION__/g, description)
        .replace(/__URL__/g, `https://postcard.travel${req.path}`)
        .replace(/__IMAGE__/g, imageURL);

      res.send(data);
    }
  );
};

const serverRenderer = (req, _, next) => {
  const { id } = req.params;

  const options = {
    hostname: "proconnect.postcard.travel",
    path: `/albums/${id}`,
    method: "GET",
    JSON: true,
  };

  const apiReq = https.request(options, (res) => {
    //console.log(`statusCode: ${res.statusCode}`);

    let dataStr = "";
    res.on("data", (data) => (dataStr = `${dataStr}${data}`));

    res.on("end", () => {
      const jsonRes = JSON.parse(dataStr);

      if (jsonRes.length > 0) {
        const { title, description, imageURL } = jsonRes[0];
        req.params = {
          ...req.params,
          title,
          description,
          imageURL,
        };
      }
      next();
    });
  });

  apiReq.on("error", (error) => {
    console.error(error);
    next();
  });

  apiReq.end();
};

router.get("/", defaultRoute);
router.get("/search", defaultRoute);
router.get("/travel-guide", defaultRoute);

router.get("/collections/explore/:id", serverRenderer, defaultRoute);

router.use(express.static(path.resolve(__dirname, "..", "build")));

app.use(router);

app.listen(PORT, () => {
  console.log(`Postcard-web-server running on port ${PORT}`);
});
