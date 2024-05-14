import { CronJob } from "cron";

import { EmailTypeEnum } from "../enums/email.action.enum";
import { TimeHelper } from "../heplers/time.helper";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";

const handler = async () => {
  try {
    console.log("[START CRON] : notify old visitors");
    const date = TimeHelper.subtractByParams(5, "day");
    const users = await userRepository.findWithOutActivityAfter(date);
    const result = await Promise.all(
      users.map(async (user) => {
        return await emailService.sendMail(
          user.email,
          EmailTypeEnum.OLD_VISITOR,
          {
            name: user.name,
          },
        );
      }),
    );
    console.log("result: ", result.length);
  } catch (e) {
    console.error("notifyOldVisitor: ", e);
  } finally {
    console.log("[END CRON] : notify old visitors");
  }
};

export const notifyOldVisitor = new CronJob("* * * 4 * *", handler);
