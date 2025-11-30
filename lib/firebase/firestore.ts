// src/lib/firebase/firestore.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./client";

// Get a single document
export const getDocument = async (
  collectionName: string,
  documentId: string,
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: "Document not found" };
    }
  } catch (error) {
    return { data: null, error };
  }
};

// Get multiple documents with optional filters
export const getDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = [],
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data: documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Add a new document
export const addDocument = async (
  collectionName: string,
  data: DocumentData,
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error };
  }
};

// Update a document
export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: Partial<DocumentData>,
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  documentId: string,
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);

    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Example: Get user's posts
export const getUserPosts = async (userId: string) => {
  return getDocuments("posts", [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(10),
  ]);
};
