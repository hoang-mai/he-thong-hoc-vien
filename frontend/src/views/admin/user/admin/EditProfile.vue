<template>
  <a-modal v-bind:open="open" :width="800" @cancel="handleCancel">
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Chỉnh sửa thông tin
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center w-full">
        <div
          class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2"
        >
          <UserOutlined />Thông tin cá nhân
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <UserOutlined class="!text-gray-500" />
            <span>Ảnh đại diện</span>
          </div>
          <div class="w-2/3 flex items-center gap-2">
            <div class="flex flex-col items-center">
              <div class="flex flex-row items-center gap-4">
                <a-upload
                  v-model:file-list="fileList"
                  name="avatar"
                  list-type="picture"
                  class="avatar-uploader"
                  :max-count="1"
                  :accept="'image/*'"
                  :before-upload="(file: File) => {
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        toast.error('Ảnh phải nhỏ hơn 2MB!');
                        return false;
                      }
                      return true;
                    }"
                >
                  <div v-if="cloneProfile.avatarUrl" class="relative">
                    <img
                      :src="cloneProfile.avatarUrl"
                      alt="avatar"
                      class="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                  <a-button
                    class="hover:!border-[var(--color-border-gray)] focus:!border-[var(--color-border-gray)] active:!border-[var(--color-border-gray)] hover:!text-[var(--color-text-gray)] focus:!text-[var(--color-text-gray)] active:!text-[var(--color-text-gray)]"
                  >
                    <upload-outlined style="color: currentColor" />
                    Chọn ảnh
                  </a-button>
                  <a-button
                    @click.stop="removeAvatar"
                    class="hover:!border-[var(--color-border-gray)] focus:!border-[var(--color-border-gray)] active:!border-[var(--color-border-gray)] hover:!text-[var(--color-text-gray)] focus:!text-[var(--color-text-gray)] active:!text-[var(--color-text-gray)]"
                  >
                    <delete-outlined style="color: currentColor" />
                    Xóa ảnh
                  </a-button>
                </a-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <UserSwitchOutlined class="!text-gray-500" />
            <span>Họ và Tên</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fullName"
            placeholder="Nhập họ và tên"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <MailOutlined class="!text-gray-500" />
            <span>Email</span>
          </div>
          <input
            type="email"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.email"
            placeholder="Nhập email"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <PhoneOutlined class="!text-gray-500" />
            <span>Số điện thoại</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.phoneNumber"
            placeholder="Số điện thoại"
            maxlength="10"
            @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 10);
                cloneProfile.phoneNumber = target.value;
              }
            }"
          />
        </div>

        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <CalendarOutlined class="!text-gray-500" />
            <span>Ngày Sinh</span>
          </div>
          <a-config-provider :locale="viVN">
            <a-date-picker
              v-model:value="cloneProfile.dob"
              class="w-2/3 h-10 !border !border-(--color-border-gray) !rounded-lg !outline-none !transition-colors focus:!shadow-sm !duration-300"
              :inputReadOnly="true"
              placeholder="Nhập ngày sinh"
              :format="'DD/MM/YYYY'"
            >
            </a-date-picker>
          </a-config-provider>
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <ContactsOutlined class="!text-gray-500" />
            <span>Giới Tính</span>
          </div>
          <a-select
            ref="select"
            v-model:value="cloneProfile.gender"
            :placeholder="'Chọn giới tính'"
            size="large"
            class="w-2/3"
          >
            <a-select-option value="Nam">Nam</a-select-option>
            <a-select-option value="Nữ">Nữ</a-select-option>
            <a-select-option value="Khác">Khác</a-select-option>
          </a-select>
        </div>
        
      </div>
    </div>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="emit('update:open', false)"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleOk"
      >
        Lưu thay đổi
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import viVN from "ant-design-vue/es/locale/vi_VN";

import {
  UserOutlined,
  LockOutlined,
  IdcardOutlined,
  TeamOutlined,
  HeartOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons-vue";
import { put } from "@/services/callApi";
import { adminUpdateUserAdmin, adminUpdateUserStudent, studentInformation } from "@/services/api";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import { uploadImage } from "@/services/uploadImage";
interface Admin {
    id: number
    userId: number
    username: string
    fullName: string
    gender: Gender
    dob: string
    email: string
    phoneNumber: string
    avatarUrl: string
    note: string
    createdAt: string
    updatedAt: string
}
const { profile, open, adminId } = defineProps<{
  profile: Admin;
  open: boolean;
  reload: boolean;
  adminId: string;
}>();
const fileList = ref<any[]>([]);
const removeAvatar = () => {
  cloneProfile.avatarUrl = "";
  fileList.value = [];
};

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
  (e: "update:reload", reload: boolean): void;
}>();
const convertGender = (gender: string) => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "UNDEFINED":
      return "Khác";
    default:
      return gender;
  }
};
const convertStringToGender = (gender: string) => {
  switch (gender) {
    case "Nam":
      return "MALE";
    case "Nữ":
      return "FEMALE";
    case "Khác":
      return "UNDEFINED";
    default:
      return gender;
  }
};
const cloneProfile = reactive({
  ...profile,
  gender: convertGender(profile?.gender ?? "UNDEFINED"),
  dob: profile?.dob ? dayjs(profile.dob) : null,
  adminId: adminId,
});

const handleCancel = () => {
  emit("update:open", false);
};

const handleOk = async () => {
  let avatarUrl = cloneProfile.avatarUrl;
    if (fileList.value && fileList.value.length > 0) {
        try {
            avatarUrl = await uploadImage(fileList.value[0].originFileObj, "avatar");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Tải ảnh lên thất bại!";
            toast.error(`Tải ảnh lên thất bại: ${errorMessage}`);
            return;
        }
    }


  toast.promise(
    put(adminUpdateUserAdmin, {
      ...cloneProfile,
      gender: convertStringToGender(cloneProfile.gender),
      avatarUrl: avatarUrl,
    }).then((res) => {
      if (res.code !== 202) {
        throw new Error(res.message);
      }
      emit("update:open", false);
      emit("update:reload", true);
    }),
    {
      pending: "Đang cập nhật thông tin",
      success: "Cập nhật thông tin thành công",
      error: {
        render({ data }) {
          return `${data}` || "Cập nhật thông tin thất bại";
        },
      },
    }
  );
};
</script>
