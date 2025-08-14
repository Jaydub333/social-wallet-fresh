# 📚 Social Wallet API - How to Use Guide

## 🚀 Quick Start

### Current API Status
Your Social Wallet API is **LIVE** at: `https://social-wallet-fresh.onrender.com`

**Available Endpoints:**
- `GET /` - API information and status
- `GET /health` - Health check and uptime

---

## 🏗️ For Platform Developers

### Integration Overview
Social Wallet API uses **OAuth 2.0** standard for secure user authentication and data access. This is the same flow used by Facebook, Google, and Twitter - so developers already know how to integrate it.

### Basic Integration Flow

#### Step 1: User Clicks "Sign up with Social Wallet"
```html
<a href="https://social-wallet-fresh.onrender.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=profile,media">
  Sign up with Social Wallet
</a>
```

#### Step 2: User Authorizes Your Platform
Users see a consent screen showing exactly what data you're requesting and approve the connection.

#### Step 3: Your Platform Receives Authorization Code
```
https://your-app.com/callback?code=AUTH_CODE_HERE
```

#### Step 4: Exchange Code for Access Token
```javascript
const response = await fetch('https://social-wallet-fresh.onrender.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: 'AUTH_CODE_HERE',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET'
  })
});

const { access_token } = await response.json();
```

#### Step 5: Get User Profile Data
```javascript
const profile = await fetch('https://social-wallet-fresh.onrender.com/api/user/profile', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const userData = await profile.json();
// User is now signed up with complete profile!
```

---

## 📊 API Reference

### Authentication Endpoints

#### `GET /oauth/authorize`
Initiates the OAuth flow for user authorization.

**Parameters:**
- `client_id` (required) - Your platform's client ID
- `redirect_uri` (required) - Where to send user after authorization
- `scope` (required) - Data permissions requested
- `state` (optional) - Security parameter to prevent CSRF

**Scopes Available:**
- `profile` - Basic profile info (name, username, bio)
- `media` - Profile photos and media
- `email` - User's email address
- `social` - Social media links and handles
- `verification` - Trust score and verification status

#### `POST /oauth/token`
Exchanges authorization code for access token.

**Request Body:**
```json
{
  "grant_type": "authorization_code",
  "code": "authorization_code_here",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "scope": "profile media email"
}
```

### User Data Endpoints

