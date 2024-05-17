import { UploadedFile } from "express-fileupload";

import { statusCodes } from "../constants/status-codes.constant";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api-error";
import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";

class UserService {
  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    return await userRepository.getList(query);
  }
  public async getMe(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId);
  }
  public async getById(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId);
  }
  public async updateMe(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.findUserOrThrow(userId);
    return await userRepository.updateById(userId, dto);
  }
  public async deleteMe(userId: string): Promise<void> {
    await this.findUserOrThrow(userId);
    await userRepository.updateById(userId, { isDeleted: true });
  }
  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile,
  ): Promise<IUser> {
    const user = await this.findUserOrThrow(userId);
    const filePath = await s3Service.uploadFile(
      avatar,
      FileItemTypeEnum.USER,
      user._id,
    );
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return await userRepository.updateById(userId, { avatar: filePath });
  }
  public async deleteAvatar(userId: string): Promise<IUser> {
    const user = await this.findUserOrThrow(userId);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return await userRepository.updateById(userId, { avatar: null });
  }
  public async findUserOrThrow(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("user not found", statusCodes.NOT_FOUND);
    }
    return user;
  }
}
export const userService = new UserService();
