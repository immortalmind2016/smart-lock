import {
  AccessTokenResponse,
  DeviceInfoResponse,
  TempPasswordRequestBody,
  TempPasswordResponse,
} from "types";
import { httpClient, httpClientHeaders } from "./tuya-client";

export const generateAccessCode = (deviceId: string) => {};
export const getAccessToken: () => Promise<AccessTokenResponse> = async () => {
  const method = "GET";
  const signUrl = "/v1.0/token?grant_type=1";
  const headers = await httpClientHeaders({
    method,
    signUrl,
  });

  const { data: login } = await httpClient.get(signUrl, {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  return login.result;
};
export const refreshAccessToken: (
  refresh_token: string
) => Promise<AccessTokenResponse> = async (refresh_token: string) => {
  const method = "GET";
  const signUrl = `/v1.0/token/${refresh_token}`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
  });

  const { data: login } = await httpClient.get(signUrl, {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  return login.result;
};

export const removeAllGeneratedAccessCodes = () => {};
export const generateTempPassword: (
  deviceId: string,
  body: TempPasswordRequestBody
) => Promise<TempPasswordResponse> = async (
  deviceId: string,
  body: TempPasswordRequestBody
) => {
  const method = "GET";
  const signUrl = `/v1.0/devices/${deviceId}/door-lock/temp-password`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
    body,
  });

  const { data: login } = await httpClient.get(signUrl, {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  return login.result;
};
export const getDeviceInfo: (
  deviceId: string
) => Promise<DeviceInfoResponse> = async (deviceId: string) => {
  const method = "GET";
  const signUrl = `/v1.0/devices/${deviceId}`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
  });

  const { data: login } = await httpClient.get(signUrl, {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  return login.result;
};

// (async () => {
//   console.log(await refreshAccessToken("911eb58d44442f4da43a618d60ffa998"));
// })();
