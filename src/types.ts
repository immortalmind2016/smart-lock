import { Request, Response } from "express";
import { Lock } from "modules/lock/entities/lock.entity";

export interface Context {
  lockData: Lock | null;
}
export interface AccessTokenResponse {
  expire_time: number;
  access_token: string;
  uid: string;
  refresh_token: string;
}

export interface DeviceInfoResponse {
  local_key: string;
  [key: string]: string | Date | number;
}

interface TempPasswordResponseResult {
  id: string;
}
export interface TempPasswordResponse {
  [key: string]: string | Date | number | TempPasswordResponseResult;
}

export interface TempPasswordRequestBody {
  effective_time: Date;
  invalid_time: Date;
  time_zone?: string;
  phone?: string;
  type?: number;
  name: string;
  password: string;
}
