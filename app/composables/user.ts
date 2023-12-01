import { ref } from 'vue'

type User = {
    user: any
    setUser: (newUser: any) => void
}

export const useUser = (): User => {
    const user = useState('user', () => null)

    const setUser = (newUser: any) => {
        user.value = newUser
    }

    return {
        user,
        setUser
    }
}