import * as qs from "qs";
import * as crypto from "crypto";
import { AxiosRequestHeaders, default as axios } from "axios";
import dayjs from "dayjs";

const config = {
  /* openapi host */
  host: "https://openapi.tuyaeu.com",
  /* fetch from openapi platform */
  accessKey: "4s558dx9nuhtvnmcqvfs",
  /* fetch from openapi platform */
  secretKey: "28500b63db704272b1a51d4b6a955d13",
  /* Interface example device_ID */
  deviceId: "8874604198cdac02b162",
  accessToken: "164cfee4007b5a394a2c42f78f27d953",
  local_key: "85beaab4e8c4438f",
};

const algorithm = "aes-128-ecb";

const encrypt = (text: string, secretKey: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, null);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    content: encrypted.toString("hex").toUpperCase(),
  };
};

console.log({ encrypt: encrypt("123456", config.local_key) });
let token = "718927fda46ded2f23dbb6c37fa3c836";
let body = {
  effective_time: 1657105916,
  invalid_time: 1688641916,
  time_zone: "Europe/Istanbul",
  phone: "",
  type: 0,
  name: "Test1456",
  password: "D562B53E2D67216E6241C3F7DDF057CB",
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

async function main() {
  // console.log(await getToken());
  // const passwords = await listPasswords(config.deviceId, body);
  // console.log(
  //   "🚀 ~ file: nodejs_demo.ts ~ line 83 ~ main ~ passwords",
  //   passwords
  // );
  // // console.log(await getTempPasswordDetails(config.deviceId, "1662766"));
  console.log(await tempPassword(config.deviceId, body));
  // await deleteTempPassword(config.deviceId, "1662778");
  // await deleteTempPassword(config.deviceId, "1663765");
  // await deleteTempPassword(config.deviceId, "1662766");

  // console.log("🚀 ~ file: nodejs_demo.ts ~ line 83 ~ main ~ data", data);
  // console.log("fetch success: ", JSON.stringify(data));
}

/**
 * fetch highway login token
 */
async function getToken() {
  const method = "GET";
  const timestamp = Date.now().toString();
  const signUrl = "/v1.0/token?grant_type=1";
  const contentHash = crypto.createHash("sha256").update("").digest("hex");
  const stringToSign = [method, contentHash, "", signUrl].join("\n");
  const signStr = config.accessKey + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: "HMAC-SHA256",
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
  };
  const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  token = login.result.access_token;
  return token;
}

/**
 * fetch highway business data
 */

async function getDeviceInfo(deviceId: string, body: any) {
  const query = {};
  const method = "GET";
  const url = `/v1.0/devices/${deviceId}`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    query,
    {},
    {}
  );
  console.log({ reqHeaders });

  const { data } = await httpClient.request({
    method,
    data: {},

    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  console.log(
    "🚀 ~ file: nodejs_demo.ts ~ line 78 ~ getDeviceInfo ~ data",
    data
  );
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}
async function tempPassword(deviceId: string, body: any) {
  const query = {};
  const method = "POST";
  const url = `/v1.0/devices/${deviceId}/door-lock/temp-password`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    query,
    {},
    body
  );
  console.log({ reqHeaders });

  const response = await httpClient.request({
    method,
    data: body,
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  const { data } = response;
  console.log(
    "🚀 ~ file: nodejs_demo.ts ~ line 78 ~ tempPassword ~ data",
    response
  );
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}

async function deleteTempPassword(deviceId: string, id: string) {
  const query = {};
  const method = "DELETE";
  const url = `/v1.0/devices/${deviceId}/door-lock/temp-passwords/${id}`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    query,
    {},
    {}
  );

  const response = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  const { data } = response;

  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
  return data;
}

async function getTempPasswordDetails(deviceId: string, id: string) {
  const query = {};
  const method = "GET";
  const url = `/v1.0/devices/${deviceId}/door-lock/temp-password/${id}`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    query,
    {},
    {}
  );

  const response = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  const { data } = response;

  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}
async function tempToken(deviceId: string, body: any) {
  const query = {};
  const method = "POST";
  const url = `/v1.0/devices/${deviceId}/door-lock/password-ticket`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    query,
    {},
    {}
  );
  console.log({ reqHeaders });

  const { data } = await httpClient.request({
    method,
    data: {},

    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  console.log(
    "🚀 ~ file: nodejs_demo.ts ~ line 78 ~ getDeviceInfo ~ data",
    data
  );
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}
async function listPasswords(deviceId: string, body: any) {
  const query = {};
  const method = "GET";
  const url = `/v1.0/devices/${deviceId}/door-lock/temp-passwords?valid=true`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    query,
    {},
    {}
  );

  const { data, statusText } = await httpClient.request({
    method,
    data: {},

    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });

  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
  return data.result;
}
/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto
    .createHmac("sha256", secret)
    .update(str, "utf8")
    .digest("hex")
    .toUpperCase();
}

/**
 * request sign, save headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
async function getRequestSign(
  path: string,
  method: string,
  headers: { [k: string]: string } = {},
  query: { [k: string]: any } = {},
  body: { [k: string]: any } = {}
) {
  const t = Date.now().toString();
  const [uri, pathQuery] = path.split("?");
  const queryMerged = Object.assign(query, qs.parse(pathQuery));
  const sortedQuery: { [k: string]: string } = {};
  Object.keys(queryMerged)
    .sort()
    .forEach((i) => (sortedQuery[i] = query[i]));

  const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  const url = querystring ? `${uri}?${querystring}` : uri;
  const contentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");

  const stringToSign = [method, contentHash, "", url].join("\n");
  const signStr = config.accessKey + token + t + stringToSign;
  return {
    t,
    path: url,
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    sign_method: "HMAC-SHA256",
    access_token: token,
  };
}

main().catch((err) => {
  throw Error(`error: ${err}`);
});
