import {google} from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

exports.oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
)

// This initializes the OAuth client with your Google credentials: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET. These credentials are used to securely authenticate the user via Google OAuth 2.0. The third parameter 'postmessage' indicates that the authentication will occur through a pop-up window or redirect (depending on your implementation).

