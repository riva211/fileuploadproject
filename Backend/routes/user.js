const router = require('express').Router();
const User = require('../models/User');

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/username', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phoneNumber },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/address', async (req, res) => {
  try {
    const { street, city, state, zipCode, isPrimary } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (isPrimary) {
      user.addresses.forEach(addr => {
        addr.isPrimary = false;
      });
    }
    
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      isPrimary: isPrimary || false
    });
    
    await user.save();
    
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/address/:id', async (req, res) => {
  try {
    const { street, city, state, zipCode, isPrimary } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const address = user.addresses.id(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    if (isPrimary && !address.isPrimary) {
      user.addresses.forEach(addr => {
        addr.isPrimary = false;
      });
    }
    
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (isPrimary !== undefined) address.isPrimary = isPrimary;
    
    await user.save();
    
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/address/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const address = user.addresses.id(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    address.remove();
    await user.save();
    
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;