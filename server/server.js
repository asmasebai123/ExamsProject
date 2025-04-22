require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes)


// Connexion DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  });
  
  const PORT = process.env.PORT || 5000;
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' })
  })
  app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur serveur';
    res.status(statusCode).json({ status: err.status || 'error', message });
  });