#### `GET /api/user/profile`
Get comprehensive user profile data.

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN_HERE
```

**Response:**
```json
{
  "user_id": "usr_123456789",
  "username": "johndoe",
  "display_name": "John Doe",
  "bio": "Software developer and entrepreneur",
  "profile_image": "https://cdn.socialwallet.com/profiles/johndoe.jpg",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": {
    "city": "San Francisco",
    "country": "US"
  },
  "social_links": {
    "instagram": "@johndoe",
    "twitter": "@johndoe_dev",
    "linkedin": "linkedin.com/in/johndoe"
  },
  "verification": {
    "is_verified": true,
    "trust_score": 85,
    "verification_date": "2024-01-15T10:30:00Z"
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### `GET /api/user/media`
Get user's profile photos and media.

**Response:**
```json
{
  "profile_photos": [
    {
      "url": "https://cdn.socialwallet.com/media/johndoe_1.jpg",
      "is_primary": true,
      "uploaded_at": "2024-01-15T10:30:00Z"
    }
  ],
  "cover_photo": "https://cdn.socialwallet.com/covers/johndoe_cover.jpg"
}
```

---

## 🎁 Digital Gifts Integration

### Send a Gift
```javascript
const gift = await fetch('https://social-wallet-fresh.onrender.com/api/gifts/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to_user_id: 'usr_recipient_id',
    gift_type: 'diamond',
    quantity: 1,
    message: 'Thanks for the amazing content! 💎'
  })
});

const result = await gift.json();
// Gift sent! Your platform earns commission automatically.
```

### Gift Catalog
```javascript
const catalog = await fetch('https://social-wallet-fresh.onrender.com/api/gifts/catalog');
const gifts = await catalog.json();

// Response includes all available gifts:
// - Hearts (10 coins = $0.10)
// - Roses (50 coins = $0.50) 
// - Diamonds (500 coins = $5.00)
// - Custom platform-specific gifts
```

---

## 💳 Wallet & Payments

### Check User's Wallet Balance
```javascript
const wallet = await fetch('https://social-wallet-fresh.onrender.com/api/wallet/balance', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const balance = await wallet.json();
// { balance: 1250, currency: 'coins' } // = $12.50 USD
```

### Create Payment Intent (Wallet Top-up)
```javascript
const payment = await fetch('https://social-wallet-fresh.onrender.com/api/payments/intent', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 2000, // $20.00 = 2000 coins
    currency: 'usd'
  })
});

const { client_secret } = await payment.json();
// Use with Stripe Elements on frontend for secure payment
```

---

## 🔧 Platform Setup

### 1. Register Your Platform
Contact Social Wallet API to register your platform and receive:
- **Client ID** - Public identifier for your platform
- **Client Secret** - Private key for server-to-server communication
- **Webhook URL** - For real-time notifications

### 2. Choose Your Subscription Plan

#### **Basic Plan - $299/month**
- 10,000 API requests/month
- 100 requests/minute rate limit
- Access to profile + basic verification data
- 2% transaction fee on gifts
- Email support

#### **Premium Plan - $999/month**
- 50,000 API requests/month  
- 500 requests/minute rate limit
- Full feature access (media, trust scoring, analytics)
- 1.5% transaction fee on gifts
- Priority support + Slack channel

#### **Enterprise Plan - $2,999/month**
- Unlimited API requests
- 1,000 requests/minute rate limit
- White-label options + custom integrations
- 1% transaction fee on gifts
- Dedicated account manager
- Revenue sharing program (earn up to 15% on gifts)

### 3. Test Integration
Use the sandbox environment to test your integration:
```
Sandbox URL: https://social-wallet-fresh.onrender.com/sandbox
Test Client ID: test_client_12345
```

---

## 🛡️ Security & Privacy

### Data Protection
- All API calls use HTTPS encryption
- User data is encrypted at rest
- GDPR compliant with full data export/deletion
- SOC 2 Type II compliant infrastructure

### Rate Limiting
```
HTTP 429 Too Many Requests
{
  "error": "rate_limit_exceeded",
  "limit": 100,
  "remaining": 0,
  "reset_time": 1640995200
}
```

### Error Handling
```javascript
try {
  const response = await fetch('https://social-wallet-fresh.onrender.com/api/user/profile', {
    headers: { 'Authorization': 'Bearer invalid_token' }
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.message);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

---

## 📱 Sample Integration (Complete Example)

### Frontend (React/JavaScript)
```jsx
function SocialWalletLogin() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: 'your_client_id',
      redirect_uri: 'https://your-app.com/callback',
      scope: 'profile media email',
      state: 'random_security_string'
    });
    
    window.location.href = `https://social-wallet-fresh.onrender.com/oauth/authorize?${params}`;
  };

  return (
    <button onClick={handleLogin} className="social-wallet-btn">
      <img src="/social-wallet-logo.png" alt="Social Wallet" />
      Continue with Social Wallet
    </button>
  );
}
```

### Backend (Node.js/Express)
```javascript
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Verify state parameter for security
  if (state !== 'random_security_string') {
    return res.status(400).send('Invalid state parameter');
  }
  
  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://social-wallet-fresh.onrender.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.SOCIAL_WALLET_CLIENT_ID,
        client_secret: process.env.SOCIAL_WALLET_CLIENT_SECRET
      })
    });
    
    const { access_token } = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch('https://social-wallet-fresh.onrender.com/api/user/profile', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    
    const userProfile = await profileResponse.json();
    
    // Create user account in your database
    const user = await createUser({
      socialWalletId: userProfile.user_id,
      username: userProfile.username,
      email: userProfile.email,
      profileImage: userProfile.profile_image,
      verified: userProfile.verification.is_verified
    });
    
    // Log user in to your platform
    req.session.userId = user.id;
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('OAuth Error:', error);
    res.redirect('/login?error=oauth_failed');
  }
});
```

---

## 🎯 Best Practices

### 1. **User Experience**
- Always explain what data you're requesting and why
- Show Social Wallet branding consistently
- Handle errors gracefully with clear messages
- Provide fallback traditional signup option

### 2. **Security**
- Always use HTTPS for all API calls
- Store client_secret securely (never in frontend code)
- Implement proper state parameter validation
- Set reasonable token expiration times

### 3. **Performance**
- Cache user profile data appropriately
- Implement retry logic for failed API calls
- Use webhooks for real-time updates instead of polling
- Monitor your API usage to avoid rate limits

### 4. **Revenue Optimization**
- Promote the gift system to increase transaction volume
- A/B test gift placement and messaging
- Offer gift bundles and promotions
- Track conversion from gifts to engagement

---

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] Integration tested in sandbox environment
- [ ] Error handling implemented
- [ ] User consent flows working properly
- [ ] Analytics tracking set up
- [ ] Terms of service updated
- [ ] Privacy policy includes Social Wallet data usage

### Launch Day
1. **Soft Launch**: Enable for 10% of users first
2. **Monitor**: Watch error rates and user feedback
3. **Optimize**: Fix any issues quickly
4. **Scale**: Gradually increase to 100% of users

### Post-Launch
- Monitor user acquisition metrics
- Track gift transaction volume
- Gather user feedback
- Plan feature enhancements

---

## 📞 Support & Resources

### Developer Support
- **Documentation**: This guide + API reference
- **Basic Plan**: Email support (response within 24 hours)
- **Premium Plan**: Priority email + Slack channel
- **Enterprise Plan**: Dedicated account manager

### Resources
- **Status Page**: https://status.socialwallet.com
- **Developer Community**: Discord server for developers
- **Sample Code**: GitHub repositories with integration examples
- **Postman Collection**: Pre-built API requests for testing

### Contact
- **Technical Issues**: dev-support@socialwallet.com
- **Business Questions**: partnerships@socialwallet.com
- **Billing**: billing@socialwallet.com

---

**Ready to revolutionize your user onboarding? Start integrating Social Wallet API today! 🌟**

*Questions? Need help? We're here to make your integration successful.*