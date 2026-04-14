import nodemailer from 'nodemailer';
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
export declare const sendResetPasswordEmail: (to: string, resetLink: string) => Promise<void>;
//# sourceMappingURL=mailer.d.ts.map