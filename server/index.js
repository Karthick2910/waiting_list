require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { TwitterOuthApiService } = require('./TwitterOuthApiService');
const { Utils } = require('./Utils');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const TWITTER_OAUTH_URL = process.env.TWITTER_OAUTH_URL;
const TOKEN_URL = process.env.TOKEN_URL;
const COINFANTASY_USERNAME = process.env.COINFANTASY_USERNAME;

const sessionStore = new Map();

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('base64url');
}

function generateCodeVerifier() {
  return generateRandomString(32);
}

function generateCodeChallenge(codeVerifier) {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
}

// Initialize host
TwitterOuthApiService.Init('https://api.twitter.com/2');

app.get('/auth/twitter', (req, res) => {
  const state = generateRandomString(16);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  sessionStore.set(state, codeVerifier);

  const scope = 'tweet.read users.read follows.write offline.access';

const authUrl = `${TWITTER_OAUTH_URL}?` +
  `response_type=code&` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(scope)}&` +
  `state=${state}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256&` + 
  `force_login=true`;

  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) return res.status(400).send(`OAuth Error: ${error}`);
  if (!code || !state) return res.status(400).send('Missing code or state');

  const codeVerifier = sessionStore.get(state);
  if (!codeVerifier) return res.status(400).send('Invalid or expired state');

  sessionStore.delete(state);

  try {
    const tokenResult = await TwitterOuthApiService.getToken(code, codeVerifier, REDIRECT_URI);
    if (tokenResult.error || !tokenResult.result?.data?.access_token) {
      throw tokenResult.error || new Error("Token exchange failed");
    }

    const accessToken = tokenResult.result.data.access_token;
    const tokenType = tokenResult.result.data.token_type || 'Bearer';

    const userResult = await TwitterOuthApiService.getUser(accessToken);
    if (userResult.error || !userResult.result?.data?.id) {
      throw userResult.error || new Error("Failed to fetch user info");
    }

    const userId = userResult.result.data.id;
    const username = userResult.result.data.username;

    // Check if user is already following CoinFantasy
    let isAlreadyFollowing = false;
    try {
      const targetUserResponse = await Utils.PerformGetRequest(
        `https://api.twitter.com/2/users/by/username/${COINFANTASY_USERNAME}`,
        undefined,
        TwitterOuthApiService.GetHeaders(accessToken)
      );

      const coinfantasyUserId = targetUserResponse.data?.data?.id;
      if (coinfantasyUserId) {
        // Check if user is following CoinFantasy
        const followingResponse = await Utils.PerformGetRequest(
          `https://api.twitter.com/2/users/${userId}/following/${coinfantasyUserId}`,
          undefined,
          TwitterOuthApiService.GetHeaders(accessToken)
        );
        
        isAlreadyFollowing = followingResponse.data?.data?.following === true;
      }
    } catch (checkError) {
      console.log('Could not check follow status:', checkError.message);
    }

    // Store session data for follow check
    const sessionId = generateRandomString(16);
    sessionStore.set(sessionId, {
      accessToken,
      userId,
      username,
      timestamp: Date.now()
    });

    // HTML response - just confirm login success
    res.send(`
      <html>
        <head>
          <title>Twitter Authentication Complete</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #000;
              color: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 2rem;
              border-radius: 10px;
              background: linear-gradient(145deg, #1f1f1f 0%, #181818 50%, #141414 100%);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            }
            .success {
              color: #D8FF86;
              font-size: 48px;
              margin-bottom: 1rem;
            }
            .message {
              font-size: 18px;
              margin-bottom: 2rem;
              color: #ccc;
            }
            .countdown {
              font-size: 24px;
              color: #D8FF86;
              font-weight: bold;
            }
            .button {
              background: #D8FF86;
              color: #000;
              padding: 12px 24px;
              border: none;
              border-radius: 25px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
              margin: 10px;
            }
            .button:hover {
              background: #c5f070;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✓</div>
            <h1>Twitter Login Successful!</h1>
            <p class="message">
              🎉 Connected as @${username}<br/>
              ${isAlreadyFollowing ? 'You are already following @Coinfantasy_Io!' : 'Please follow @Coinfantasy_Io to continue.'}
            </p>
            <p class="countdown">Redirecting in <span id="countdown">3</span> seconds...</p>
            <div>
              <a href="https://x.com/Coinfantasy_Io" class="button">Go to @Coinfantasy_Io</a>
              <a href="#" onclick="window.close()" class="button">Close Window</a>
            </div>
          </div>
          <script>
            let count = 3;
            const countdownEl = document.getElementById('countdown');
            const timer = setInterval(() => {
              count--;
              countdownEl.textContent = count;
              if (count <= 0) {
                clearInterval(timer);
                try {
                  if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                      type: 'TWITTER_LOGIN_COMPLETE',
                      username: '${username}',
                      userId: '${userId}',
                      sessionId: '${sessionId}',
                      isAlreadyFollowing: ${isAlreadyFollowing},
                      timestamp: Date.now()
                    }, '*');
                    setTimeout(() => window.close(), 500);
                  } else {
                    window.location.href = 'https://x.com/Coinfantasy_Io';
                  }
                } catch (e) {
                  window.location.href = 'https://x.com/Coinfantasy_Io';
                }
              }
            }, 1000);
          </script>
        </body>
      </html>
    `);

  } catch (err) {
    console.error('OAuth Error:', err.response?.data || err.message);
    const status = err.response?.status;
    if (status === 401) {
      res.status(401).send('Authentication failed - check your credentials');
    } else if (status === 400) {
      res.status(400).send(`Bad request: ${err.response.data.error_description || 'Invalid parameters'}`);
    } else {
      res.status(500).send('Twitter OAuth failed');
    }
  }
});

// New endpoint to check follow status
app.get('/check-follow-status/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  const sessionData = sessionStore.get(sessionId);
  if (!sessionData) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  
  const { accessToken, userId } = sessionData;
  
  try {
    const targetUserResponse = await Utils.PerformGetRequest(
      `https://api.twitter.com/2/users/by/username/${COINFANTASY_USERNAME}`,
      undefined,
      TwitterOuthApiService.GetHeaders(accessToken)
    );

    const coinfantasyUserId = targetUserResponse.data?.data?.id;
    if (!coinfantasyUserId) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // Check if user is following CoinFantasy
    const followingResponse = await Utils.PerformGetRequest(
      `https://api.twitter.com/2/users/${userId}/following/${coinfantasyUserId}`,
      undefined,
      TwitterOuthApiService.GetHeaders(accessToken)
    );
    
    const isFollowing = followingResponse.data?.data?.following === true;
    
    res.json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});

app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating image for prompt:', prompt);

    const response = await fetch('http://3.110.191.145:5000/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error || 'Failed to generate image'
      });
    }

    res.json(data);

  } catch (error) {
    console.error('Error calling AI image generation API:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      details: error.message
    });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🔗 Start here: http://localhost:${PORT}/auth/twitter`);
});
