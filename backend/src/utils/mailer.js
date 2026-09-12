import { Resend } from 'resend';
import 'dotenv/config';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends an authentic pixel-styled order ready notification email via Resend
 * 
 * @param {Object} params
 * @param {string} params.toEmail - Recipient email address
 * @param {string} params.studentName - Name of the student
 * @param {string} params.orderToken - e.g. "CP-1042"
 * @param {string} params.fileName - Name of document
 * @param {number|string} params.totalCost - Total cost in INR
 * @param {string} params.pickupTime - Ready/pickup time
 */
export async function sendOrderReadyEmail({
  toEmail,
  studentName = 'Student',
  orderToken = 'CP-1042',
  fileName = 'document.pdf',
  totalCost = '17',
  pickupTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}) {
  if (!resend) {
    console.warn('[Mailer] RESEND_API_KEY is not configured in environment. Skipping email dispatch.');
    return { success: false, reason: 'missing_api_key' };
  }

  // Fallback recipient if sending in test/onboarding mode without verified custom domain
  const recipient = toEmail || 'rithwikthummana826@gmail.com';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Print Order ${orderToken} is Ready for Pickup!</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #F4F6FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; width: 100%; background-color: #FFFFFF; border: 3px solid #000814; box-shadow: 6px 6px 0px #000814; border-radius: 12px; overflow: hidden;">
          
          <!-- Header: Dark Navy Banner -->
          <tr>
            <td style="background-color: #001D3D; padding: 24px 28px; text-align: center; border-bottom: 3px solid #000814;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 28px; line-height: 1;">🖨️</span>
                    <h1 style="margin: 6px 0 2px; font-size: 22px; font-weight: 900; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase;">
                      CAMPUS<span style="color: #FFD60A;">PRINT</span>
                    </h1>
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: #FFC300; text-transform: uppercase;">
                      ORDER READY FOR PICKUP
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 28px 32px; background-color: #FFFFFF;">
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #000814;">
                Hey ${studentName},
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; color: #334155;">
                Great news! Your print job has been printed, inspected, and is ready for collection at the stationery desk.
              </p>

              <!-- Token Box: Dashed Yellow Ticket -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #FEF08A; border: 2.5px dashed #000814; border-radius: 8px; padding: 20px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 900; letter-spacing: 0.1em; color: #854D0E; text-transform: uppercase; margin-bottom: 4px;">
                      PICKUP TOKEN
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; color: #000814; letter-spacing: 0.08em;">
                      ${orderToken}
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #000814; margin-top: 4px;">
                      Ready since: <strong>${pickupTime}</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Order Details Summary -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F5ED; border: 2px solid #000814; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 12px; font-weight: 800; color: #000814; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1.5px solid #CBD5E1;">
                    ORDER DETAILS
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 10px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #1E293B;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Document:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 800; color: #003566;">${fileName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Total Amount:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 900; color: #000814;">₹${totalCost}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Location:</td>
                        <td align="right" style="padding: 4px 0; font-weight: 700; color: #000814;">Stationery &amp; Xerox Counter (Main Hub)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Instructions Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #E0F2FE; border: 2px solid #003566; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 13px; line-height: 1.4; color: #001D3D; font-weight: 700;">
                    ⚡ <strong>Instructions:</strong> Show this email or your token <strong>${orderToken}</strong> at the stationery desk to collect your printout immediately without waiting in queue.
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #64748B; text-align: center;">
                Need help? Reply directly to this email or visit the campus print station desk.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000814; padding: 16px 24px; text-align: center; border-top: 2px solid #000814;">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #FFD60A; text-transform: uppercase;">
                FAST · SIMPLE · CAMPUS READY
              </div>
              <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">
                CampusPrint Digital Ordering System · Automated Notification
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipient,
      subject: `Your Print Order ${orderToken} is Ready for Pickup! 🖨️`,
      html,
    });

    console.log("Notification email dispatched via Resend:", orderToken, data?.data?.id || data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send order ready email via Resend:", error);
    return { success: false, error };
  }
}
