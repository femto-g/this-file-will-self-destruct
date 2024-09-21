import { Request, Response, NextFunction } from "express";
import { getUploadURL, getDownloadUrl } from "../../service/file";
import { StatusCodes } from "http-status-codes";

export async function uploadUrlMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //validation here?
  const { extension } = req.query as any;
  const { url, key } = await getUploadURL({ extension });
  //console.log();
  return res.status(StatusCodes.OK).json({ url, key });
}

export async function downloadUrlMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  //validation here?
  const { key } = req.query as any;
  const urlResult = await getDownloadUrl({ key });
  if (!urlResult) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }
  const { url } = urlResult;
  //console.log();
  return res.status(StatusCodes.OK).json({ url });
}
