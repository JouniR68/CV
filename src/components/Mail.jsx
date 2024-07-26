import React, { useState } from 'react';
import axios from 'axios';

const ShareViaEmail = () => {
  const [email, setEmail] = useState('jriimala@gmail.com');
  const [message, setMessage] = useState('test');

  const sendEmail = async () => {
    console.log("sending email function")
    try {
      /*const response = await axios.post('/api/send-email', {
        email,
        message,
      });
      console.log('Email sent:', response.data);*/
      const response = await axios.get('/api/hello', {
        headers:{'Content-Type': 'application/json'}
      })

      console.log(response.data

        
      )
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="mail">
      <h2>Share via Email</h2>
      <input
        type="email"
        placeholder="Recipient's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default ShareViaEmail;
