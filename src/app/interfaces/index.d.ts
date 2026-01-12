import { JwtPayload } from "jsonwebtoken";

// Extend Express Request interface to include decodedToken property
declare global {
  namespace Express {
    interface Request {
      decodedToken: JwtPayload;
    }
  }
}
