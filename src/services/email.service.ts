import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

import { config } from "../configs/config";
import { emailTemplates } from "../constants/email.constant";
import { EmailTypeEnum } from "../enums/email.action.enum";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // хз що це ,  була помилка сертифікату nodemailer, а це її вирішило
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(process.cwd(), "src", "templates", "layouts"),
        partialsDir: path.join(process.cwd(), "src", "templates", "partials"),
      },
      viewPath: path.join(process.cwd(), "src", "templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }

  public async sendMail(
    email: string,
    emailAction: EmailTypeEnum,
    context: Record<string, string | number> = {},
  ) {
    const { subject, templateName } = emailTemplates[emailAction]; // це для динамічності якщо буде декілька шаблонів
    context.frontUrl = config.FRONT_URL;
    const mailOptions = {
      from: "no-reply@example.com",
      to: email,
      subject,
      template: templateName,
      context, //контекст це все що ми хочемо передати , наприклад нейм який відобразиться у листі
    };
    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
