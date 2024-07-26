/* eslint-disable no-undef */
const express = require('express');
const nodemailer = require('nodemailer');
//const bodyParser = require('body-parser');

const app = express();
//app.use(bodyParser.json());


app.get('/hello', async (req, res) => {
  res.json({mes: "Hello apina"})
})

app.post('/api/send-email', async (req, res) => {
  const { email, message } = req.body;

  // Configure the email transport using your email service's SMTP settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jriimala@gmail.com',
      pass: 'JRLA-mail7',
    },
  });

  try {
    await transporter.sendMail({
      from: 'jriimala@gmail.com',
      to: email,
      subject: 'Shared Data',
      text: message,
    });
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
