/**
 * SMS Notification Utility — Powered by Semaphore.co (Philippines)
 *
 * In DEVELOPMENT mode (no SEMAPHORE_API_KEY set), this will log messages
 * to the console instead of sending real SMS. Wire up the API key anytime
 * to go live with zero code changes.
 */

const SEMAPHORE_API_URL = 'https://api.semaphore.co/api/v4/messages';

export interface SMSResult {
  sent: boolean;
  mock: boolean;
  error?: string;
}

/**
 * Send an SMS to a Philippine mobile number.
 * @param to - Recipient phone number (e.g., "09171234567" or "639171234567")
 * @param message - The SMS body (max 160 chars for 1 SMS credit)
 */
export async function sendSMS(to: string, message: string): Promise<SMSResult> {
  const apiKey = process.env.SEMAPHORE_API_KEY;
  const senderName = process.env.SEMAPHORE_SENDER_NAME ?? 'GOVPAY';

  // Normalize PH number: strip leading 0, add 63 prefix
  const normalized = to.replace(/^0/, '63').replace(/\D/g, '');

  if (!apiKey) {
    // ── DEVELOPMENT MODE ─────────────────────────────────────────────
    console.log('\n📱 [SMS DEV MODE] ─────────────────────────────────────');
    console.log(`   To:      ${normalized}`);
    console.log(`   From:    ${senderName}`);
    console.log(`   Message: ${message}`);
    console.log('─────────────────────────────────────────────────────\n');
    return { sent: false, mock: true };
  }

  // ── PRODUCTION MODE ───────────────────────────────────────────────
  try {
    const res = await fetch(SEMAPHORE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        apikey: apiKey,
        number: normalized,
        message,
        sendername: senderName,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[SMS] Semaphore error:', err);
      return { sent: false, mock: false, error: err };
    }

    const data = await res.json();
    console.log('[SMS] Sent successfully:', data);
    return { sent: true, mock: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[SMS] Network error:', message);
    return { sent: false, mock: false, error: message };
  }
}

// ── Pre-built Message Templates ────────────────────────────────────────────

export const smsTemplates = {
  disbursementReceived: (amount: number) =>
    `[4Ps NEXUS] Nakatanggap ka ng ${amount.toFixed(2)} XLM mula sa DSWD. Gamitin lamang sa Food, Education, o Health sa mga accredited na tindahan. Salamat!`,

  paymentMade: (amount: number, merchant: string, category: string) =>
    `[4Ps NEXUS] Nagbayad ka ng ${amount.toFixed(2)} XLM sa ${merchant} (${category}). Ang iyong transaksyon ay naitala sa Stellar blockchain.`,

  merchantApproved: (businessName: string) =>
    `[4Ps NEXUS] Maligayang bati! Ang inyong negosyo na "${businessName}" ay na-approve na ng DSWD bilang accredited na merchant. Maaari ka nang tumanggap ng bayad mula sa mga 4Ps beneficiary.`,

  accountFrozen: () =>
    `[4Ps NEXUS] Ang inyong 4Ps account ay pansamantalang na-freeze ng DSWD. Para sa mga katanungan, makipag-ugnayan sa pinakamalapit na DSWD office.`,
};
