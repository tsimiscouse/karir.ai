import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    callback(null, 'uploads/resumes');
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    callback(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (file.mimetype === 'application/pdf') {
    callback(null, true);
  } else {
    callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('resume');

// Middleware for handling multer errors
export const uploadMiddleware = (req: Request, res: any, next: any) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size must be less than 5MB' });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Only PDF files are allowed!' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    next();
  });
};

export default upload;
