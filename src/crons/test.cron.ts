import { CronJob } from "cron";

const handler = async () => {
  console.log("test cron");
};

export const testCron = new CronJob("* * 4 * * *", handler);
