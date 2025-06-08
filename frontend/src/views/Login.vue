<template>
  <div class="relative flex items-center justify-center min-h-screen bg-red-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-red-600">Đăng nhập</h2>
      <form @submit.prevent="handleLogin" class="space-y-2">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
          <input id="email" type="text" v-model="email"
            class="w-full px-3 py-2 mt-1 focus:outline-none border-b-2 border-gray-300 focus:border-red-500 transition duration-200" />
          <!-- <p v-if="validateEmail()" class="text-red-500">Email không hợp lệ</p>
          <p v-else class="h-6"></p> -->
        </div>
        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password"
            class="w-full px-3 py-2 mt-1 focus:outline-none border-b-2 border-gray-300 focus:border-red-500 transition duration-200" />
          <p v-if="validatePassword()" class="text-red-500">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
          <p v-else-if="error !== ''" class="text-red-500">
            {{ error }}
          </p>
          <p v-else class="h-6"></p>
          <EyeOutlined @click="showPassword = true" v-if="!showPassword"
            class="text-xl absolute right-3 top-9 cursor-pointer" />
          <EyeInvisibleOutlined @click="showPassword = false" v-else
            class="text-xl absolute right-3 top-9 cursor-pointer" />
        </div>
        <button type="submit"
          :disabled="validatePassword()"
          class="w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none">
          Đăng nhập
        </button>
      </form>
    </div>
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
      <svg class="w-full h-32" viewBox="0 0 500 150" preserveAspectRatio="none">
        <path d="M0.00,49.98 C149.99,150.00 349.44,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
          style="stroke: none; fill: #fecaca"></path>
        <!-- màu đỏ nhạt -->
      </svg>
    </div>
    <div class="absolute top-0 left-0 w-full z-0">
      <svg class="w-50 h-50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#fecaca" d="M0,0 C80,40 120,60 200,0 L200,0 L0,0 Z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { login } from "@/services/api";
import { post } from "@/services/callApi";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);
const error = ref<string>("");
const router = useRouter();

watch([email, password], () => {
  error.value = ""
})

// const validateEmail = () => {
//   if (email.value === "") return false;
//   const emailPattern = /@[a-zA-Z0-9]+\./;
//   return !emailPattern.test(email.value);
// };

const validatePassword = () => {
  if (password.value === "") return false;
  return password.value.length < 6;
};
const handleLogin = () => {
  if (validatePassword() || email.value === "" || password.value === "") {
    error.value = "Vui lòng nhập đúng thông tin";
    return;
  }
  toast.promise(
    post(login, {
      username: email.value,
      password: password.value,
    }).then((res) => {
      if (res.code === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        if (res.data.role === "ADMIN") {
          router.replace("/admin/class");
        } else if (res.data.role === "TEACHER") {
          router.replace("/teacher/homeroom");
        } else if (res.data.role === "STUDENT") {
          router.replace("/");
        }
      } else {
        error.value = "Tài khoản hoặc mật khẩu không chính xác";
        throw new Error("Đăng nhập thất bại");
      }
    }),
    {
      pending: "Đang đăng nhập...",
      success: "Đăng nhập thành công",
      error: 'Đăng nhập thất bại',
    }
  )
};
</script>

<style scoped>
/* Add your styles here */
</style>
