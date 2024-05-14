import { CronJob } from "cron";

import { TimeHelper } from "../heplers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    console.log("[START CRON] : Remove old tokens");
    await tokenRepository.deleteByParams({
      createdAt: { $lte: TimeHelper.subtractByParams(14, "days") },
    });
  } catch (e) {
    console.error("removeOldTokens: ", e);
  } finally {
    console.log("[END CRON] : Remove old tokens");
  }
};

export const removeOldTokens = new CronJob("0 0 4 * * *", handler);
