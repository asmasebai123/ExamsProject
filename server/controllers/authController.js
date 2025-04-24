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
        user: { // Modifiez ici pour correspondre à ce que le frontend attend
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            department: user.department
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
};
  // Ajoutez ces méthodes à authController

exports.protect = async (req, res, next) => {
    try {
      // 1) Vérifier si le token existe
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return next(new AppError('Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder.', 401));
      }
  
      // 2) Vérification du token
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  
      // 3) Vérifier si l'utilisateur existe toujours
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(new AppError('L\'utilisateur associé à ce token n\'existe plus.', 401));
      }
  
      // 4) Donner accès à la route protégée
      req.user = currentUser;
      next();
    } catch (err) {
      next(err);
    }
  };
  
  exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403));
      }
      next();
    };
  };
  