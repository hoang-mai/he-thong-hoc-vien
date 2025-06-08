<template>
  <header
    class="max-w-[1920px] mx-auto fixed top-0 z-1000 bg-(--color-bg-red) text-(--color-text-white) p-4 flex justify-center items-center w-full">
    <div class="absolute left-4 flex items-center gap-2">
      <img src="@/assets/images/logo.ico" alt="Logo" class="w-10 h-10 rounded-full object-cover" />
      <Search/>
    </div>


    <p class="text-2xl font-bold">Hệ thống thông tin trường học</p>

    <div class="absolute right-4 flex items-center cursor-pointer gap-4">
      <a-tooltip placement="left" color="var(--color-text-red)" class="">
        <template #title>
          <p v-if="userStore.userState && userStore.userState.fullName">
            {{ userStore.userState.fullName }}
          </p>
          <p v-else>Nguyen Van A</p>
        </template>
        <a-dropdown placement="bottomRight" :arrow="{ pointAtCenter: true }" :trigger="['click']">
          <img v-if="userStore.userState && userStore.userState.avatarUrl" :src="userStore.userState.avatarUrl"
            alt="Avatar" class="w-9 h-9 rounded-full" />
          <div v-else class="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
            <component :is="UserOutlined" class="text-xl" />
          </div>
          <template #overlay>
            <a-menu class="!p-2">
              <a-menu-item class="!cursor-text hover:!bg-transparent">
                <div class="flex flex-row items-center">
                  <img v-if="userStore.userState && userStore.userState.avatarUrl" :src="userStore.userState.avatarUrl"
                    alt="Avatar" class="w-12 h-12 rounded-full mb-2 object-cover" />
                  <div v-else
                    class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2 text-(--color-text-white)">
                    <component :is="UserOutlined" class="text-2xl text-white" />
                  </div>
                  <div class="flex flex-col ml-4">
                    <div class="font-bold text-lg">
                      {{ userStore.userState?.fullName || "Nguyen Van A" }}
                    </div>
                    <div class="text-gray-500 text-sm">
                      {{ userStore.userState?.email || "example@email.com" }}
                    </div>
                  </div>
                </div>
                <hr class="my-2 border-(--color-border-gray)" />
              </a-menu-item>
              <a-menu-item class="hover:!text-[var(--color-text-red)]">
                <button class="flex items-center gap-1 text-base" @click="openChangePassword = true">
                  <LockOutlined />
                  <span>Đổi mật khẩu</span>
                </button>
              </a-menu-item>
              <a-menu-item class="hover:!text-[var(--color-text-red)]">
                <button @click.stop="handleLogout">
                  <div class="flex items-center gap-1 text-base">
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                  </div>
                </button>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-tooltip>
    </div>
  </header>
  <a-modal v-model:open="openChangePassword" @ok="handleChangePassword">
    <template #closeIcon>
      <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
        <CloseOutlined class="text-lg" />
      </span>
    </template>

    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Đổi mật khẩu
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <form ref="form" class="flex flex-col">
      <div class="flex flex-col gap-2 mb-4">
        <label for="oldPassword" class="text-base font-medium">
          Mật khẩu cũ<strong class="text-red-500">*</strong>
        </label>
        <a-input-password v-model:value="oldPassword" :placeholder="'Nhập mật khẩu cũ'" :size="'large'"
          :prefix-icon="LockOutlined" :show-password="true" :style="{ borderColor: 'var(--color-border-gray)' }" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="newPassword" class="text-base font-medium">
          Mật khẩu mới<strong class="text-red-500">*</strong>
        </label>
        <div>
          <a-input-password v-model:value="newPassword" :placeholder="'Nhập mật khẩu mới'" :size="'large'"
            :style="{ borderColor: 'var(--color-border-gray)' }" :prefix-icon="LockOutlined" :show-password="true" />
          <p v-if="newPassword.length > 0 && newPassword.length < 8" class="text-red-500 text-sm">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
          <p v-else class="h-5"></p>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label for="confirmPassword" class="text-base font-medium">
          Xác nhận mật khẩu mới<strong class="text-red-500">*</strong>
        </label>
        <div>
          <a-input-password v-model:value="confirmPassword" :placeholder="'Xác nhận mật khẩu mới'" :size="'large'"
            :prefix-icon="LockOutlined" :style="{ borderColor: 'var(--color-border-gray)' }" :show-password="true"
            autocomplete="off" />
          <p v-if="confirmPassword !== newPassword && confirmPassword.length > 0" class="text-red-500 text-sm">
            Mật khẩu xác nhận không khớp
          </p>
          <p v-else class="h-5"></p>
        </div>
      </div>
    </form>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel">
        Hủy bỏ
      </button>
      <button class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleChangePassword">
        Lưu mật khẩu
      </button>
    </template>
  </a-modal>

</template>

<script setup lang="ts">
import { logout, adminChangeAccountPassword, searchUser, adminAccount } from "@/services/api";
import { post, get } from "@/services/callApi";
import { useUserStore } from "@/stores/user";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";

import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import Search from "./Search.vue";


const router = useRouter();
const loadingChangePassword = ref<boolean>(false);
const openChangePassword = ref<boolean>(false);
const form = ref();
const oldPassword = ref<string>("");
const newPassword = ref<string>("");
const confirmPassword = ref<string>("");


const userStore = useUserStore();


const handleCancel = () => {
  openChangePassword.value = false;
};

const handleChangePassword = () => {
  if (oldPassword.value === "" || newPassword.value === "" || confirmPassword.value === "") {
    toast.error("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (newPassword.value.length < 8) {
    toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    toast.error("Mật khẩu xác nhận không khớp");
    return;
  }
  loadingChangePassword.value = true;

  toast.promise(
    post(adminChangeAccountPassword, {
      currentPassword: oldPassword.value,
      newPassword: newPassword.value,
    }).then((res) => {
      if (res.code !== 202) {
        throw new Error("Đổi mật khẩu thất bại");
      } else {
        openChangePassword.value = false;
        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
        loadingChangePassword.value = false;
      }
    }),
    {
      pending: "Đang đổi mật khẩu...",
      success: "Đổi mật khẩu thành công",
      error: "Đổi mật khẩu thất bại",
    });
};

const handleLogout = () => {
  userStore.setUser(null);
  toast.promise(
    post(logout),
    {
      pending: "Đang đăng xuất...",
      success: "Đăng xuất thành công",
      error: "Đăng xuất thất bại",
    }
  ).finally(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
  });
};
onMounted(() => {
  get(adminAccount).then((res) => {
    if (res.code !== 200) {
      toast.error("Lấy thông tin tài khoản thất bại");
      return;
    }
    userStore.setUser(res.data);
  });
});
</script>

<style scoped>
.search-result-item:hover {
  background-color: rgba(var(--color-bg-red), 0.1);
}
</style>
