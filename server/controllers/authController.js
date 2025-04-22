const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d'
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, department } = req.body;
    
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      department
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
  
      const token = signToken(user._id);
  
      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            department: user.department
          }
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };
  