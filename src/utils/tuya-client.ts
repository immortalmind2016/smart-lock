import envConfig from "../configs/env-config";
import crypto from "crypto";
import { TempPasswordRequestBody } from "../types";
import axios from "axios";
import { redistAccessToken } from "./redis-setter-getter";

const { TUYA_ACCESS_KEY, TUYA_HOST, TUYA_SECRET_KEY } = envConfig;

const config = {
  /* openapi host */
  host: TUYA_HOST,
  /* fetch from openapi platform */
  accessKey: TUYA_ACCESS_KEY,
  /* fetch from openapi platform */
  secretKey: TUYA_SECRET_KEY,
};

export const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

interface HeadersOptions {
  method: string;
  signUrl: string;
  body?: TempPasswordRequestBody | { [key: string]: string };
  withToken?: boolean;
}
export const httpClientHeaders = async ({
  method,
  signUrl,
  body = {},
  withToken = true,
}: HeadersOptions) => {
  let token;

  if (withToken) {
    const { token: tokenInRedis } = (await redistAccessToken()) || {};
    token = tokenInRedis;
  }

  const contentHash = crypto
    .createHash("sha256")
    .update(!Object.keys(body).length ? "" : JSON.stringify(body))
    .digest("hex");

  const timestamp = Date.now().toString();
  const stringToSign = [method, contentHash, "", signUrl].join("\n");
  const signStr = config.accessKey + (token ?? "") + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: "HMAC-SHA256",
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    ...(token && { access_token: token }),
  };
  return headers;
};

/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str: string, secret: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(str, "utf8")
    .digest("hex")
    .toUpperCase();
}
