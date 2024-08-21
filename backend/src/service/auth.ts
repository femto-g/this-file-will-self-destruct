import passportLocal from "passport-local";
import passport from "passport";
import {
  UserCreate,
  UserRepositoryFunction,
  createUser,
  findUserByName,
} from "../data/repositories/userRepository";
import crypto from "crypto";
import { Request } from "express";
import { hashPassword } from "../util/helpers";

// helpful links
// http://toon.io/understanding-passportjs-authentication-flow/
// https://github.com/jwalton/passport-api-docs#functions-added-to-the-request
// https://github.com/passport/todos-express-password/blob/master/routes/auth.js

const LocalStrategy = passportLocal.Strategy;

export async function mockVerify(
  username: string,
  password: string,
  done: any,
  find: UserRepositoryFunction,
) {
  try {
    const result = await find(username);
    if (!result) {
      return done(null, false);
    }
    const hashedPassword = await hashPassword(password, result.salt);
    if (!crypto.timingSafeEqual(result.hashed_password, hashedPassword)) {
      return done(null, false);
    }
    return done(null, result);
  } catch (error) {
    return done(error);
  }
}

async function verify(username: string, password: string, done: any) {
  return await mockVerify(username, password, done, findUserByName);
}

passport.use(new LocalStrategy(verify));

passport.serializeUser((user: any, done) => {
  const serializedUser = {
    username: user.username,
    id: user.id,
  };
  done(null, serializedUser);
});

passport.deserializeUser((user: any, done) => {
  //user parameter comes from req.session.passport.user
  done(null, user);
});

export const createLoginMiddleware = () => passport.authenticate("local");

export async function logout(req: Request) {
  await req.logoutAsync?.();
}

export async function mockSignup(req: Request, create: UserRepositoryFunction) {
  const salt = crypto.randomBytes(16);
  const username = req.body.username;
  const hashed_password = await hashPassword(req.body.password, salt);
  const user: UserCreate = {
    username,
    hashed_password,
    salt,
  };
  const result = await create(user);
  if (!result) {
    return false;
  }
  await req.loginAsync?.({ id: result.id, username: result.username });
  return true;
}

export async function signup(req: Request) {
  return mockSignup(req, createUser);
}

export function passportUser(req: Request) {
  if (req.user) {
    return req.user;
  }
  return null;
}
