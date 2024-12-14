const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false, saveUninitialized: true,
  cookie: {
    httpOnly: true, 
    secure: false, // Set to true if using HTTPS 
    sameSite: 'lax', // Adjust as needed (strict, lax, none)
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
  domain: 'dev-l2l201vzidyctqyk.us.auth0.com',
  clientID: process.env.OKTA_CLIENT_ID,
  clientSecret: process.env.OKTA_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/okta/callback',
}, (accessToken, refreshToken, extraParams, profile, done) => {
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    isAdmin: profile.email === 'admin@example.com'
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/okta', passport.authenticate('auth0', { scope: ['openid', 'profile', 'email'] }));

app.get('/auth/okta/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/profile');
  });

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/logout', async (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy(async (err) => {
      if (err) { return next(err); }
      res.clearCookie('connect.sid', { path: '/' });
      try {
        await axios.get(`https://dev-l2l201vzidyctqyk.us.auth0.com/v2/logout?federated`).then(() => {
          res.redirect('http://localhost:5173/login');
        });
      } catch (error) {
        console.log('Error logging out:', error);
        next(error);
      }
    });
  });
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
