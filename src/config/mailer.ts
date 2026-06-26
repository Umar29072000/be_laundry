import nodemailer from 'nodemailer';
import { env } from './env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT, 10),
  secure: env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendReceiptEmail = async (to: string, orderId: string, total: number, customerName: string) => {
  const html = `
    <h1>Thank you for your order, ${customerName}!</h1>
    <p>Your laundry order with ID <strong>${orderId}</strong> has been received.</p>
    <p>Total amount to pay: <strong>Rp ${total.toLocaleString('id-ID')}</strong>.</p>
    <br/>
    <p>You can track your order using your Order ID.</p>
    <p>Thank you for choosing our service!</p>
  `;

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: `Laundry Order Receipt - ${orderId}`,
      html,
    });
    console.log(`✅ Receipt email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
