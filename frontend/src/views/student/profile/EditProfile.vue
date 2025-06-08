<template>
  <a-modal v-bind:open="open" :width="800" @cancel="emit('update:open', false)">
    <template #closeIcon>
      <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Chỉnh sửa thông tin
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <div class="flex flex-col items-center max-h-150 overflow-y-auto">
      <div class="flex flex-col items-center w-full">
        <div class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2">
          <UserOutlined />Thông tin cá nhân
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <IdcardOutlined class="!text-gray-500" />
            <span>Số CCCD</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.idCardNumber" placeholder="Nhập số CCCD" @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) { target.value = target.value.replace(/\D/g, ''); cloneProfile.idCardNumber = target.value; }
            }" />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <BankOutlined class="!text-gray-500" />
            <span>Nơi cấp</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.idCardPlaceOfIssue" placeholder="Nơi cấp" />
        </div>

        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <EnvironmentOutlined class="!text-gray-500" />
            <span>Nơi cư trú</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.residence" placeholder="Nơi cư trú" />
        </div>

        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <HomeOutlined class="!text-gray-500" />
            <span>Địa Chỉ</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.address" placeholder="Địa chỉ" />
        </div>
      </div>
      <div class="flex flex-col items-center w-full">
        <div class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2">
          <TeamOutlined />Thông tin bố
        </div>

        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <PhoneOutlined class="!text-gray-500" />
            <span>Điện Thoại</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fatherPhone" placeholder="Điện thoại bố" maxlength="10" @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 10);
                cloneProfile.fatherPhone = target.value;
              }
            }" />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <MailOutlined class="!text-gray-500" />
            <span>Email</span>
          </div>
          <input type="email"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fatherMail" placeholder="Email bố" />
        </div>

      </div>
      <div class="flex flex-col items-center w-full">
        <div class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2">
          <TeamOutlined />Thông tin mẹ
        </div>

        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <PhoneOutlined class="!text-gray-500" />
            <span>Điện Thoại</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.motherPhone" placeholder="Điện thoại mẹ" maxlength="10" @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 10);
                cloneProfile.motherPhone = target.value;
              }
            }" />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <MailOutlined class="!text-gray-500" />
            <span>Email</span>
          </div>
          <input type="email"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.motherMail" placeholder="Email mẹ" />
        </div>

      </div>
    </div>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="emit('update:open', false)">
        Hủy bỏ
      </button>
      <button class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleOk">
        Lưu thay đổi
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive } from "vue";

import {
  UserOutlined,
  IdcardOutlined,
  TeamOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { put } from "@/services/callApi";
import { studentInformation } from "@/services/api";
import { toast } from "vue3-toastify";

const { profile, open } = defineProps<{
  profile: StudentProfile;
  open: boolean;
  reload: boolean
}>();

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
  (e: "update:reload", reload: boolean): void;
}>();

const cloneProfile = reactive({
  ...profile,
});

const handleOk = () => {
  toast.promise(
    put(studentInformation, {
      ...cloneProfile
    }
    ).then((res) => {
      if (res.code !== 202) {
        toast.error(res.message);
        return;
      }
      emit("update:open", false);
      emit("update:reload", true);
    }),
    {
      pending: "Đang cập nhật thông tin",
      success: "Cập nhật thông tin thành công",
      error: "Cập nhật thông tin thất bại",
    }
  );
};
</script>

<style>
.ant-picker-footer {
  display: none !important;
}
</style>
