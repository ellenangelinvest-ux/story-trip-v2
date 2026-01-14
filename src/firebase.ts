// Firebase Configuration and Services
// To set up your own Firebase project:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Add a web app to get your config
// 4. Enable Authentication > Sign-in method > Google & Facebook
// 5. Enable Firestore Database
// 6. Enable Storage
// 7. Replace the config below with your own

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  orderBy,
  onSnapshot,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';

// Firebase configuration - REPLACE WITH YOUR OWN CONFIG
// Get this from Firebase Console > Project Settings > Your apps > Web app
// Note: Trim all values to prevent whitespace/newline issues
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemo-replace-with-your-key").trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com").trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id").trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com").trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789").trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef").trim()
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ============ AUTHENTICATION SERVICES ============

const getAuthErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again. If using an ad blocker, try disabling it for this site.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups for this site.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. Please contact support.';
    default:
      return error.message || 'An error occurred during sign-in.';
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Facebook sign-in error:', error);
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    // If user doesn't exist, create account
    if (error.code === 'auth/user-not-found') {
      return createAccountWithEmail(email, password);
    }
    console.error('Email sign-in error:', error);
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

export const createAccountWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Email signup error:', error);
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

let confirmationResult: ConfirmationResult | null = null;

export const sendPhoneVerification = async (phoneNumber: string, recaptchaContainerId: string) => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: 'invisible'
    });
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Phone verification error:', error);
    return { success: false, error: error.message };
  }
};

export const verifyPhoneCode = async (code: string) => {
  try {
    if (!confirmationResult) {
      return { user: null, error: 'No verification in progress' };
    }
    const result = await confirmationResult.confirm(code);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Phone code verification error:', error);
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============ USER PROFILE SERVICES ============

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  name: string;
  gender: string | null;
  nationality: string | null;
  customNationality?: string;
  interests: string[];
  customInterests?: string[];
  personality: string | null;
  relationshipStatus: string | null;
  travelDates: {
    startDate: string;
    endDate: string;
    duration: number;
  } | null;
  budgetRange: string;
  groupPreference: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export const saveUserProfile = async (uid: string, profileData: Partial<UserProfileData>) => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(userRef, {
        ...profileData,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Save profile error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return { profile: docSnap.data() as UserProfileData, error: null };
    }
    return { profile: null, error: null };
  } catch (error: any) {
    console.error('Get profile error:', error);
    return { profile: null, error: error.message };
  }
};

// ============ TRIP SERVICES ============

export interface TripData {
  id?: string;
  userId: string;
  title: string;
  destination: string;
  category: string;
  highlight: string;
  visibility: 'public' | 'private';
  groupSize: number;
  budgetPerPerson: number;
  duration: number;
  startDate: string;
  status: 'draft' | 'pending-deposits' | 'confirmed' | 'completed';
  itinerary: any | null;
  quotation: any | null;
  deposits: { name: string; amount: number; paid: boolean; method?: string }[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export const saveTrip = async (tripData: Omit<TripData, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const tripsRef = collection(db, 'trips');
    const docRef = await addDoc(tripsRef, {
      ...tripData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { tripId: docRef.id, error: null };
  } catch (error: any) {
    console.error('Save trip error:', error);
    return { tripId: null, error: error.message };
  }
};

export const updateTrip = async (tripId: string, tripData: Partial<TripData>) => {
  try {
    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      ...tripData,
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Update trip error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserTrips = async (userId: string) => {
  try {
    const tripsRef = collection(db, 'trips');
    const q = query(tripsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const trips: TripData[] = [];
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() } as TripData);
    });

    return { trips, error: null };
  } catch (error: any) {
    console.error('Get trips error:', error);
    return { trips: [], error: error.message };
  }
};

export const deleteTrip = async (tripId: string) => {
  try {
    await deleteDoc(doc(db, 'trips', tripId));
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Delete trip error:', error);
    return { success: false, error: error.message };
  }
};

// ============ SAVED/BOOKMARKED TRIPS ============

export interface SavedTripData {
  id?: string;
  userId: string;
  tripId: string;
  type: 'interested' | 'signed-up';
  savedAt: Timestamp | null;
}

export const saveTripToBookmarks = async (userId: string, tripId: string, type: 'interested' | 'signed-up') => {
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    // Check if already saved
    const q = query(bookmarksRef, where('userId', '==', userId), where('tripId', '==', tripId));
    const existing = await getDocs(q);

    if (!existing.empty) {
      // Update existing
      const docRef = existing.docs[0].ref;
      await updateDoc(docRef, { type, savedAt: serverTimestamp() });
    } else {
      // Create new
      await addDoc(bookmarksRef, {
        userId,
        tripId,
        type,
        savedAt: serverTimestamp()
      });
    }
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Save bookmark error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserBookmarks = async (userId: string) => {
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    const q = query(bookmarksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const bookmarks: SavedTripData[] = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push({ id: doc.id, ...doc.data() } as SavedTripData);
    });

    return { bookmarks, error: null };
  } catch (error: any) {
    console.error('Get bookmarks error:', error);
    return { bookmarks: [], error: error.message };
  }
};

// ============ PHOTO UPLOAD SERVICES ============

export interface UploadedPhoto {
  id: string;
  url: string;
  fileName: string;
  uploadedAt: Date;
  tripId?: string;
  userId: string;
}

export const uploadPhoto = async (
  file: File,
  userId: string,
  tripId?: string,
  onProgress?: (progress: number) => void
): Promise<{ photo: UploadedPhoto | null; error: string | null }> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const path = tripId
      ? `photos/${userId}/${tripId}/${fileName}`
      : `photos/${userId}/${fileName}`;

    const storageRef = ref(storage, path);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const url = await getDownloadURL(snapshot.ref);

    const photo: UploadedPhoto = {
      id: fileName,
      url,
      fileName: file.name,
      uploadedAt: new Date(),
      tripId,
      userId
    };

    // Save photo metadata to Firestore
    await addDoc(collection(db, 'photos'), {
      ...photo,
      uploadedAt: serverTimestamp()
    });

    return { photo, error: null };
  } catch (error: any) {
    console.error('Upload photo error:', error);
    return { photo: null, error: error.message };
  }
};

