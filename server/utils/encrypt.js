const crypto = require('crypto');
const path = require('path');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
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

async function getKey() {
  const secret_name = 'VED';

  const client = new SecretsManagerClient({
    credentials: {
      secretAccessKey: process.env.AWS_SECRET_ACCESS,
      accessKeyId: process.env.AWS_ACCESS_KEY,
    },
    region: 'ap-south-1',
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT',
      })
    );
  } catch (error) {
    throw error;
  }

  const secret = JSON.parse(response.SecretString);
  return secret['VED_PRIVATE_KEY'];
}

module.exports = {
  getKey,
  decrypt,
  encrypt,
};
