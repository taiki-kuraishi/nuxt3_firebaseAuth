import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    type UserCredential
} from 'firebase/auth'
import { useUser } from '../composables/user'

type Auth = {
    signIn: () => void
    signOut: () => void
}

export const useAuth = (): Auth => {
    const { setUser } = useUser()

    const signIn = (): void => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result: UserCredential) => {
                setUser(result);
            })
            .catch((error) => {
                console.log(error);
                alert(error.message);
            });
    };

    const signOut = (): void => {
        const auth = getAuth();
        firebaseSignOut(auth)
            .then(() => {
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
                alert(error.message);
            });
    };

    return {
        signIn,
        signOut
    }
}