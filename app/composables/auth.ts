import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
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
        const result = await signInWithPopup(auth, provider);
        //uuidを取得
        const uuid = result.user?.uid;
        console.log(uuid);
        setUser(uuid);
    }

    const signOut = async (): Promise<void> => {
        const auth = getAuth();
        await firebaseSignOut(auth);
        setUser(null);
    }

    return {
        signIn,
        signOut
    }
}