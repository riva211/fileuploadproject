const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let fileType;
    switch (fileExt) {
      case '.pdf':
        fileType = 'PDF';
        break;
      case '.xlsx':
      case '.xls':
        fileType = 'Excel';
        break;
      case '.docx':
      case '.doc':
        fileType = 'Word';
        break;
      case '.txt':
        fileType = 'TXT';
        break;
      default:
        fileType = 'Other';
    }
    
    const file = new File({
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      path: req.file.path,
      fileType,
      size: req.file.size,
      owner: req.user.id
    });
    
    await file.save();
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        originalFilename: file.originalFilename,
        fileType: file.fileType,
        uploadDate: file.uploadDate
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id })
      .select('originalFilename fileType uploadDate _id')
      .sort({ uploadDate: -1 });
    
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id
    });
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(file.path, file.originalFilename);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
