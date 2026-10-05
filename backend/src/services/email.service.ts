import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"SkillBridge" <${from}>`,
    to: email,
    subject: 'SkillBridge Email Verification OTP',

    text: `Your SkillBridge verification code is ${code}. This code expires in 10 minutes.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f8fafc;
      ">
        <div style="
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        ">
          <h1 style="color: #4f46e5;">
            SkillBridge
          </h1>

          <h2>Verify your email</h2>

          <p>
            Use the following 6-digit OTP to verify
            your SkillBridge account:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4f46e5;
            padding: 20px 0;
          ">
            ${code}
          </div>

          <p>
            This OTP expires in <strong>10 minutes</strong>.
          </p>

          <p style="color: #64748b;">
            If you did not create a SkillBridge account,
            you can ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}