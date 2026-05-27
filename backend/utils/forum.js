import db from '../firebase.js';
import { doc, collection, getDocs, setDoc, addDoc, Timestamp } from 'firebase/firestore';

const fetchAllDiscussions = async () => {
  const querySnapshot = await getDocs(collection(db, "forum"));
  return querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

const createDiscussion = async (post) => {
  const docRef = await addDoc(collection(db, "forum"), {
    user_id: post.user_id,
    user_display: post.user_display,
    message: post.message,
    title: post.title,
    created_at: Timestamp.now(),
  });
  return docRef;
}

export {createDiscussion, fetchAllDiscussions};