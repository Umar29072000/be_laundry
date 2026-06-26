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
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Laundry Receipt</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#333333;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td
style="
background:linear-gradient(135deg,#2563eb,#1d4ed8);
padding:35px;
text-align:center;
">

<div style="font-size:50px;">🧺</div>

<h1
style="
margin:10px 0 0;
color:#ffffff;
font-size:28px;
font-weight:bold;
">
Laundry Online
</h1>

<p
style="
margin-top:10px;
color:#dbeafe;
font-size:15px;
">
Order Successfully Received
</p>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:40px;">

<p style="font-size:17px;margin:0 0 20px;">
Hello <strong>${customerName}</strong>,
</p>

<p style="font-size:15px;line-height:28px;color:#555;">
Thank you for choosing <strong>Laundry Online</strong>.
Your order has been successfully received and is currently being processed.
</p>

<table
width="100%"
style="
margin:35px 0;
border-collapse:collapse;
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:10px;
overflow:hidden;
">

<tr>
<td
style="
padding:15px;
font-weight:bold;
color:#555;
width:45%;
">
Order ID
</td>

<td
style="
padding:15px;
font-family:monospace;
font-size:15px;
">
${orderId}
</td>
</tr>

<tr style="background:#ffffff;">
<td
style="
padding:15px;
font-weight:bold;
color:#555;
">
Total Payment
</td>

<td
style="
padding:15px;
font-size:22px;
font-weight:bold;
color:#2563eb;
">
Rp ${total.toLocaleString("id-ID")}
</td>
</tr>

<tr>
<td
style="
padding:15px;
font-weight:bold;
color:#555;
">
Status
</td>

<td style="padding:15px;">
<span
style="
background:#dcfce7;
color:#166534;
padding:6px 12px;
border-radius:20px;
font-size:13px;
font-weight:bold;
">
Order Received
</span>
</td>
</tr>

</table>

<div
style="
background:#eff6ff;
border-left:4px solid #2563eb;
padding:18px;
border-radius:8px;
margin-bottom:30px;
">

<p
style="
margin:0;
font-size:14px;
line-height:24px;
color:#374151;
">
You can track your laundry order using your Order ID through our application.
We will notify you once your laundry has been processed and is ready for pickup or delivery.
</p>

</div>

<div style="text-align:center;">

<a
href="${env.FRONTEND_URL || 'https://app.liveonline.codes'}/track/${orderId}"
style="
display:inline-block;
padding:14px 30px;
background:#2563eb;
color:#ffffff;
text-decoration:none;
border-radius:8px;
font-weight:bold;
font-size:15px;
">

Track My Order

</a>

</div>

</td>
</tr>

<!-- Footer -->
<tr>

<td
style="
padding:30px;
background:#f8fafc;
text-align:center;
font-size:13px;
color:#6b7280;
">

<p style="margin:0 0 8px;">
Thank you for trusting Laundry Online ❤️
</p>

<p style="margin:0;">
Need help?
<a
href="mailto:support@mail.liveonline.codes"
style="
color:#2563eb;
text-decoration:none;
">
support@mail.liveonline.codes
</a>
</p>

<hr
style="
margin:25px 0;
border:none;
border-top:1px solid #e5e7eb;
">

<p style="margin:0;color:#9ca3af;font-size:12px;">
© ${new Date().getFullYear()} Laundry Online.
All Rights Reserved.
</p>

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
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
