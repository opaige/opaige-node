// Quickstart: three calls, nothing saved, nothing billed.
//   npm install @opaige/node
//   node examples/quickstart.mjs
// Uses the public test key unless OPAIGE_KEY is set. Fictional passengers only.
import { Opaige, OpaigeError } from '@opaige/node';

const opaige = new Opaige(process.env.OPAIGE_KEY || 'opco_public_test_key');

// 1. What does a Nigerian passport need for a visit to Germany?
const answer = await opaige.checkRequirements({ passport: 'NG', destination: 'DE' });
console.log(`NG -> DE: ${answer.visa.level}. ${answer.visa.reason}`);

// 2. Who on this flight needs a visa, and by when to file?
const check = await opaige.checkPassengers({
  body: {
    flight: { destination: 'GB', depart_date: '2027-03-12' },
    passengers: [{ ref: '14A', passport: 'CN' }, { ref: '14B', passport: 'IE' }],
  },
});
for (const p of check.passengers) console.log(`Seat ${p.ref} (${p.passport}): ${p.status}`);

// 3. Errors carry a status, a code to branch on, and a request id to quote to support.
try {
  await opaige.createTrip({ body: {} }); // the public test key may not plan trips
} catch (e) {
  if (!(e instanceof OpaigeError)) throw e;
  console.log(`Refused as expected: ${e.status} ${e.code} (${e.message}) request ${e.requestId}`);
}
