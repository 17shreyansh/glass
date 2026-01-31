const LegalPage = require('../models/LegalPage');

// Get all legal pages (public)
exports.getAllLegalPages = async (req, res) => {
  try {
    const pages = await LegalPage.find()
      .select('slug title updatedAt')
      .sort({ slug: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching legal pages', error: error.message });
  }
};

// Get single legal page by slug (public)
exports.getLegalPageBySlug = async (req, res) => {
  try {
    const page = await LegalPage.findOne({ slug: req.params.slug });
    
    if (!page) {
      return res.status(404).json({ message: 'Legal page not found' });
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching legal page', error: error.message });
  }
};

// Admin: Get all legal pages
exports.adminGetAllPages = async (req, res) => {
  try {
    const pages = await LegalPage.find()
      .populate('lastUpdatedBy', 'name email')
      .sort({ slug: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching legal pages', error: error.message });
  }
};

// Admin: Get single legal page
exports.adminGetPage = async (req, res) => {
  try {
    const page = await LegalPage.findById(req.params.id)
      .populate('lastUpdatedBy', 'name email');
    
    if (!page) {
      return res.status(404).json({ message: 'Legal page not found' });
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching legal page', error: error.message });
  }
};

// Admin: Update legal page
exports.updateLegalPage = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const page = await LegalPage.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Legal page not found' });
    }
    
    page.title = title || page.title;
    page.content = content || page.content;
    page.lastUpdatedBy = req.user._id;
    
    await page.save();
    res.json({ message: 'Legal page updated successfully', page });
  } catch (error) {
    res.status(500).json({ message: 'Error updating legal page', error: error.message });
  }
};
