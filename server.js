const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();

const getMailErrorMessage = (error) => {
    if (!error) return 'Unknown mail error.';

    if (error.code === 'EAUTH') {
        return 'SMTP auth failed. Check SMTP_USER and SMTP_PASS.';
    }

    if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
        return 'Could not connect to SMTP server. Check SMTP host/port/firewall.';
    }

    if (error.code === 'EENVELOPE' || /sender address rejected/i.test(error.message || '')) {
        return 'Sender email rejected. MAIL_FROM_EMAIL must be a verified sender address.';
    }

    if (/Missing credentials for "PLAIN"/i.test(error.message || '')) {
        return 'SMTP credentials are missing. Set SMTP_USER and SMTP_PASS in deployment environment variables.';
    }

    return error.message || 'Error sending message.';
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

console.log('SMTP configured:', {
    host: Boolean((process.env.SMTP_HOST || '').trim()),
    user: Boolean((process.env.SMTP_USER || '').trim()),
    pass: Boolean((process.env.SMTP_PASS || '').trim()),
    from: Boolean((process.env.MAIL_FROM_EMAIL || '').trim()),
    to: Boolean((process.env.CONTACT_TO || '').trim())
});

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, message: 'Please fill all fields.' });
    }

    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    const contactTo = (process.env.CONTACT_TO || smtpUser || '').trim();
    const smtpHost = (process.env.SMTP_HOST || '').trim();
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecureValue = (process.env.SMTP_SECURE || '').trim().toLowerCase();
    const smtpSecure = smtpSecureValue
        ? smtpSecureValue === 'true'
        : smtpPort === 465;
    const fromEmail = (process.env.MAIL_FROM_EMAIL || smtpUser).trim();

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !contactTo || !fromEmail) {
        return res.status(500).json({
            ok: false,
            message: 'Mail server is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM_EMAIL and CONTACT_TO.'
        });
    }

    let transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        requireTLS: !smtpSecure,
        connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000),
        greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
        socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 15000),
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    let mailOptions = {
        from: fromEmail,
        replyTo: email,
        to: contactTo,
        subject: `Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.json({ ok: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error('Mail send failed:', {
            code: error.code,
            command: error.command,
            response: error.response,
            message: error.message
        });

        return res.status(500).json({
            ok: false,
            message: getMailErrorMessage(error)
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));