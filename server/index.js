require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
//db connection
connection();
const apiKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  organization: "org-8iJbSpwMgSqMRiPe0nOEQ90f",
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8800;

app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log(message, "message");
  console.log(message);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });
  res.json({
    message: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  console.log(response.data.data);
  res.json({
    models: response.data.data,
  });
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Server is LIVE!",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

// SERVER

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
