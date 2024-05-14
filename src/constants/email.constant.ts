import { EmailTypeEnum } from "../enums/email.action.enum";

export const emailTemplates = {
  [EmailTypeEnum.WELCOME]: {
    templateName: "welcome",
    subject: "Welcome to our platform!",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateName: "resetPassword",
    subject: "Reset Your Password",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateName: "deleteAccount",
    subject: "Account Deletion Confirmation",
  },
  [EmailTypeEnum.LOGOUT]: {
    templateName: "logout",
    subject: "Logout Successful",
  },
};
