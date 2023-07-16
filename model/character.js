const mongoose = require('mongoose');

const charactersSchema = {
    title: String,
    description: String,
    name: String,
    quality: String,
    year: String,
    rating: Number,
    image: String,
    video: String,
  };
  
const Character = mongoose.model('Character', charactersSchema);

module.exports = Character;
