const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');
const documentsService = require('../services/documents.service');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    documentsService.ensureStorageDirectory();
    cb(null, documentsService.storageDirectory);
  },
  filename: (req, file, cb) => {
    try {
      cb(null, documentsService.createStoredFilename(file));
    } catch (error) {
      cb(error);
    }
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: documentsService.maxFileSizeInBytes,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    try {
      documentsService.validateUploadFile({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: 1,
      });
      cb(null, true);
    } catch (error) {
      cb(error);
    }
  },
});

router.post('/upload', upload.single('file'), documentsController.uploadDocument);
router.get('/documents', documentsController.listDocuments);
router.get('/documents/:id/download', documentsController.downloadDocument);

module.exports = router;
