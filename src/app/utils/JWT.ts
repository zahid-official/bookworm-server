import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// Generate JWT token
const generateJWT = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

// Verify JWT token
const verifyJWT = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};

export { generateJWT, verifyJWT };
