<template>
  <div class="flex flex-col max-w-[1920px] mx-auto">
    <main class="mt-16">
      <RouterView />
    </main>
  </div>
  <a-modal
    v-model:open="expiredState"
    ok-text="Đăng nhập lại"
    :closable="false"
    :maskClosable="false"
    @ok="redirectToLogin"
  >
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Phiên làm việc đã hết hạn
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <p>
      Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử
      dụng hệ thống.
    </p>
    <template #footer>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="redirectToLogin"
      >
        Đăng nhập lại
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
}
import { RouterView, useRouter, useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { useExpired } from "@/stores/expired";
import { jwtDecode } from "jwt-decode";
const expiredStore = useExpired();
const expiredState = computed(() => expiredStore.expiredState);
const router = useRouter();
const route = useRoute();
const redirectToLogin = () => {
  expiredStore.setExpired(false);
  router.push("/login");
};
const checkTokenExpiration = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken || accessToken === "undefined") {
    router.push("/login");
    return;
  }
  const decoded = jwtDecode<JwtPayload>(accessToken);
  if (decoded.role === "ADMIN" && !route.path.includes("/admin")) {
    router.replace("/admin/class");
  } else if (decoded.role === "TEACHER" && !route.path.includes("/teacher")) {
    router.replace("/teacher/homeroom");
  } else if (decoded.role === "STUDENT" && !route.path.includes("/")) {
    router.replace("/");
  }
};

checkTokenExpiration();
</script>
