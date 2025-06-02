import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserState {
  id: number | null
  username: string
  fullName: string
  avatarUrl: string | null
  email: string
}

export const useUserStore = defineStore('user', () => {
  const userState = ref<UserState | null>(null)

  const setUser = (user: UserState | null) => {
    userState.value = user
  }

  return { userState, setUser }
})
