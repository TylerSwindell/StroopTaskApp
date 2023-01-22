import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import {db} from '../firebase-config'

export async function queryDoc(e, table, value) {
    e.preventDefault()

    const docRef = doc(db, table, value);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
      
      return docSnap.data()
    } else return null
}

export async function queryAll(e, table) {
  e.preventDefault()

  const q = query(collection(db, table));
  return await getDocs(q);
}