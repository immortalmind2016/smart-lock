import crypto from "crypto";

const algorithm = "aes-128-ecb";
export const encrypt = (text: string, secretKey: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, null);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    content: encrypted.toString("hex").toUpperCase(),
  };
};
