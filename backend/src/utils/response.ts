import { Response } from 'express';

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data?: T;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]> | string[];
  stack?: string;
}

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: ApiMeta,
): Response {
  const body: ApiSuccess<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string[]> | string[],
): Response {
  const body: ApiError = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, message: string, data?: T): Response {
  return sendSuccess(res, message, data, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}
