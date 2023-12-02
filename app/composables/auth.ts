import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    type UserCredential
} from 'firebase/auth'
import { useUser } from '../composables/user'

type Auth = {
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuth = (): Auth => {
    const { setUser } = useUser()

    const signIn = async (): Promise<void> => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        // const result = await signInWithPopup(auth, provider)
        // setUser(result.user)
        await signInWithPopup(auth, provider)
            .then((result: UserCredential) => {
                setUser(result.user);
            })
            .catch((error) => {
                console.log(error);
                alert(error.message);
            });
    };

    const signOut = async (): Promise<void> => {
        const auth = getAuth();
        await firebaseSignOut(auth)
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