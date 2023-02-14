const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = 8800;
const pinRoute = require('./routes/pins');

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => console.log(err));

app.use("/api/pins", pinRoute)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});