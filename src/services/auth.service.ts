import { errorMessages } from "../constants/error-messages.constant";
import { statusCodes } from "../constants/status-codes.constant";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email.action.enum";
import { ApiError } from "../errors/api-error";
import { IForgot, ISetForgot } from "../interfaces/action-token.interface";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IToken, ITokenResponse } from "../interfaces/token.interface";
import { IChangePassword, IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./passowrd.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    // перевіряємо чи інсує так пошта в базі якщо є то помилка :
    await this.isEmailExist(dto.email);
    //хешуємо пароль :
    const hashedPassword = await passwordService.hashPassword(dto.password);
    //записуємо в базу юзера:
    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    // генеруємо пару аксес і рефреш:
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    // записуємо  пару токенів в базу:
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });

    // генеруємо токен верифікації :
    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.VERIFY,
    );
    // записуємо токен верифікації в базу:
    await actionTokenRepository.create({
      tokenType: ActionTokenTypeEnum.VERIFY,
      actionToken,
      _userId: user._id,
    });
    // надсилаемо лист на пошту з посиланням на екшен токен:
    await emailService.sendMail(user.email, EmailTypeEnum.WELCOME, {
      actionToken,
    });
    // await emailService.sendMail(config.SMTP_USER, EmailTypeEnum.WELCOME, {
    //   name: dto.name,
    // }); // це для прикладу,  буде на мій мейл слати щоб я змогла перевірити

    return { user, tokens };
  }
  public async signIn(dto: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: ITokenResponse }> {
    // дістаємо юзера з бази по введеній пошті:
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError(
        errorMessages.WRONG_EMAIL_OR_PASSWORD,
        statusCodes.UNAUTHORIZED,
      );
    }
    // звіряємо чи вірний пароль який ввів юзер і в нашій базі :
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
    // генеруємо пару аксес і рефреш:
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    // записуємо  пару токенів в базу:
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
    // створюємо нову пару аксес рефреш :
    const newPair = tokenService.generatePair({
      userId: jwtPayload.userId,
      role: jwtPayload.role,
    });
    // видалємо стару пару у нашого юзера :
    await tokenRepository.deleteById(oldPair._id);
    // записуємо нову пару нашому юзеру:
    await tokenRepository.create({
      ...newPair,
      _userId: jwtPayload.userId,
    });
    return newPair;
  }
  public async forgotPassword(dto: IForgot): Promise<void> {
    //дістаємо юзера з бази чи він у нас є
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) return;
    // створюємо для нього екшен токен:
    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT,
    );
    // записуємо екшен токен у базу :
    await actionTokenRepository.create({
      tokenType: ActionTokenTypeEnum.FORGOT,
      actionToken,
      _userId: user._id,
    });
    // надсилаемо лист на пошту з посиланням на екшен токен:
    await emailService.sendMail(user.email, EmailTypeEnum.RESET_PASSWORD, {
      actionToken,
    });
  }
  public async setForgotPassword(
    dto: ISetForgot,
    jwtPayload: IJWTPayload,
  ): Promise<void> {
    // дістаємо юзера по айді який ми передали по екшен токену:
    const user = await userRepository.getById(jwtPayload.userId);
    // хешуємо новий пароль який ввів користувач
    const hashedPassword = await passwordService.hashPassword(dto.password);
    // записуємо юзеру новий пароль :
    await userRepository.updateById(user._id, { password: hashedPassword });
    // видаляємо з бази наш екшен токен :
    await actionTokenRepository.deleteByParams({
      tokenType: ActionTokenTypeEnum.FORGOT,
    });
    // видаляємо токени щоб розлогінити юзера
    await tokenRepository.deleteByParams({ _userId: user._id });
  }
  public async verify(jwtPayload: IJWTPayload): Promise<IUser> {
    // чекаємо виконання обох Promise.all[] :
    const [user] = await Promise.all([
      // дістаємо юзера по айді який ми передали по екшен токену:
      userRepository.updateById(jwtPayload.userId, {
        isVerified: true,
      }),
      // видаляємо з бази наш екшен токен :
      actionTokenRepository.deleteByParams({
        tokenType: ActionTokenTypeEnum.VERIFY,
      }),
    ]);
    return user;
  }
  public async changePassword(
    jwtPayload: IJWTPayload,
    dto: IChangePassword,
  ): Promise<void> {
    //знайшли юзера потрібного
    const user = await userRepository.getById(jwtPayload.userId);
    // перевірили чи його старий пароль співпадає з тим що в базі
    const isCompare = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError(
        errorMessages.WRONG_OLD_PASSWORD,
        statusCodes.UNAUTHORIZED,
      );
    }
    // захешували новий пароль
    const hashedPassword = await passwordService.hashPassword(dto.newPassword);
    // запислаи новий пароль в базу
    await userRepository.updateById(user._id, { password: hashedPassword });
    // видаляємо токени, щоб розлогінити юзера на усіх пристроях
    await tokenRepository.deleteByParams({ _userId: user._id });
  }

  private async isEmailExist(email: string): Promise<void> {
    // дістаємо юзера по айді , якщо є то помилка - юзер вже існує
    const user = await userRepository.getByParams({ email, isDeleted: true });
    if (user) {
      throw new ApiError(
        errorMessages.EMAIL_ALREADY_EXIST,
        statusCodes.CONFLICT,
      );
    }
  }
}

export const authService = new AuthService();
