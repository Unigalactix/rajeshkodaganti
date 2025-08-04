const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://yourdomain.com', '*'], // Add your domain
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Rate limiting to prevent spam
const visitLog = new Map();
const RATE_LIMIT_MINUTES = 5; // Send email only once every 5 minutes from same IP

// Helper function to get client info
function getClientInfo(req) {
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers.referer || 'Direct';
    
    return { ip, userAgent, referrer };
}

// Helper function to format timestamp
function formatTimestamp() {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Helper function to get location info (basic)
function getBasicLocation(ip) {
    // This is a simple check for common IP patterns
    if (ip.includes('127.0.0.1') || ip.includes('::1')) return 'Local';
    if (ip.includes('192.168.') || ip.includes('10.0.')) return 'Private Network';
    return 'External';
}

// Route to handle portfolio visit notifications
app.post('/api/notify-visit', async (req, res) => {
    try {
        const clientInfo = getClientInfo(req);
        const { page = 'portfolio', section = 'home', timestamp: clientTimestamp } = req.body;
        
        // Rate limiting check
        const currentTime = Date.now();
        const lastNotification = visitLog.get(clientInfo.ip);
        
        if (lastNotification && (currentTime - lastNotification) < (RATE_LIMIT_MINUTES * 60 * 1000)) {
            return res.json({ 
                success: true, 
                message: 'Visit logged (rate limited)',
                rateLimited: true 
            });
        }
        
        // Prepare email content
        const timestamp = formatTimestamp();
        const location = getBasicLocation(clientInfo.ip);
        
        const emailSubject = `🌐 Portfolio Visit Alert - ${timestamp}`;
        
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                .info-item { background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
                .info-label { font-weight: bold; color: #333; margin-bottom: 5px; }
                .info-value { color: #666; word-break: break-all; }
                .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
                .emoji { font-size: 1.2em; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1><span class="emoji">🌐</span> Portfolio Visit Alert</h1>
                    <p>Someone just visited your portfolio!</p>
                </div>
                
                <div class="content">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label"><span class="emoji">📱</span> Page Visited</div>
                            <div class="info-value">${page}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span class="emoji">📍</span> Section</div>
                            <div class="info-value">${section}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span class="emoji">🕒</span> Time</div>
                            <div class="info-value">${timestamp}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span class="emoji">🌍</span> Location</div>
                            <div class="info-value">${location}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span class="emoji">📡</span> IP Address</div>
                            <div class="info-value">${clientInfo.ip}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><span class="emoji">🔗</span> Referrer</div>
                            <div class="info-value">${clientInfo.referrer}</div>
                        </div>
                    </div>
                    
                    <div class="info-item" style="margin-top: 20px;">
                        <div class="info-label"><span class="emoji">🖥️</span> Device Information</div>
                        <div class="info-value">${clientInfo.userAgent}</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This notification was sent from your portfolio notification service.</p>
                    <p>Visit: <a href="https://rajeshkodaganti.com" style="color: #667eea;">rajeshkodaganti.com</a></p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Email options
        const mailOptions = {
            from: `"Portfolio Notifications" <${process.env.GMAIL_USER}>`,
            to: process.env.NOTIFICATION_EMAIL,
            subject: emailSubject,
            html: emailHtml
        };

        // Send email notification
        await transporter.sendMail(mailOptions);

        // Update rate limiting
        visitLog.set(clientInfo.ip, currentTime);
        
        // Clean up old entries (older than 1 hour)
        for (const [ip, time] of visitLog.entries()) {
            if (currentTime - time > 3600000) { // 1 hour
                visitLog.delete(ip);
            }
        }

        console.log(`Email sent for visit from ${clientInfo.ip} at ${timestamp}`);
        
        res.json({ 
            success: true, 
            message: 'Visit notification sent successfully',
            timestamp: timestamp
        });
        
    } catch (error) {
        console.error('Error sending email notification:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send notification',
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: formatTimestamp(),
        service: 'Portfolio Email Notification Service'
    });
});

// Test endpoint (for development)
app.post('/api/test-email', async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ error: 'Test endpoint only available in development' });
    }
    
    try {
        const mailOptions = {
            from: `"Portfolio Notifications" <${process.env.GMAIL_USER}>`,
            to: process.env.NOTIFICATION_EMAIL,
            subject: '🧪 Test Email - Portfolio Notification Service',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f0f0;">
                    <div style="background-color: white; padding: 20px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
                        <h2 style="color: #333;">🧪 Test Email</h2>
                        <p>This is a test email from your Portfolio Notification Service.</p>
                        <p><strong>Time:</strong> ${formatTimestamp()}</p>
                        <p style="color: #666; font-size: 12px;">If you received this email, your notification service is working correctly!</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Test email sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Email Notification Service running on port ${PORT}`);
    console.log(`📧 Email notifications will be sent to: ${process.env.NOTIFICATION_EMAIL}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
