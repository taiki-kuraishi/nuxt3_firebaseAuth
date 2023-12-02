import { ref, type Ref } from 'vue';
import { type UserCredential } from 'firebase/auth';

type User = {
    user: Ref<UserCredential | null>;
    setUser: (newUser: UserCredential | null) => void;
};

export const useUser = (): User => {
    const user = ref<UserCredential | null>(null);

    const setUser = (newUser: UserCredential | null) => {
        user.value = newUser;
    };

    return {
        user,
        setUser
    };
};