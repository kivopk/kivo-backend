"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_PASS || 'your-app-password',
    },
});
const sendResetPasswordEmail = async (to, resetLink) => {
    const mailOptions = {
        from: process.env.GMAIL_USER || 'your-email@gmail.com',
        to,
        subject: 'Password Reset Request',
        html: `
      <h2>Password Reset</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
    };
    await exports.transporter.sendMail(mailOptions);
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
//# sourceMappingURL=mailer.js.map