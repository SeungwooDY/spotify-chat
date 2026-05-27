import { getDocs, getDoc, doc} from 'firebase/firestore';
import { db } from '../firebase';

export async function getAllSongs() {
    const snapshot = await getDocs(collection(db, ''))
}