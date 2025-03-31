const router = require('express').Router();
const File = require('../models/File');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }

    const userId = req.user.id; 
    const totalFiles = await File.countDocuments({ owner: userId });

    const fileTypeBreakdown = await File.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(userId) } },  
      { $group: { _id: '$fileType', count: { $sum: 1 } } },         
      { $project: { fileType: '$_id', count: 1, _id: 0 } }          
    ]);

    
    if (!fileTypeBreakdown || fileTypeBreakdown.length === 0) {
      return res.status(404).json({ message: 'No file data available for this user' });
    }

    res.json({
      totalFiles,
      fileTypeBreakdown,
    });

  } catch (err) {
    console.error('Error fetching dashboard data:', err.message); // Log the error for easier debugging
    res.status(500).json({ message: 'An error occurred while fetching dashboard data', error: err.message });
  }
});

module.exports = router;
