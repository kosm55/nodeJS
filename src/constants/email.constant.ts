import { EmailActionEnum } from "../enums/email.action.enum";

export const emailTemplates = {
  [EmailActionEnum.WELCOME]: {
    templateName: "welcome",
    subject: "important subject",
  },
};
