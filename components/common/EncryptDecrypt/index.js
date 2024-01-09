const CryptoJS = require("crypto-js");
import AES from "crypto-js/aes";
import "crypto-js/pad-pkcs7";
import "crypto-js/mode-ecb";

export const EncryptData = (secretKey, textToEncrypt) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey);

  const encrypted = CryptoJS.AES.encrypt(textToEncrypt, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  const encryptedText = encrypted?.toString();
  return encryptedText;
};

export const DecryptData = (secretKey, textToDecrypt) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const ciphertext = CryptoJS.enc.Base64.parse(textToDecrypt);

  const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert the decrypted result to a string
  const decryptedText = decrypted?.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
