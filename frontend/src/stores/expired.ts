import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExpired = defineStore('expired', () => {
    const expiredState = ref<boolean>(false)

    const setExpired = (expired: boolean) => {
        expiredState.value = expired
    }
    return { expiredState, setExpired }
})