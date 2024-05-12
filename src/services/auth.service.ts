import { config } from "../configs/config";
import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { EmailActionEnum } from "../enums/email.action.enum";
import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IToken, ITokenResponse } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./passowrd.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    await this.isEmailExist(dto.email);
    const hashedPassword = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });

    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    // for nodemailer
    // await emailService.sendMail(dto.email);
    await emailService.sendMail(config.SMTP_USER, EmailActionEnum.WELCOME, {
      name: dto.name,
    }); // це для прикладу,  буде на мій мейл слати щоб я змогла перевірити

    return { user, tokens };
  }
  public async signIn(dto: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: ITokenResponse }> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        statusCodes.UNAUTHORIZED,
      );
    }
    const isCompare = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        statusCodes.UNAUTHORIZED,
      );
    }
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return { user, tokens };
  }
  public async refresh(
    jwtPayload: IJWTPayload,
    oldPair: IToken,
  ): Promise<ITokenResponse> {
    const newPair = tokenService.generatePair({
      userId: jwtPayload.userId,
      role: jwtPayload.role,
    });
    await tokenRepository.deleteById(oldPair._id);
    await tokenRepository.create({
      ...newPair,
      _userId: jwtPayload.userId,
    });
    return newPair;
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError(
        errorMessages.EMAIL_ALREADY_EXIST,
        statusCodes.CONFLICT,
      );
    }
  }
}
export const authService = new AuthService();
