import type { User as FirebaseUser } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";
import {
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export type FirestoreResponse<T = any> = {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
};

export const firestoreService = {

    getDocumentById: async <T = DocumentData>(
        collectionName: string,
        docId: string
    ): Promise<T & { docId: string } | null> => {
        try {
            const docRef = doc(db, collectionName, docId);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) return null;
            return { docId: snapshot.id, ...(snapshot.data() as T) };
        } catch (error: any) {
            throw { success: false, message: "Failed to fetch document", error: error.message } as FirestoreResponse;
        }
    },

    getAllDocuments: async <T = DocumentData>(
        collectionName: string
    ): Promise<(T & { docId: string })[]> => {
        try {
            const colRef = collection(db, collectionName);
            const snapshot = await getDocs(colRef);
            return snapshot.docs.map(docSnap => ({ docId: docSnap.id, ...(docSnap.data() as T) }));
        } catch (error: any) {
            throw { success: false, message: "Failed to fetch documents", error: error.message } as FirestoreResponse;
        }
    },

    queryByField: async <T = DocumentData>(
        collectionName: string,
        field: string,
        value: any
    ): Promise<(T & { docId: string })[]> => {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, where(field, "==", value));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(docSnap => ({ docId: docSnap.id, ...(docSnap.data() as T) }));
        } catch (error: any) {
            throw { success: false, message: `Query failed for ${field}`, error: error.message } as FirestoreResponse;
        }
    },

    addDocument: async <T = DocumentData>(
        collectionName: string,
        data: T,
        docId?: string
    ): Promise<string> => {
        try {
            if (docId) {
                const docRef = doc(db, collectionName, docId);
                await setDoc(docRef, { ...data, createdAt: serverTimestamp(), docId });
                return docRef.id;
            } else {
                const colRef = collection(db, collectionName);
                const newDocRef = doc(colRef);
                await setDoc(newDocRef, { ...data, createdAt: serverTimestamp(), docId: newDocRef.id });
                return newDocRef.id;
            }
        } catch (error: any) {
            throw { success: false, message: "Failed to add document", error: error.message } as FirestoreResponse;
        }
    },

    updateDocument: async <T = DocumentData>(
        collectionName: string,
        docId: string,
        data: Partial<T>
    ): Promise<void> => {
        try {
            await updateDoc(doc(db, collectionName, docId), data);
        } catch (error: any) {
            throw { success: false, message: "Failed to update document", error: error.message } as FirestoreResponse;
        }
    },

    deleteDocument: async (collectionName: string, docId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, collectionName, docId));
        } catch (error: any) {
            throw { success: false, message: "Failed to delete document", error: error.message } as FirestoreResponse;
        }
    },

    updateByField: async (
        collectionName: string,
        fieldName: string,
        fieldValue: any,
        newData: Record<string, any>
    ): Promise<number> => {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, where(fieldName, "==", fieldValue));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return 0;

            for (const docSnap of snapshot.docs) {
                await updateDoc(doc(db, collectionName, docSnap.id), newData);
            }

            return snapshot.size;
        } catch (error: any) {
            throw { success: false, message: "Failed to update by field", error: error.message } as FirestoreResponse;
        }
    },

    deleteByField: async (
        collectionName: string,
        fieldName: string,
        fieldValue: any
    ): Promise<number> => {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, where(fieldName, "==", fieldValue));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return 0;

            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, collectionName, docSnap.id));
            }

            return snapshot.size;
        } catch (error: any) {
            throw { success: false, message: "Failed to delete by field", error: error.message } as FirestoreResponse;
        }
    },

    updateArrayField: async (
        collectionName: string,
        docId: string,
        fieldName: string,
        value: any,
        operation: "union" | "remove"
    ): Promise<void> => {
        try {
            const docRef = doc(db, collectionName, docId);
            if (operation === "union") await updateDoc(docRef, { [fieldName]: arrayUnion(value) });
            else if (operation === "remove") await updateDoc(docRef, { [fieldName]: arrayRemove(value) });
            else throw new Error("Invalid operation type");
        } catch (error: any) {
            throw { success: false, message: "Failed to update array field", error: error.message } as FirestoreResponse;
        }
    },

    addNestedDocument: async (
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string,
        data: Record<string, any>,
        addTimestamp: boolean = true
    ): Promise<string> => {
        try {
            const nestedRef = doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId);
            const payload = addTimestamp ? { ...data, createdAt: serverTimestamp() } : data;
            await setDoc(nestedRef, payload);
            return nestedRef.id;
        } catch (error: any) {
            throw { success: false, message: "Failed to add nested document", error: error.message } as FirestoreResponse;
        }
    },

    getAllNestedDocument: async (
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string
    ): Promise<any[]> => {
        try {
            const nestedCol = collection(db, parentCollection, parentDocId, nestedCollection);
            const snapshot = await getDocs(nestedCol);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error: any) {
            throw { success: false, message: "Failed to fetch nested documents", error: error.message } as FirestoreResponse;
        }
    },

    getSingleNestedDocument: async (
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string
    ): Promise<any> => {
        try {
            const nestedRef = doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId);
            const snapshot = await getDoc(nestedRef);
            if (!snapshot.exists()) throw new Error("Nested document not found");
            return { id: snapshot.id, ...snapshot.data() };
        } catch (error: any) {
            throw { success: false, message: "Failed to fetch nested document", error: error.message } as FirestoreResponse;
        }
    },

    updateNestedDocument: async (
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string,
        data: Record<string, any>
    ): Promise<void> => {
        try {
            await updateDoc(doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId), data);
        } catch (error: any) {
            throw { success: false, message: "Failed to update nested document", error: error.message } as FirestoreResponse;
        }
    },

    removeNestedDocument: async (
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string
    ): Promise<void> => {
        try {
            await deleteDoc(doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId));
        } catch (error: any) {
            throw { success: false, message: "Failed to remove nested document", error: error.message } as FirestoreResponse;
        }
    },

    getCurrentUser: (): FirebaseUser | null => {
        try {
            return auth.currentUser;
        } catch (error: any) {
            throw { success: false, message: "Failed to get current user", error: error.message } as FirestoreResponse;
        }
    }
};
