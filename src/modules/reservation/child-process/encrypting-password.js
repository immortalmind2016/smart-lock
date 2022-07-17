const crypto = require("crypto");

const algorithm = "aes-128-ecb";
const encrypt = (text, secretKey) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, null);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    content: encrypted.toString("hex").toUpperCase(),
  };
};
module.exports = function (inp, callback) {
  const [text, secretKey] = inp.split("#");
  callback(null, encrypt(text, secretKey));
};