export const uploadMultiplePhotos = async (
  files: File[],
  userId: string,
  tripId?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<{ photos: UploadedPhoto[]; errors: string[] }> => {
  const photos: UploadedPhoto[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadPhoto(files[i], userId, tripId);
    if (result.photo) {
      photos.push(result.photo);
    } else if (result.error) {
      errors.push(`${files[i].name}: ${result.error}`);
    }
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return { photos, errors };
};

export const getUserPhotos = async (userId: string, tripId?: string) => {
  try {
    const photosRef = collection(db, 'photos');
    let q;

    if (tripId) {
      q = query(photosRef, where('userId', '==', userId), where('tripId', '==', tripId));
    } else {
      q = query(photosRef, where('userId', '==', userId));
    }

    const querySnapshot = await getDocs(q);
    const photos: UploadedPhoto[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      photos.push({
        id: doc.id,
        url: data.url,
        fileName: data.fileName,
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
        tripId: data.tripId,
        userId: data.userId
      });
    });

    return { photos, error: null };
  } catch (error: any) {
    console.error('Get photos error:', error);
    return { photos: [], error: error.message };
  }
};

export const deletePhoto = async (photoId: string, storagePath: string) => {
  try {
    // Delete from storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(db, 'photos', photoId));

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Delete photo error:', error);
    return { success: false, error: error.message };
  }
};

// ============ PHOTO COMMENTS ============

export interface PhotoComment {
  id?: string;
  photoId: string;
  tripId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: Timestamp | null;
}

export const addPhotoComment = async (comment: Omit<PhotoComment, 'id' | 'createdAt'>) => {
  try {
    const commentsRef = collection(db, 'photoComments');
    const docRef = await addDoc(commentsRef, {
      ...comment,
      createdAt: serverTimestamp()
    });
    return { commentId: docRef.id, error: null };
  } catch (error: any) {
    console.error('Add comment error:', error);
    return { commentId: null, error: error.message };
  }
};

export const getPhotoComments = async (photoId: string) => {
  try {
    const commentsRef = collection(db, 'photoComments');
    const q = query(commentsRef, where('photoId', '==', photoId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const comments: PhotoComment[] = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() } as PhotoComment);
    });

    return { comments, error: null };
  } catch (error: any) {
    console.error('Get comments error:', error);
    return { comments: [], error: error.message };
  }
};

export const subscribeToPhotoComments = (
  photoId: string,
  callback: (comments: PhotoComment[]) => void
): Unsubscribe => {
  const commentsRef = collection(db, 'photoComments');
  const q = query(commentsRef, where('photoId', '==', photoId), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const comments: PhotoComment[] = [];
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() } as PhotoComment);
    });
    callback(comments);
  });
};

// ============ SQUAD CHAT ============

export interface ChatMessage {
  id?: string;
  tripId: string;
  squadId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
  createdAt: Timestamp | null;
}

export const sendChatMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
  try {
    const messagesRef = collection(db, 'chatMessages');
    const docRef = await addDoc(messagesRef, {
      ...message,
      createdAt: serverTimestamp()
    });
    return { messageId: docRef.id, error: null };
  } catch (error: any) {
    console.error('Send message error:', error);
    return { messageId: null, error: error.message };
  }
};

export const subscribeToChatMessages = (
  tripId: string,
  squadId: string,
  callback: (messages: ChatMessage[]) => void
): Unsubscribe => {
  const messagesRef = collection(db, 'chatMessages');
  const q = query(
    messagesRef,
    where('tripId', '==', tripId),
    where('squadId', '==', squadId),
    orderBy('createdAt', 'asc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
    });
    callback(messages);
  });
};

// ============ SQUAD INVITATIONS ============

