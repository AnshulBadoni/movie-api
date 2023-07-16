const { MongoClient, GridFSBucket } = require('mongodb');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const mongoose = require('mongoose');

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  const db = conn.db;
  gfs = new GridFSBucket(db, { bucketName: 'uploads' });
});

// Create storage engine
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/papi',
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: file.originalname
    };
  }
});

// Create multer middleware with storage
const upload = multer({ storage });

module.exports = { gfs, upload };
