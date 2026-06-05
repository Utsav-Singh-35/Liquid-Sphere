import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  googleCallback,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);

// Google OAuth routes (only if configured)
const hasGoogleAuth = process.env.GOOGLE_CLIENT_ID && 
                     process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here';

if (hasGoogleAuth) {
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', {
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
      session: false
    }),
    googleCallback
  );
} else {
  // Return error if Google OAuth is accessed without configuration
  router.get('/google', (req, res) => {
    res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Please use email/password authentication.'
    });
  });
  
  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_not_configured`);
  });
}

// Protected routes
router.use(protect); // All routes below this middleware require authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', updateProfile);
router.put('/password', changePasswordValidation, changePassword);

export default router;
