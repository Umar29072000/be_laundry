import { env } from './env';

export const sendWhatsAppMessage = async (target: string, message: string) => {
  if (!env.WHATSAPP_ENABLED) {
    console.log('⚠️ WhatsApp notifications are disabled (WHATSAPP_ENABLED !== true).');
    return;
  }

  const token = env.FONNTE_TOKEN;
  if (!token) {
    console.error('❌ Fonnte WhatsApp token is missing in environment variables.');
    return;
  }

  console.log(`📤 Sending WhatsApp to ${target}...`);

  try {
    const url = 'https://api.fonnte.com/send';

    // Normalize target number: remove '+' prefix if present
    const formattedTarget = target.trim().replace(/\+/g, '');
    console.log(`📞 Formatted target: ${formattedTarget}`);

    const bodyParams = new URLSearchParams();
    bodyParams.append('target', formattedTarget);
    bodyParams.append('message', message);
    bodyParams.append('countryCode', '62'); // Default country code if target starts with 0

    console.log(`📨 POST to Fonnte: target=${formattedTarget}, message length=${message.length}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: bodyParams,
    });

    const result = await response.json();
    console.log(`✅ Fonnte response:`, JSON.stringify(result, null, 2));

    if (result.status === true) {
      console.log(`✅ WhatsApp message queued successfully to ${formattedTarget}`);
    } else {
      console.error(`❌ Fonnte error:`, result.reason || 'Unknown error');
    }

    return result;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message via Fonnte:', error);
  }
};
