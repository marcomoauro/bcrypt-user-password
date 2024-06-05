import log from "../log.js";
import {APIError400} from "../errors.js";
import User from "../models/User.js";

export const signUp = async ({email, password}) => {
  log.info('Controller::user::signUp', {email, password})

  if (!email || !password) {
    throw new APIError400('email and password are required');
  }

  const is_email_taken = await User.isEmailTaken(email)
  if (is_email_taken) {
    throw new APIError400('email is already taken');
  }

  const user = await User.create({email, password})

  return user
}

export const signIn = async ({email, password}) => {
  log.info('Controller::user::signIn', {email, password})

  if (!email || !password) {
    throw new APIError400('email and password are required');
  }

  const user = await User.signIn({email, password})

  return user
}