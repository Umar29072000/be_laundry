import { env } from './env';

export const sendWhatsAppMessage = async (target: string, message: string) => {
  if (!env.WHATSAPP_ENABLED) return;

  const token = env.FONNTE_TOKEN;
  if (!token) {
    console.error('❌ Fonnte token missing');
    return;
  }

  try {
    const formattedTarget = target.trim().replace(/\+/g, '');

    const bodyParams = new URLSearchParams();
    bodyParams.append('target', formattedTarget);
    bodyParams.append('message', message);
    bodyParams.append('countryCode', '62');

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: token },
      body: bodyParams,
    });

    const result = await response.json();

    if (result.status !== true) {
      console.error('❌ Fonnte error:', result.reason || 'Unknown');
    }
  } catch (error) {
    console.error('❌ Fonnte error:', error);
  }
};
