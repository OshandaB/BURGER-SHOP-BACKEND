import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { getProducts,getSingleProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();
// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure the upload folder exists
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Use current time as the file name
    }
  });
  const upload = multer({ storage });

router.get('/', getProducts);
router.get('/:id', getSingleProduct);

router.post('/', authMiddleware, upload.single('image'), createProduct); // Handles image upload
router.put('/:id', authMiddleware, upload.single('image'), updateProduct); // Handles image upload for update
router.delete('/:id', authMiddleware, deleteProduct);
export default router;