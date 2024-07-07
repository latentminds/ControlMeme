import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { auth } from './firebaseconfig';

export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        return userCredential.user;
    }
    );

}

export const logout = async () => {
    return await signOut(auth);
}

export const registerWithEmail = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            sendEmailVerification(userCredential.user);
        }
        );

}
