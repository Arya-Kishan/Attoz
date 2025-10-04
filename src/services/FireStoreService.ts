// src/services/firestoreService.ts
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

type FirestoreResponse<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    statusCode?: number
};


export const firestoreService = {

    getDocumentById: async <T = DocumentData>(
        collectionName: string,
        docId: string
    ): Promise<(T & { docId: string }) | null> => {
        try {
            const docRef = doc(db, collectionName, docId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                return { docId: docSnap.id, ...(docSnap.data() as T) }
            }
            return null
        } catch (error) {
            console.error("Error fetching document:", error)
            return null
        }
    },


    getAllDocuments: async <T = DocumentData>(
        collectionName: string
    ): Promise<(T & { docId: string })[]> => {
        try {
            const colRef = collection(db, collectionName)
            const querySnapshot = await getDocs(colRef)
            return querySnapshot.docs.map(docSnap => ({
                docId: docSnap.id,
                ...(docSnap.data() as T),
            }))
        } catch (error) {
            console.error("Error fetching all documents:", error)
            return []
        }
    },


    queryByField: async <T = DocumentData>(
        collectionName: string,
        field: string,
        value: any
    ): Promise<(T & { docId: string })[]> => {
        try {
            const colRef = collection(db, collectionName)
            const q = query(colRef, where(field, "==", value))
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(docSnap => ({
                docId: docSnap.id,
                ...(docSnap.data() as T),
            }))
        } catch (error) {
            console.error(`Error querying ${collectionName} by ${field}:`, error)
            return []
        }
    },


    addDocument: async <T = DocumentData>(
        collectionName: string,
        data: T,
        docId?: string
    ): Promise<string | null> => {
        try {
            if (docId) {
                const docRef = doc(db, collectionName, docId)
                await setDoc(docRef, { ...data, createdAt: serverTimestamp(), docId: docId })
                return docRef.id
            } else {
                const colRef = collection(db, collectionName);
                const newDocRef = doc(colRef);
                await setDoc(newDocRef, { ...data, createdAt: serverTimestamp(), docId: newDocRef.id });
                return newDocRef.id;
            }
        } catch (error) {
            console.error("Error adding document:", error)
            return null
        }
    },


    updateDocument: async <T = DocumentData>(
        collectionName: string,
        docId: string,
        data: Partial<T>
    ): Promise<boolean> => {
        try {
            const docRef = doc(db, collectionName, docId)
            await updateDoc(docRef, data)
            return true
        } catch (error) {
            console.error("Error updating document:", error)
            return false
        }
    },


    deleteDocument: async (collectionName: string, docId: string): Promise<boolean> => {
        try {
            const docRef = doc(db, collectionName, docId)
            await deleteDoc(docRef)
            return true
        } catch (error) {
            console.error("Error deleting document:", error)
            return false
        }
    },


    async updateByField(
        collectionName: string,
        fieldName: string,
        fieldValue: any,
        newData: Record<string, any>
    ): Promise<FirestoreResponse<number>> {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, where(fieldName, "==", fieldValue));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, message: "No matching documents found" };
            }

            for (const docSnap of snapshot.docs) {
                const ref = doc(db, collectionName, docSnap.id);
                await updateDoc(ref, newData);
            }

            return {
                success: true,
                message: `Updated ${snapshot.size} document(s)`,
                data: snapshot.size,
            };
        } catch (error: any) {
            console.error("🔥 Firestore updateByField error:", error);
            return { success: false, message: "Failed to update", error: error.message };
        }
    },

    /**
     * Search by field and delete matching documents
     */
    async deleteByField(
        collectionName: string,
        fieldName: string,
        fieldValue: any
    ): Promise<FirestoreResponse<number>> {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, where(fieldName, "==", fieldValue));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, message: "No matching documents found" };
            }

            for (const docSnap of snapshot.docs) {
                const ref = doc(db, collectionName, docSnap.id);
                await deleteDoc(ref);
            }

            return {
                success: true,
                message: `Deleted ${snapshot.size} document(s)`,
                data: snapshot.size,
            };
        } catch (error: any) {
            console.error("🔥 Firestore deleteByField error:", error);
            return { success: false, message: "Failed to delete", error: error.message };
        }
    },


    async updateArrayField(
        collectionName: string,
        docId: string,
        fieldName: string,
        value: any,
        operation: "union" | "remove"
    ): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const docRef = doc(db, collectionName, docId);

            if (operation === "union") {
                await updateDoc(docRef, {
                    [fieldName]: arrayUnion(value),
                });
                return {
                    success: true,
                    message: `✅ Value successfully added to '${fieldName}'`,
                    data: { docId, operation, value },
                };
            }

            if (operation === "remove") {
                await updateDoc(docRef, {
                    [fieldName]: arrayRemove(value),
                });
                return {
                    success: true,
                    message: `✅ Value successfully removed from '${fieldName}'`,
                    data: { docId, operation, value },
                };
            }

            return {
                success: false,
                message: "❌ Invalid operation type. Use 'union' or 'remove'.",
            };
        } catch (error: any) {
            console.error("🔥 Firestore updateArrayField error:", error);
            return {
                success: false,
                message: error?.message || "Unknown error occurred while updating array field.",
            };
        }
    },

    async addNestedDocument(
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string,
        data: Record<string, any>,
        addTimestamp: boolean = true
    ): Promise<FirestoreResponse<string>> {
        try {
            const nestedRef = doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId);
            const payload = addTimestamp ? { ...data, createdAt: serverTimestamp() } : data;
            await setDoc(nestedRef, payload);
            return { success: true, data: nestedRef.id };
        } catch (error: any) {
            console.error("🔥 Firestore add error:", error);
            return { success: false, error: error.message };
        }
    },


    async getAllNestedDocument(
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string
    ): Promise<FirestoreResponse<any[]>> {
        try {
            const nestedCol = collection(db, parentCollection, parentDocId, nestedCollection);
            const snapshot = await getDocs(nestedCol);
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return { success: true, data: docs };
        } catch (error: any) {
            console.error("🔥 Firestore getAll error:", error);
            return { success: false, error: error.message };
        }
    },


    async getSingleNestedDocument(
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string
    ): Promise<FirestoreResponse<any>> {
        try {
            const nestedRef = doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId);
            const snapshot = await getDoc(nestedRef);
            if (!snapshot.exists()) {
                return { success: false, error: "Document not found" };
            }
            return { success: true, data: { id: snapshot.id, ...snapshot.data() } };
        } catch (error: any) {
            console.error("🔥 Firestore getOne error:", error);
            return { success: false, error: error.message };
        }
    },


    async updateNestedDocument(
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string,
        data: Record<string, any>
    ): Promise<FirestoreResponse<boolean>> {
        try {
            const nestedRef = doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId);
            await updateDoc(nestedRef, data);
            return { success: true, data: true };
        } catch (error: any) {
            console.error("🔥 Firestore update error:", error);
            return { success: false, error: error.message };
        }
    },


    async removeNestedDocument(
        parentCollection: string,
        parentDocId: string,
        nestedCollection: string,
        nestedDocId: string
    ): Promise<FirestoreResponse<boolean>> {
        try {
            const nestedRef = doc(db, parentCollection, parentDocId, nestedCollection, nestedDocId);
            await deleteDoc(nestedRef);
            return { success: true, data: true };
        } catch (error: any) {
            console.error("🔥 Firestore remove error:", error);
            return { success: false, error: error.message };
        }
    },


    getCurrentUser: (): FirebaseUser | null => {
        return auth.currentUser
    },
}
