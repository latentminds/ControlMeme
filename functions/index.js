const functions = require("firebase-functions");
// const { getAuth } = require("firebase-admin/auth");
const cors = require('cors')({ origin: true });
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require("firebase-admin/auth");

const admin = initializeApp({ credential: applicationDefault() });
console.log('reloaded')


exports.upvoteVariation = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        functions.logger.info("Called upvote", { structuredData: true });

        // check auth
        if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
            response.status(403).send('Unauthorized');
            return;
        }
        let idToken;
        if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
            console.log('Found "Authorization" header');
            // Read the ID Token from the Authorization header.
            idToken = request.headers.authorization.split('Bearer ')[1];
        } else {
            // No cookie
            response.status(403).send('Unauthorized ');
            return;
        }
        console.log("idToken", idToken);
        console.log("before verify")
        // validate token
        getAuth().verifyIdToken(idToken, true).then((decodedIdToken) => {
            console.log('ID Token correctly decoded', decodedIdToken);
            const userId = decodedIdToken.uid;
            const variationId = request.query.variationId;

            // check if user already upvoted
            admin.firestore().collection('Users').doc(userId).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().upvotes.includes(variationId)) {
                        response.send("Already upvoted");
                        return;
                    }
                }
                var variationRef = admin.firestore().collection('Variations').doc(variationId);
                var userRef = admin.firestore().collection('Users').doc(userId);

                var batch = admin.firestore().batch();

                batch.update(variationRef, { upvotes: admin.firestore.FieldValue.increment(1) });
                batch.update(userRef, { upvotes: admin.firestore.FieldValue.arrayUnion(variationId) });

                batch.commit().then(function () {
                    response.send("Upvote done");
                });
                functions.logger.info("Done upvote", { structuredData: true });

            }
            ).catch((error) => {
                console.log("Error getting document:", error);
            }
            );


        }).catch((error) => {
            console.error('Error while verifying Firebase ID token:', error);
            response.status(403).send('Unauthorized');
        });
    });

});
