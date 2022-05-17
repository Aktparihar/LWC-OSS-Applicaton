// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');

// To enable server-side sessions
const session = require('express-session');

// JSForce
const jsforce = require('jsforce');

// OPTIONAL: Logging service. Alternately, can use console.error as well
// In production, we should write to a file, not just console
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

const AuthenticationService = require('./authenticationService');
const IntegrationService = require('./integrationService');

// Load .env configuration file
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;
const {
    SALESFORCE_LOGIN_DOMAIN,
    SALESFORCE_CLIENT_ID,
    SALESFORCE_CLIENT_SECRET,
    SALESFORCE_CALLBACK_URL,
    NODE_SESSION_SECRET_KEY
} = process.env;

if (
    !(
        SALESFORCE_LOGIN_DOMAIN &&
        SALESFORCE_CLIENT_ID &&
        SALESFORCE_CLIENT_SECRET &&
        SALESFORCE_CALLBACK_URL &&
        NODE_SESSION_SECRET_KEY
    )
) {
    logger.error('Cannot start app: missing mandatory configuration.');
    process.exit(-1);
}

// Initialize OAuth2 config
const oauth2 = new jsforce.OAuth2({
    loginUrl: SALESFORCE_LOGIN_DOMAIN,
    clientId: SALESFORCE_CLIENT_ID,
    clientSecret: SALESFORCE_CLIENT_SECRET,
    redirectUri: SALESFORCE_CALLBACK_URL
});

// Initialize Auth Services
const authService = new AuthenticationService(logger, oauth2);
const integrationService = new IntegrationService(logger, authService);

// Enable server-side sessions
app.use(
    session({
        secret: NODE_SESSION_SECRET_KEY,
        cookie: { secure: 'auto' },
        resave: false,
        saveUninitialized: false
    })
);

app.get('/api/v1/endpoint', (req, res) => {
    res.json({ success: true });
});

// Hook up REST endpoints with service calls

// Login to Salesforce
app.get('/oauth2/login', (req, res) => {
    authService.redirectToAuthUrl(res);
});

// Callback function to get Auth Token
app.get('/oauth2/callback', (req, res) => {
    authService.doCallback(req, res);
});

// Get Logged In User Details
app.get('/oauth2/whoami', (req, res) => {
    authService.getLoggedInUserDetails(req, res);
});

// Logout from Salesforce
app.get('/oauth2/logout', (req, res) => {
    authService.doLogout(req, res);
});

// Get Conference-Session Details
app.get('/api/accounts/', (req, res) => {
    integrationService.getAllAccount(req, res);
});

app.get('/api/contacts/', (req, res) => {
    integrationService.getAllContact(req, res);
});

app.get('/about', (req, res) => {
    res.redirect('/api/about');
    console.log('server got hit');
});

app.post('/api/createAccount', (req, res) => {
    var namePost = req.headers['account-name'];
    integrationService.createAccount(req, res, namePost);
});

app.post('/api/createContact', (req, res) => {
    var firstName = req.headers['contact-first'];
    var lastName = req.headers['contact-last'];
    var email = req.headers['contact-email'];
    var phone = req.headers['contact-phone'];
    console.log('contact api hit : ' + lastName);
    integrationService.createContact(
        req,
        res,
        firstName,
        lastName,
        email,
        phone
    );
});

app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
    )
);
