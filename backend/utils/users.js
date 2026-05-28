import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import db from "../firebase.js";

export async function fetchAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      display_name: data.displayName || "Unknown",
      images: data.profileImage ? [{ url: data.profileImage }] : [],
      bio: data.bio || '',
      isPublic: data.isPublic !== false,
    };
  });
}

export async function fetchUserById(id) {
  const docRef = doc(db, "users", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    display_name: data.displayName || "Unknown",
    images: data.profileImage ? [{ url: data.profileImage }] : [],
    bio: data.bio || '',
    isPublic: data.isPublic !== false,
    featuredArtists: data.featuredArtists || [],
    featuredTracks: data.featuredTracks || [],
  };
}
