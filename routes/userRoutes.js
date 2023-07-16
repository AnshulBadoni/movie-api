const express = require('express');
const router = express.Router();
const { upload } = require('../config/uploadConfig');
const Character = require('../model/character');
const mongoose = require('mongoose');
const path = require('path');

//////////////////////for all users/////////////////////////////////////

router.route('/characters')
  .get((req, res) => {
    const perPage = 10; // Number of results per page
    const page = parseInt(req.query.page) || 1; // Current page number, default is 1
    Character.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .then((foundCharacters) => {
        res.send(foundCharacters);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post(upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]), (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const name = req.body.name;
    const quality = req.body.quality;
    const year = req.body.year;
    const rating = req.body.rating;
    const imageFile = req.files['image'][0];
    const videoFile = req.files['video'][0];

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
    const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${videoFile.filename}`;

    const newCharacter = new Character({
      title: title,
      description: description,
      name: name,
      quality: quality,
      year: year,
      rating: rating,
      image: imageUrl,
      video: videoUrl,
    });

    newCharacter
      .save()
      .then(() => {
        res.sendFile(path.resolve(__dirname, '../public/admin.html'));
      })
      .catch((err) => {
        res.send('Error happened: ' + err);
      });
  })

///////////////////////for single users//////////////////////////////////////////////  

router.route('/characters/:id')
  .get((req, res) => {
    const characterId = req.params.id;
    Character.findById(characterId)
      .then((foundCharacter) => {
        if (foundCharacter) {
          res.send(foundCharacter);
        } else {
          res.send('Character not found');
        }
      })
      .catch((err) => {
        res.send('Error happened: ' + err);
      });
  })
  .put((req, res) => {
    const characterId = req.params.id;
    const updatedCharacter = {
      name: req.body.name,
      description: req.body.description,
    };
    Character.findByIdAndUpdate(characterId, updatedCharacter, { new: true })
      .then((updatedCharacter) => {
        if (updatedCharacter) {
          res.send('Updated successfully');
        } else {
          res.send('Character not found');
        }
      })
      .catch((err) => {
        res.send('Error happened: ' + err);
      });
  })
  .patch((req, res) => {
    const characterId = req.params.id;
    const updatedCharacter = { ...req.body };
    
    if (req.file) {
      // If a new image file is provided, set the "image" field to the file path or URL
      updatedCharacter.image = req.file.path; // Update this based on your file storage configuration
    } else {
      // Remove the "image" field if no new image is being sent
      delete updatedCharacter.image;
    }
    
    Character.findByIdAndUpdate(characterId, { $set: updatedCharacter }, { new: true })
      .then((updatedCharacter) => {
        if (updatedCharacter) {
          res.send('Updated successfully');
        } else {
          res.send('Character not found');
        }
      })
      .catch((err) => {
        res.send('Error happened: ' + err);
      });
  })
  .delete((req, res) => {
    const characterId = req.params.id;
    Character.findByIdAndDelete(characterId)
      .then(() => {
        res.send('Character is deleted');
      })
      .catch((err) => {
        res.send('Error happened: ' + err);
      });
  });

///////////////////////////rating for a single movie//////////////////////////////
router.patch('/characters/:id/rating', async (req, res) => {
  try {
    const characterId = req.params.id;
    const rating = req.body.rating;

    // Find the character by its ID
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check if the rating field exists
    if (character.hasOwnProperty('rating')) {
      character.rating = rating; // Update the existing rating field
    } else {
      character.rating = rating; // Create a new rating field
    }

    await character.save();

    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/////////////////////////// Route for accessing uploaded images///////////////////////////////
router.get('/uploads/:filename', (req, res) => {
  if (!mongoose.connection.db) {
    return res.status(500).json({
      message: 'GridFS stream is not initialized',
    });
  }

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });

  const filename = req.params.filename;
  const downloadStream = bucket.openDownloadStreamByName(filename);

  downloadStream.on('error', (err) => {
    return res.status(500).json({
      message: 'Error occurred while retrieving the image/video',
      error: err,
    });
  });

  downloadStream.pipe(res);
});

//////////////// get all users for admin without page limit//////////////////////
router.route('/allcharacters')
  .get((req, res) => {
    Character.find()
      .then((foundCharacters) => {
        res.send(foundCharacters);
      })
      .catch((err) => {
        res.send(err);
      });
  });

module.exports = router;
