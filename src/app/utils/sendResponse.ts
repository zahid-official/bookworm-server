import { Response } from "express";

// Meta information interface
interface TMeta {
  page: number;
  limit: number;
  totalPage: number;
  totalDocs: number;
}

// Response payload interface
interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

// Send response function
const sendResponse = <T>(res: Response, payload: IResponse<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
  });
};

export default sendResponse;
