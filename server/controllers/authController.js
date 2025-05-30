    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const User = require('../models/User'); // Sequelize model
    const BusinessRequest = require('../models/BusinessRequest');



    const register = async (req, res) => {
        const { email, password } = req.body;
    
        try {
        // Check if the user already exists in DB
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        // Hash the password and save to DB
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
    
        res.status(201).json({ message: 'User registered successfully' });
    
        } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Something went wrong' });
        }
    };
    

    const login = async (req, res) => {
        const { email, password } = req.body;
    
        console.log('Login attempt for email:', email); // Debug log

        try {
        const user = await User.findOne({ where: { email } });
        console.log('User found:', user ? 'Yes' : 'No'); // Debug log
    
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? 'Yes' : 'No'); // Debug log
    
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1h' }
        );

        console.log('Token generated successfully'); // Debug log
        res.json({ token });
    
        } catch (error) {
        console.error('Login error details:', error); // More detailed error logging
        res.status(500).json({ 
            message: 'Something went wrong',
            error: error.message // Include error message in response
        });
        }
    };
    
    const registerBusiness = async (req, res) => {
        try {
          const {
            full_name, email, phone, password,
            business_name, business_type, city,
            address, business_email, business_phone
          } = req.body;
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Access uploaded file URLs
          const license_url = req.files['license'] ? `/uploads/${req.files['license'][0].filename}` : null;
          const letter_url = req.files['letter'] ? `/uploads/${req.files['letter'][0].filename}` : null;
      
          await BusinessRequest.create({
            full_name,
            email,
            phone,
            password: hashedPassword,
            business_name,
            business_type,
            city,
            address,
            business_email,
            business_phone,
            license_url,
            letter_url
          });
      
          res.status(201).json({ message: 'Registration submitted for approval' });
      
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error submitting registration' });
        }
      };
      
      const approveBusiness = async (req, res) => {
        const { id } = req.params;
      
        try {
          const request = await BusinessRequest.findByPk(id);
      
          if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: 'Request not found or already processed' });
          }
      
          // Add user to users table
          await User.create({ email: request.email, password: request.password });
      
          // Mark request as approved
          request.status = 'approved';
          await request.save();
      
          res.json({ message: 'User approved and added to login system' });
      
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Error approving user' });
        }
      };

      module.exports = {
        register,
        login,
        registerBusiness,
        approveBusiness
      };
      
