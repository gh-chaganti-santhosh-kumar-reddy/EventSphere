import CryptoJS from "crypto-js";

const SECRET_KEY = "YourSecretKeyHere!123"; // Must match backend — use .env for production

export const decryptToken = (encryptedToken: string): string => {
  try {
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedToken);
    const encryptedWords = encryptedWordArray.words;
    const ivWords = encryptedWords.slice(0, 4); // 16 bytes = 4 words
    const cipherWords = encryptedWords.slice(4);

    const iv = CryptoJS.lib.WordArray.create(ivWords, 16);
    const cipherText = CryptoJS.lib.WordArray.create(cipherWords);

    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.enc.Base64.stringify(cipherText),
      CryptoJS.enc.Utf8.parse(SECRET_KEY.slice(0, 16)),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};