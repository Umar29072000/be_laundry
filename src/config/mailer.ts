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

export const sendReceiptEmail = async (to: string, orderId: string, total: number, customerName: string, storeName: string) => {
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nota Laundry</title>
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
${storeName}
</h1>

<p
style="
margin-top:10px;
color:#dbeafe;
font-size:15px;
">
Pesanan Berhasil Diterima
</p>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:40px;">

<p style="font-size:17px;margin:0 0 20px;">
Halo <strong>${customerName}</strong>,
</p>

<p style="font-size:15px;line-height:28px;color:#555;">
Terima kasih telah memilih <strong>${storeName}</strong>.
Pesanan Anda telah berhasil diterima dan sedang diproses.
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
ID Pesanan
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
Total Pembayaran
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
Anda dapat melacak status pesanan laundry menggunakan ID Pesanan melalui tautan di bawah.
Kami akan memberi tahu Anda setelah laundry selesai diproses dan siap diambil atau diantar.
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

Lacak Pesanan Saya

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
Terima kasih telah mempercayakan ${storeName} ❤️
</p>

<p style="margin:0;">
Butuh bantuan?
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
© ${new Date().getFullYear()} ${storeName}.
Hak Cipta Dilindungi.
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
      subject: `Nota Pesanan Laundry - ${orderId}`,
      html,
    });
  } catch {
    // silent fail
  }
};
