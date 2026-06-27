import { env } from './env';

const MAX_RETRIES = 2;

export const sendWhatsAppMessage = async (target: string, message: string) => {
  if (!env.WHATSAPP_ENABLED) return;

  const token = env.FONNTE_TOKEN;
  if (!token) return;

  const formattedTarget = target.trim().replace(/\+/g, '');

  const bodyParams = new URLSearchParams();
  bodyParams.append('target', formattedTarget);
  bodyParams.append('message', message);
  bodyParams.append('countryCode', '62');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { Authorization: token },
        body: bodyParams,
      });

      const result = await response.json();

      if (result.status !== true) {
        console.error('❌ Fonnte error:', result.reason || 'Unknown');
      }
      return result;
    } catch (error: any) {
      if (attempt < MAX_RETRIES) {
        console.log(`⚠️ Fonnte connection error (attempt ${attempt}), retrying...`);
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        console.error('❌ Fonnte gagal setelah 2x percobaan, cek jaringan atau firewall.');
      }
    }
  }
};
