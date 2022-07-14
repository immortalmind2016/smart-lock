import { Request, Response } from "express";
import { Lock } from "modules/lock/entities/lock.entity";

export interface Context {
  lockData: Lock | null;
}
