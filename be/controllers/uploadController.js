const multer = require('multer');
const path = require('path');
const { promises: fs } = require('fs');

class UploadService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.allowedFolders = ['products', 'categories', 'homepage', 'banners'];
    this.allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.init();
  }

  async init() {
    await this.ensureDirectoryExists(this.uploadsDir);
    for (const folder of this.allowedFolders) {
      await this.ensureDirectoryExists(path.join(this.uploadsDir, folder));
    }
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
    }
    if (file.size > this.maxFileSize) {
      throw new Error('File size exceeds 5MB limit');
    }
  }

  validateFolder(folder) {
    if (!this.allowedFolders.includes(folder)) {
      throw new Error(`Invalid folder. Allowed folders: ${this.allowedFolders.join(', ')}`);
    }
  }

  generateFilename(originalname) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalname).toLowerCase();
    return `img-${timestamp}-${random}${ext}`;
  }

  getMulterConfig() {
    return {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        try {
          this.validateFile(file);
          cb(null, true);
        } catch (error) {
          cb(error, false);
        }
      },
      limits: { fileSize: this.maxFileSize }
    };
  }

  async saveFile(buffer, folder, filename) {
    const folderPath = path.join(this.uploadsDir, folder);
    await this.ensureDirectoryExists(folderPath);
    const filePath = path.join(folderPath, filename);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${folder}/${filename}`;
  }

  async getFilesList() {
    const files = [];
    for (const folder of this.allowedFolders) {
      const folderPath = path.join(this.uploadsDir, folder);
      try {
        const folderFiles = await fs.readdir(folderPath);
        for (const file of folderFiles) {
          const filePath = path.join(folderPath, file);
          const stats = await fs.stat(filePath);
          files.push({
            id: `${folder}-${file}`,
            name: file,
            url: `/uploads/${folder}/${file}`,
            folder,
            size: `${Math.round(stats.size / 1024)} KB`,
            uploadDate: stats.mtime.toISOString().split('T')[0]
          });
        }
      } catch (error) {
        // Folder doesn't exist or is empty, continue
      }
    }
    return files;
  }

  async deleteFile(folder, filename) {
    this.validateFolder(folder);
    const filePath = path.join(this.uploadsDir, folder, filename);
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async deleteFileByUrl(url) {
    if (!url || !url.startsWith('/uploads/')) return false;
    const urlParts = url.replace('/uploads/', '').split('/');
    if (urlParts.length < 2) return false;
    const folder = urlParts[0];
    const filename = urlParts.slice(1).join('/');
    return await this.deleteFile(folder, filename);
  }
}

const uploadService = new UploadService();
const upload = multer(uploadService.getMulterConfig());

// Export uploadService for use in other controllers
exports.uploadService = uploadService;

exports.uploadImage = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          error: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }

      const folder = req.body.folder || 'products';
      uploadService.validateFolder(folder);
      
      const filename = uploadService.generateFilename(req.file.originalname);
      const url = await uploadService.saveFile(req.file.buffer, folder, filename);

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url,
          filename,
          folder,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
};

exports.getFiles = async (req, res) => {
  try {
    const files = await uploadService.getFilesList();
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch files' 
    });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  upload.array('images', 10)(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          error: err.message 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No files uploaded' 
        });
      }

      const folder = req.body.folder || 'products';
      uploadService.validateFolder(folder);
      
      const uploadedFiles = [];
      
      for (const file of req.files) {
        const filename = uploadService.generateFilename(file.originalname);
        const url = await uploadService.saveFile(file.buffer, folder, filename);
        
        uploadedFiles.push({
          url,
          filename,
          folder,
          size: file.size,
          mimetype: file.mimetype
        });
      }

      res.json({
        success: true,
        message: `${uploadedFiles.length} images uploaded successfully`,
        data: uploadedFiles
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const [folder, ...filenameParts] = id.split('-');
    const filename = filenameParts.join('-');
    
    const deleted = await uploadService.deleteFile(folder, filename);
    
    if (deleted) {
      res.json({ 
        success: true, 
        message: 'File deleted successfully' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};