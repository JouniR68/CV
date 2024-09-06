// src/PasswordGenerator.js
import React, { useState } from 'react';

// Function to generate a 64-bit password (8 characters)
export const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  // Generate 8 characters long password
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};

// Function to hash the password using SHA-256
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');

  const handleGeneratePassword = async () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    
    const hashed = await hashPassword(newPassword);
    setHashedPassword(hashed);
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <h2>Password Generator</h2>
      <button onClick={handleGeneratePassword} style={{ marginBottom: '10px' }}>
        Generate 64-bit Password
      </button>
      {password && (
        <div>
          <strong>Generated Password: </strong> {password}
        </div>
      )}
      {hashedPassword && (
        <div>
          <strong>Hashed Password (SHA-256): </strong> {hashedPassword}
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
