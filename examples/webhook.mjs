// Verifying a webhook, offline: signs a sample delivery with a test secret, then checks it the way your endpoint will.
//   node examples/webhook.mjs
import { createHmac } from 'node:crypto';
import { verifyWebhook } from '@opaige/node';

const secret = 'whsec_example_only';
const raw = JSON.stringify({ event: 'lodgement.updated', data: { lodgement_id: 'lg_example', status: 'submitted' } });
const t = Math.floor(Date.now() / 1000);
const signature = `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex')}`;

const event = verifyWebhook(raw, signature, secret); // pass the RAW body, exactly as received
console.log('Verified:', event.event, event.data.status);

try {
  verifyWebhook(raw.replace('submitted', 'changed'), signature, secret);
} catch (e) {
  console.log('A changed body is refused:', e.message);
}
