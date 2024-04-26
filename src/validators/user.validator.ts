import joi from "joi";

import { regexConstant } from "../constants/regex.constant";

export class UserValidator {
  private static userName = joi.string().min(2).max(50).trim().required();
  private static phone = joi.string().regex(regexConstant.PHONE).trim();
  private static age = joi.number().min(18).max(100);
  private static password = joi.string().regex(regexConstant.PASSWORD);
  private static email = joi
    .string()
    .regex(regexConstant.EMAIL)
    .lowercase()
    .trim();
  public static create = joi.object({
    name: this.userName.required(),
    email: this.email.required(),
    password: this.password.required(),
    phone: this.phone,
    age: this.age,
  });
  public static update = joi.object({
    name: this.userName,
    phone: this.phone,
    age: this.age,
  });
}
