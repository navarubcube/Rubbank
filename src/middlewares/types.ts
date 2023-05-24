// types.ts

import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
  userId?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}