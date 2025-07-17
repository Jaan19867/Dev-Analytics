const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function encrypt(message, publicKey) {
  const buffer = Buffer.from(message, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return encrypted.toString('base64');
}

function decrypt(encryptedMessage, privateKey) {
  try {
    const buffer = Buffer.from(encryptedMessage, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed:', error.message);
    throw error;
  }
}

// Generate RSA key pair once and reuse it
let cachedPrivateKey = null;
let cachedPublicKey = null;

function generateRSAKeys() {
  if (cachedPrivateKey && cachedPublicKey) {
    return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
  }

  console.log('🔑 Generating RSA key pair for encryption...');
  
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  cachedPrivateKey = privateKey;
  cachedPublicKey = publicKey;

  console.log('✅ RSA key pair generated successfully');
  return { privateKey, publicKey };
}

async function getKey() {
  // Always use local RSA keys - no AWS needed
  const { privateKey } = generateRSAKeys();
  return privateKey;
}

module.exports = {
  getKey,
  decrypt,
  encrypt,
  generateRSAKeys, // Export this for getting public key if needed
};
