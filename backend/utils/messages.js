import db from '../firebase.js';
import {
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp,
  limit,
} from 'firebase/firestore';

export async function findConversation(userIdA, userIdB) {
  const participants = [userIdA, userIdB].sort();
  const q = query(
    collection(db, 'conversations'),
    where('participants', '==', participants)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export async function createConversation(userIdA, userIdB) {
  const participants = [userIdA, userIdB].sort();
  const docRef = await addDoc(collection(db, 'conversations'), {
    participants,
    lastMessage: '',
    lastMessageAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  });
  return { id: docRef.id, participants, lastMessage: '', lastMessageAt: Timestamp.now(), createdAt: Timestamp.now() };
}

export async function findOrCreateConversation(userIdA, userIdB) {
  const existing = await findConversation(userIdA, userIdB);
  if (existing) return existing;
  return createConversation(userIdA, userIdB);
}

export async function getConversationsForUser(userId) {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getMessages(conversationId, messageLimit = 50) {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(messageLimit)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function sendMessage(conversationId, senderId, text) {
  const msgRef = await addDoc(
    collection(db, 'conversations', conversationId, 'messages'),
    {
      senderId,
      text,
      createdAt: Timestamp.now(),
    }
  );

  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: text,
    lastMessageAt: Timestamp.now(),
  });

  return { id: msgRef.id, senderId, text, createdAt: Timestamp.now() };
}
