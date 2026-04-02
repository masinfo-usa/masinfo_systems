import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();

// ── Security headers
app.use(helmet());

// ── CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://masinfosystems.com',
    'https://www.masinfosystems.com',
    'https://masinfo-systems.pages.dev',
  ],
}));

// ── Body parsing
app.use(express.json({ limit: '10kb' }));

// ── Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Contact form — rate limiter (in-memory, 5 req / 15 min per IP)
const contactRateLimit = new Map();

app.post('/api/contact', async (req, res) => {
  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const entry = contactRateLimit.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) {
      return res.status(429).json({ error: 'Too many requests. Please try again in 15 minutes.' });
    }
    entry.count++;
  } else {
    contactRateLimit.set(ip, { count: 1, resetAt: now + windowMs });
  }

  const { name, email, phone, message } = req.body;

  // Validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Input too long.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // HTML escape helper
  const esc = (str) => String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const htmlBody = `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #111111; color: #ffffff; border-radius: 16px;">
      <div style="margin-bottom: 24px;">
        <span style="color: #C4A030; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">
          New Contact Form Submission
        </span>
        <h2 style="color: #ffffff; margin: 8px 0 0; font-size: 22px;">Masinfo Systems</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #aaa; font-size: 13px; width: 100px;">Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-size: 13px;">${esc(name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #aaa; font-size: 13px;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; font-size: 13px;">
            <a href="mailto:${esc(email)}" style="color: #C4A030;">${esc(email)}</a>
          </td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #aaa; font-size: 13px;">Phone</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff; font-size: 13px;">${esc(phone)}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 14px 0 0; color: #aaa; font-size: 13px; vertical-align: top;">Message</td>
          <td style="padding: 14px 0 0; color: #fff; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${esc(message)}</td>
        </tr>
      </table>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #222; color: #555; font-size: 11px;">
        Sent from masinfosystems.com contact form
      </div>
    </div>
  `;

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Masinfo Systems Website', email: process.env.SENDER_EMAIL },
        to: [{ email: process.env.CONTACT_EMAIL }],
        replyTo: { email, name },
        subject: `New Inquiry from ${name} — Masinfo Systems`,
        htmlContent: htmlBody,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Brevo error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// ── 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Masinfo Systems API running on port ${PORT}`);
});