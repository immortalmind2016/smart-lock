import cuid from "cuid";
import {
  AccessTokenResponse,
  DeviceInfoResponse,
  TempPasswordRequestBody,
  TempPasswordResponse,
} from "../types";
import { httpClientFactory } from "./httpClientFactory";
import { httpClientHeaders } from "./tuya-client";

export const getAccessToken: () => Promise<AccessTokenResponse> = async () => {
  const method = "GET";
  const signUrl = "/v1.0/token?grant_type=1";
  const headers = await httpClientHeaders({
    method,
    signUrl,
    withToken: false,
  });
  console.log(
    "🚀 ~ file: tuya-services.ts ~ line 18 ~ constgetAccessToken: ~ headers",
    headers
  );

  const { data: login } = await httpClientFactory(signUrl, {
    method,
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

  const { data: login } = await httpClientFactory(signUrl, {
    method,
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  return login.result;
};

export const removeGeneratedTempPasswordMocked: (
  deviceId: string,
  passwordId: string
) => Promise<TempPasswordResponse> = async () => {
  return { id: cuid() };
};
export const removeGeneratedTempPassword: (
  deviceId: string,
  passwordId: string
) => Promise<TempPasswordResponse> = async (
  deviceId: string,
  passwordId: string
) => {
  //FIXME: don't forget to remove this comment

  const method = "DELETE";
  const signUrl = `/v1.0/devices/${deviceId}/door-lock/temp-passwords/${passwordId}`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
  });

  const { data } = await httpClientFactory(signUrl, {
    method,
    headers: headers,
    url: signUrl,
  });
  if (!data || !data.success) {
    throw Error(`fetch failed: ${data.msg}`);
  }
  return data.result;
};

export const generateTempPasswordMocked: (
  deviceId: string,
  body: TempPasswordRequestBody
) => Promise<TempPasswordResponse> = async (
  deviceId: string,
  body: TempPasswordRequestBody | {} = {}
) => {
  return { id: cuid() };
};

export const generateTempPassword: (
  deviceId: string,
  body: TempPasswordRequestBody
) => Promise<TempPasswordResponse> = async (
  deviceId: string,
  body: TempPasswordRequestBody | {} = {}
) => {
  const method = "POST";
  const signUrl = `/v1.0/devices/${deviceId}/door-lock/temp-password`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
    body,
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
  deviceId: string
) => Promise<DeviceInfoResponse> = async (deviceId: string) => {
  const method = "GET";
  const signUrl = `/v1.0/devices/${deviceId}`;
  const headers = await httpClientHeaders({
    method,
    signUrl,
  });

  const { data } = await httpClientFactory(signUrl, {
    method,
    headers,
  });

  if (!data || !data.success) {
    throw Error(`fetch failed: ${data.msg}`);
  }
  return data.result;
};
