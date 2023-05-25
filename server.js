require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB } = require('./config/db');
const ShortUrl = require('./models/Url');

// Connecting to DB
connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  const urlCreated = await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect(`/?id=${urlCreated._id}`);
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl === null) return res.sendStatus(404);
  shortUrl.save();

  res.redirect(shortUrl.full);
});

const PORT = process.env.PORT || 4321;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
