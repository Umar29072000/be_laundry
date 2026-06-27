import { env } from './env';

export const sendWhatsAppMessage = async (target: string, message: string) => {
  if (!env.WHATSAPP_ENABLED) {
    console.log('⚠️ WhatsApp notifications are disabled.');
    return;
  }

  const token = env.FONNTE_TOKEN;
  if (!token) {
    console.error('❌ Fonnte WhatsApp token is missing in environment variables.');
    return;
  }

  try {
    const url = 'https://api.fonnte.com/send';

    // Normalize target number: remove '+' prefix if present
    const formattedTarget = target.trim().replace(/\+/g, '');

    const bodyParams = new URLSearchParams();
    bodyParams.append('target', formattedTarget);
    bodyParams.append('message', message);
    bodyParams.append('countryCode', '62'); // Default country code if target starts with 0

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: bodyParams,
    });

    const result = await response.json();
    console.log(`✅ WhatsApp message sent to ${formattedTarget}:`, result);
    return result;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message via Fonnte:', error);
  }
};
