const express = require('express');
const multer = require('multer');
const path = require('path');
const documentsController = require('../controllers/documents.controller');
const documentsService = require('../services/documents.service');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsService.storageDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const name = `${require('crypto').randomUUID()}${extension}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), documentsController.uploadDocument);
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;
