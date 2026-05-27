import db from '../firebase.js';
import { doc, collection, getDocs, where, setDoc, addDoc, query, Timestamp } from 'firebase/firestore';

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

const createReply = async (reply) => {
  console.log(` reply: ${reply}`);
  const docRef = await addDoc(collection(db, "replies"), {
    discussion_id: reply.discussion_id,
    user_id: reply.user_id,
    user_display: reply.user_display,
    message: reply.message,
    created_at: Timestamp.now(),
  });
  return docRef;
}

const getReplies = async (discussion_id) => {
  const repliesRef = collection(db, "replies");
  const q = query(repliesRef, where("discussion_id", "==", discussion_id));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export {createDiscussion, fetchAllDiscussions, createReply, getReplies};