export interface SquadInvite {
  id?: string;
  tripId: string;
  squadId: string;
  invitedEmail: string;
  invitedBy: string;
  inviterName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp | null;
}

export const sendSquadInvite = async (invite: Omit<SquadInvite, 'id' | 'createdAt' | 'status'>) => {
  try {
    // Check if already invited
    const invitesRef = collection(db, 'squadInvites');
    const q = query(
      invitesRef,
      where('tripId', '==', invite.tripId),
      where('invitedEmail', '==', invite.invitedEmail.toLowerCase())
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      return { inviteId: null, error: 'This email has already been invited' };
    }

    const docRef = await addDoc(invitesRef, {
      ...invite,
      invitedEmail: invite.invitedEmail.toLowerCase(),
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return { inviteId: docRef.id, error: null };
  } catch (error: any) {
    console.error('Send invite error:', error);
    return { inviteId: null, error: error.message };
  }
};

export const getSquadInvites = async (tripId: string) => {
  try {
    const invitesRef = collection(db, 'squadInvites');
    const q = query(invitesRef, where('tripId', '==', tripId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const invites: SquadInvite[] = [];
    querySnapshot.forEach((doc) => {
      invites.push({ id: doc.id, ...doc.data() } as SquadInvite);
    });

    return { invites, error: null };
  } catch (error: any) {
    console.error('Get invites error:', error);
    return { invites: [], error: error.message };
  }
};

export const cancelSquadInvite = async (inviteId: string) => {
  try {
    await deleteDoc(doc(db, 'squadInvites', inviteId));
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Cancel invite error:', error);
    return { success: false, error: error.message };
  }
};

// ============ SQUAD MEMBERS ============

export interface SquadMember {
  id?: string;
  tripId: string;
  squadId: string;
  oderId: string;
  email: string;
  name: string;
  photoUrl?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Timestamp | null;
}

export const addSquadMember = async (member: Omit<SquadMember, 'id' | 'joinedAt'>) => {
  try {
    const membersRef = collection(db, 'squadMembers');
    const docRef = await addDoc(membersRef, {
      ...member,
      joinedAt: serverTimestamp()
    });
    return { memberId: docRef.id, error: null };
  } catch (error: any) {
    console.error('Add member error:', error);
    return { memberId: null, error: error.message };
  }
};

export const removeSquadMember = async (memberId: string) => {
  try {
    await deleteDoc(doc(db, 'squadMembers', memberId));
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Remove member error:', error);
    return { success: false, error: error.message };
  }
};

export const getSquadMembers = async (tripId: string, squadId: string) => {
  try {
    const membersRef = collection(db, 'squadMembers');
    const q = query(
      membersRef,
      where('tripId', '==', tripId),
      where('squadId', '==', squadId)
    );
    const querySnapshot = await getDocs(q);

    const members: SquadMember[] = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() } as SquadMember);
    });

    return { members, error: null };
  } catch (error: any) {
    console.error('Get members error:', error);
    return { members: [], error: error.message };
  }
};

// ============ CONNECTED PHOTO SERVICES ============

export interface ConnectedService {
  id?: string;
  oderId: string;
  service: 'google-photos' | 'icloud' | 'dropbox';
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  connectedAt: Timestamp | null;
  expiresAt?: Timestamp | null;
}

export const saveConnectedService = async (
  userId: string,
  service: ConnectedService['service'],
  tokens: { accessToken?: string; refreshToken?: string; email?: string }
) => {
  try {
    const servicesRef = collection(db, 'connectedServices');
    // Check if already connected
    const q = query(servicesRef, where('userId', '==', userId), where('service', '==', service));
    const existing = await getDocs(q);

    if (!existing.empty) {
      // Update existing
      const docRef = existing.docs[0].ref;
      await updateDoc(docRef, {
        ...tokens,
        connectedAt: serverTimestamp()
      });
      return { serviceId: existing.docs[0].id, error: null };
    }

    const docRef = await addDoc(servicesRef, {
      userId,
      service,
      ...tokens,
      connectedAt: serverTimestamp()
    });
    return { serviceId: docRef.id, error: null };
  } catch (error: any) {
    console.error('Save service error:', error);
    return { serviceId: null, error: error.message };
  }
};

export const getConnectedServices = async (userId: string) => {
  try {
    const servicesRef = collection(db, 'connectedServices');
    const q = query(servicesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const services: ConnectedService[] = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() } as ConnectedService);
    });

    return { services, error: null };
  } catch (error: any) {
    console.error('Get services error:', error);
    return { services: [], error: error.message };
  }
};

export const disconnectService = async (serviceId: string) => {
  try {
    await deleteDoc(doc(db, 'connectedServices', serviceId));
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Disconnect service error:', error);
    return { success: false, error: error.message };
  }
};

// ============ CHECK IF FIREBASE IS CONFIGURED ============

export const isFirebaseConfigured = () => {
  const apiKey = firebaseConfig.apiKey;
  return apiKey && !apiKey.includes('Demo-replace') && !apiKey.includes('your-');
};

export default app;
