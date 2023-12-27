import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    type UserCredential,
    type User as FirebaseUser,
} from 'firebase/auth'
import { useUser } from '../composables/user'

type Auth = {
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuth = (): Auth => {
    const { setUser } = useUser()

    const auth = getAuth();

    const signIn = async (): Promise<void> => {
        await setPersistence(auth, browserLocalPersistence).then(async () => {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider)
                .then((result: UserCredential) => {
                    setUser(result.user);
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.message);
                });
        });
    };

    const signOut = async (): Promise<void> => {
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
        signOut,
    }
}