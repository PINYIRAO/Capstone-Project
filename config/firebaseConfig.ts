import {
  initializeApp,
  cert,
  getApps,
  App,
  AppOptions,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function getFirebaseConfig(): AppOptions {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Missing Firebase configuration. Please check you environment variables."
    );
  }

  const serviceAccount: ServiceAccount = {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY,
  };

  return {
    credential: cert(serviceAccount as ServiceAccount),
  };
}

function initializeFirebaseAdmin(): App {
  const existingApp: App = getApps()[0];
  return existingApp ? existingApp : initializeApp(getFirebaseConfig());
}

const app: App = initializeFirebaseAdmin();

// Get a reference to the Firestore service
// This creates a Firestore instance that you can use to interact with your database
const db: Firestore = getFirestore(app);

export default db;