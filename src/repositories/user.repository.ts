import { FilterQuery, SortOrder } from "mongoose";

import { statusCodes } from "../constants/status-codes.constant";
import { OrderEnum } from "../enums/order.enum";
import { UserListOrderEnum } from "../enums/user-list-order.enum";
import { ApiError } from "../errors/api-error";
import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    const {
      page = 1,
      limit = 10,
      search,
      order = OrderEnum.ASC,
      orderBy = UserListOrderEnum.NAME,
    } = query;
    const filterObj: FilterQuery<IUser> = { isDeleted: false };
    const sortObj: { [key: string]: SortOrder } = {};

    // if (search) {   // це якщо пошук по декільком полям
    //   filterObj.$or = [
    //     { name: { $regex: search, $options: "i" } },
    //     { email: { $regex: search, $option: "i" } },
    //   ];
    //}
    if (search) {
      filterObj.name = { $regex: search, $options: "i" }; // $options: "i" це без урахування регістру , шукаю по великим і малим
    }

    if (orderBy) {
      switch (orderBy) {
        case UserListOrderEnum.NAME:
          sortObj.name = order;
          break;
        case UserListOrderEnum.AGE:
          sortObj.age = order;
          break;
        default:
          throw new ApiError("Invalid orderBy", statusCodes.BAD_REQUEST);
      }
    }
    const skip = (page - 1) * limit;
    return await Promise.all([
      User.find(filterObj).sort(sortObj).limit(limit).skip(skip), // для пошуку елементів (відповідно по фільтру filterObj)
      User.countDocuments(filterObj), //кількість знайдених (відповідно по фільтру filterObj)
    ]);
  }
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }
  public async getById(userId: string): Promise<IUser> {
    return await User.findById(userId);
  }
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }
  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
  public async findWithOutActivityAfter(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      {
        $match: { tokens: { $size: 0 } },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
        },
      },
    ]);
  }
}

export const userRepository = new UserRepository();
