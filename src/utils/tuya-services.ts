import {
  AccessTokenResponse,
  DeviceInfoResponse,
  TempPasswordRequestBody,
  TempPasswordResponse,
} from "types";
import { httpClientFactory } from "./httpClientFactory";
import { retryLogic } from "./retry-logic";
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

export const removeGeneratedTempPassword: (
  token: string,
  deviceId: string,
  passwordId: string
) => Promise<TempPasswordResponse> = async (
  token: string,
  deviceId: string,
  passwordId: string
) => {
  const method = "DELETE";
  const signUrl = `/v1.0/devices/${deviceId}/door-lock/temp-passwords/${passwordId}`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
    token,
  });

  const { data } = await httpClient(signUrl, {
    headers: headers,
    url: signUrl,
  });
  if (!data || !data.success) {
    throw Error(`fetch failed: ${data.msg}`);
  }
  return data.result;
};
export const generateTempPassword: (
  token: string,
  deviceId: string,
  body: TempPasswordRequestBody
) => Promise<TempPasswordResponse> = async (
  token: string,
  deviceId: string,
  body: TempPasswordRequestBody | {} = {}
) => {
  const method = "POST";
  const signUrl = `/v1.0/devices/${deviceId}/door-lock/temp-password`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
    body,
    token,
  });

  try {
    const { data, status } = await httpClientFactory(signUrl, {
      method,
      headers: headers,
      data: body,
      url: signUrl,
    });
    if (!data || !data.success) {
      throw Error(`fetch failed: ${data.msg}`);
    }
    return data.result;
  } catch (e: any) {
    throw Error(e?.message);
  }
};
export const getDeviceInfo: (
  token: string,
  deviceId: string
) => Promise<DeviceInfoResponse> = async (token: string, deviceId: string) => {
  const method = "GET";
  const signUrl = `/v1.0/devices/${deviceId}`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
    token,
  });

  const { data } = await httpClient.get(signUrl, {
    headers,
  });

  if (!data || !data.success) {
    throw Error(`fetch failed: ${data.msg}`);
  }
  return data.result;
};
