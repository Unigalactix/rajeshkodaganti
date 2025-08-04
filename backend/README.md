# Portfolio Email Notification System

This system sends email notifications to kodagantir295@gmail.com whenever someone visits your portfolio website.

## 🚀 Quick Setup

### 1. Install Dependencies

Navigate to the backend folder and install the required packages:

```bash
cd backend
npm install
```

### 2. Gmail Setup

1. Go to your Google Account settings: https://myaccount.google.com/
2. Enable 2-Factor Authentication if not already enabled
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your details:
   ```env
   GMAIL_USER=your_gmail_address@gmail.com
   GMAIL_APP_PASSWORD=your_16_character_app_password
   NOTIFICATION_EMAIL=kodagantir295@gmail.com
   PORT=3000
   NODE_ENV=production
   ```

### 4. Start the Backend Service

```bash
npm start
```

The service will run on http://localhost:3000

### 5. Update Frontend Configuration

In `js/visit-notifier.js`, update the API URL:

```javascript
this.apiUrl = 'http://your-backend-domain.com/api'; // Replace with your deployed backend URL
```

## 📧 What Gets Tracked

The system automatically tracks:

- **Page Visits**: When someone first visits your portfolio
- **Section Views**: Which sections users navigate to
- **Extended Visits**: Visits longer than 5 minutes
- **Special Events**: Resume views, contact clicks, social media clicks, project views
- **User Information**: IP address, device info, referrer, timestamp

## 🔒 Privacy & Rate Limiting

- **Rate Limited**: Only one email per IP address every 5 minutes
- **Privacy Friendly**: No personal data is stored permanently
- **Clean Logs**: Old visit logs are automatically cleaned up

## 🛠️ Testing

1. **Test the backend service**:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Send a test email**:
   ```bash
   curl -X POST http://localhost:3000/api/test-email
   ```

3. **Test with your website**: Add `?notify=true` to your URL during development

## 📱 Email Format

You'll receive beautifully formatted HTML emails with:
- 🌐 Page and section visited
- 🕒 Timestamp
- 🌍 Location info
- 📡 IP address
- 🖥️ Device information
- 🔗 Referrer information

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Push your backend folder to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Option 2: Heroku
1. Create a Heroku app
2. Add environment variables
3. Deploy using Git

### Option 3: Railway
1. Connect your GitHub repo
2. Add environment variables
3. Deploy

### Option 4: Local Server
Keep the service running on your local machine (requires port forwarding)

## 🔧 Customization

### Change Email Recipient
Edit the `NOTIFICATION_EMAIL` in your `.env` file.

### Modify Email Template
Edit the HTML template in `server.js` around line 85.

### Adjust Rate Limiting
Change `RATE_LIMIT_MINUTES` in `server.js` (line 22).

### Add More Tracking Events
Add new event tracking in `js/visit-notifier.js`.

## 📊 Monitoring

- Check logs: `npm run dev` (shows all notifications)
- Health check: Visit `/api/health`
- Test endpoint: POST to `/api/test-email` (development only)

## 🐛 Troubleshooting

### No emails received:
1. Check your Gmail App Password
2. Verify the GMAIL_USER email address
3. Check spam folder
4. Test with `/api/test-email`

### Backend not starting:
1. Check if port 3000 is available
2. Verify all environment variables are set
3. Check the console for error messages

### Frontend not sending requests:
1. Check browser console for errors
2. Verify the API URL in `visit-notifier.js`
3. Ensure CORS is properly configured

## 📞 Support

If you need help with setup, check the console logs for error messages. The system is designed to fail silently on the frontend to ensure your portfolio always works, even if notifications fail.

---

## 🎯 Next Steps

1. Set up your Gmail App Password
2. Configure your `.env` file
3. Start the backend service
4. Update the frontend API URL
5. Deploy your backend to a hosting service
6. Test the complete system

Your portfolio will now send you email notifications whenever someone visits! 📧✨
