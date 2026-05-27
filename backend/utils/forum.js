import db from '../firebase.js';
import { doc, collection, getDocs, where, deleteDoc, deleteField, setDoc, addDoc, query, Timestamp, updateDoc } from 'firebase/firestore';

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
    likes: [],
  });
  return docRef;
}

const createReply = async (reply) => {
  const docRef = await addDoc(collection(db, "replies"), {
    discussion_id: reply.discussion_id,
    user_id: reply.user_id,
    user_display: reply.user_display,
    message: reply.message,
    created_at: Timestamp.now(),
    likes: []
  });
  return docRef;
}

const updateReply = async (reply) => {
  const firestoreTimestamp = Timestamp.fromDate(new Date(reply.created_at));
  await updateDoc(doc(db, "replies", reply.id), {...reply, created_at_str: deleteField(), 
    created_at: firestoreTimestamp,
    imageUrl: deleteField(),
    id: deleteField()});
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

const deleteReply = async (reply_id) => {
  const replyRef = doc(db, "replies", reply_id);
  await deleteDoc(replyRef);
}

// add a like to a discussion post
const likeDiscussion = async (discussion) => {
  const docRef = doc(db, "forum", discussion.id);
  const firestoreTimestamp = Timestamp.fromDate(new Date(discussion.created_at));
  await updateDoc(docRef, {...discussion, 
    created_at_str: deleteField(), 
    created_at: firestoreTimestamp,
    imageUrl: deleteField(),
    id: deleteField()}); // should have handled like updates earlier
}

// delete a discussion board
const deleteDiscussion = async (discussion_id) => {
  // get replies to the discussion
  const repliesRef = collection(db, "replies");
  const q = query(repliesRef, where("discussion_id", "==", discussion_id));
  const querySnapshot = await getDocs(q);

  // loop through discussion responses
  const deletePromises = querySnapshot.docs.map((document) => {
    const docRef = doc(db, "replies", document.id);
    return deleteDoc(docRef);
  });

  // wait for all deletions
  await Promise.all(deletePromises);

  // delete post itself
  const docRef = doc(db, "forum", discussion_id);
  await deleteDoc(docRef);
}


export {createDiscussion, 
  fetchAllDiscussions, 
  createReply, 
  getReplies, 
  deleteDiscussion,
  likeDiscussion,
  deleteReply,
  updateReply};