const admin = import('firebase-admin');
const serviceAccount = import('./firma-ed35a-firebase-adminsdk-r4n0y-2ef3b56a8a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'firma-ed35a'
});

const db = admin.database();
const ref = db.ref('Locations');

// Function to delete old data
function deleteOldData() {
  ref.orderByChild('timestamp').endAt(Date.now() - (30 * 24 * 60 * 60 * 1000)) // 30 days ago
    .once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        childSnapshot.ref.remove()
          .then(function() {
            console.log('Old data removed successfully');
          })
          .catch(function(error) {
            console.error('Error removing old data: ', error);
          });
      });
    });
}

// Call the function to delete old data
deleteOldData();
