const express = require('express');
const router = express.Router();
const { register, login, registerBusiness, approveBusiness } = require('../controllers/authController');
const upload = require('../middlewares/upload');

router.post('/register', register);
router.post('/login', login);

router.post('/register-business', upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'letter', maxCount: 1 }
]), registerBusiness);

router.put('/approve-business/:id', approveBusiness);

module.exports = router;
