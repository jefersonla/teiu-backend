import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();

exports.helloPubSub = functions.pubsub.topic('teiu-telemetry').onPublish(async (message) => {
    const payload = message.json as {temperature: number, humidity: number};

    console.log('Payload: ', JSON.stringify(payload, null, 4));

    try {
        await admin.database()
            .ref('dispositivos')
            .child('device01')
            .child('sensores')
            .update({ temperatura: payload.temperature, umidade: payload.humidity });
        return Promise.resolve(true);
    }
    catch(erro) {
        console.error(new Error('Erro happened: ' + erro));
        return Promise.resolve(true);
    }

});
