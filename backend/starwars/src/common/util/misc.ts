import { Request, Response } from 'express';
/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

export interface IReq<T = any> extends Request {
  body: T;
}

export interface IRes extends Response {}
