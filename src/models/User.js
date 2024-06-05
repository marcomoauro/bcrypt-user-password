import log from '../log.js'
import {query} from '../database.js'
import bcrypt from "bcrypt";
import {APIError401, APIError404} from "../errors.js";

export default class User {
  id
  email

  constructor(properties) {
    Object.keys(this)
      .filter((k) => typeof this[k] !== 'function')
      .map((k) => (this[k] = properties[k]))
  }

  static fromDBRow = (row) => {
    const user = new User({
      id: row.id,
      email: row.email,
    })

    return user
  }

  static isEmailTaken = async (email) => {
    log.info('Model::User::isEmailTaken', {email})

    const params = [email]

    const query_sql = `
        select *
        from users
        where email = ?
    `;

    const [row] = await query(query_sql, params);

    return !!row
  }

  static create = async ({email, password}) => {
    log.info('Model::User::create', {email, password})

    const hashed_password = await bcrypt.hash(password, 12);

    const params = [email, hashed_password]

    const query_sql = `
        insert into users (email, hashed_password)
        values (?, ?)
    `;

    const {insertId} = await query(query_sql, params);

    const user = await User.getById(insertId)

    return user
  }

  static getById = async (id) => {
    log.info('Model::User::getById', {id})

    const params = [id]

    const query_sql = `
        select *
        from users
        where id = ?
    `;

    const [row] = await query(query_sql, params);

    if (!row) {
      throw new APIError404('User not found')
    }

    const user = User.fromDBRow(row)

    return user
  }

  static signIn = async ({email, password}) => {
    log.info('Model::User::signIn', {email, password})

    const params = [email]

    const query_sql = `
        select *
        from users
        where email = ?
    `;

    const [row] = await query(query_sql, params);

    if (!row) {
      throw new APIError401()
    }

    const is_password_valid = await bcrypt.compare(password, row.hashed_password);

    if (!is_password_valid) {
      throw new APIError401()
    }

    const user = User.fromDBRow(row)

    return user
  }
}