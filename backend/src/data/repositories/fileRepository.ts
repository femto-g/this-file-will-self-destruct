import { Prisma } from "@prisma/client";
import { Context, getContext } from "../context";

const context = getContext();

export async function createFile(key: string) {
  try {
    await context.client.files.create({
      data: {
        key: key,
        remaining_downloads: 1,
      },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function readFile(key: string) {
  try {
    const result = await context.client.files.findUnique({
      where: {
        key: key,
      },
    });
    console.log("db file call done");
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function decrementDownloads(key: string) {
  try {
    const file = await readFile(key);
    if (!file) {
      return null;
    }
    await context.client.files.update({
      where: {
        key: key,
      },
      data: {
        remaining_downloads: file?.remaining_downloads - 1,
      },
    });
    return file?.remaining_downloads - 1;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
