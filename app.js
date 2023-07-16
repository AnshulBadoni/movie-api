const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/movie-upload', { useNewUrlParser: true });


//////////////////////login routes started////////////////////////////////////////////
app.use(authRoutes);
/////////////////////login routes ended//////////////////////////////////////////////
/////////////////////other routes started////////////////////////////////////////////
app.use(userRoutes);
/////////////////////other routes ended///////////////////////////////////////////////



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
