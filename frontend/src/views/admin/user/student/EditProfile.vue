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
            <IdcardOutlined class="!text-gray-500" />
            <span>Số CCCD</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.idCardNumber"
            placeholder="Nhập số CCCD"
            @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) { target.value = target.value.replace(/\D/g, ''); cloneProfile.idCardNumber = target.value; }
            }"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <BankOutlined class="!text-gray-500" />
            <span>Nơi cấp</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.idCardPlaceOfIssue"
            placeholder="Nơi cấp"
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
            <EnvironmentOutlined class="!text-gray-500" />
            <span>Nơi cư trú</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.residence"
            placeholder="Nơi cư trú"
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
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <GlobalOutlined class="!text-gray-500" />
            <span>Dân Tộc</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.ethnicity"
            placeholder="Dân tộc"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <HomeOutlined class="!text-gray-500" />
            <span>Địa Chỉ</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.address"
            placeholder="Địa chỉ"
          />
        </div>
      </div>
      <div class="flex flex-col items-center w-full">
        <div
          class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2"
        >
          <TeamOutlined />Thông tin bố
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <UserOutlined class="!text-gray-500" />
            <span>Họ và Tên</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fatherName"
            placeholder="Họ và tên bố"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <PhoneOutlined class="!text-gray-500" />
            <span>Điện Thoại</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fatherPhone"
            placeholder="Điện thoại bố"
            maxlength="10"
            @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 10);
                cloneProfile.fatherPhone = target.value;
              }
            }"
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
            v-model="cloneProfile.fatherMail"
            placeholder="Email bố"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <IdcardOutlined class="!text-gray-500" />
            <span>Năm Sinh</span>
          </div>
          <input
            type="number"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fatherYob"
            placeholder="Năm sinh bố"
            min="1900"
            max="2100"
            @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 4);
                cloneProfile.fatherYob = Number(target.value);
              }
            }"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <BankOutlined class="!text-gray-500" />
            <span>Nghề Nghiệp</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fatherOccupation"
            placeholder="Nghề nghiệp bố"
          />
        </div>
      </div>
      <div class="flex flex-col items-center w-full">
        <div
          class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2"
        >
          <TeamOutlined />Thông tin mẹ
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <UserOutlined class="!text-gray-500" />
            <span>Họ và Tên</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.motherName"
            placeholder="Họ và tên mẹ"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <PhoneOutlined class="!text-gray-500" />
            <span>Điện Thoại</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.motherPhone"
            placeholder="Điện thoại mẹ"
            maxlength="10"
            @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 10);
                cloneProfile.motherPhone = target.value;
              }
            }"
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
            v-model="cloneProfile.motherMail"
            placeholder="Email mẹ"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <IdcardOutlined class="!text-gray-500" />
            <span>Năm Sinh</span>
          </div>
          <input
            type="number"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.motherYob"
            placeholder="Năm sinh mẹ"
            min="1900"
            max="2100"
            @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 4);
                cloneProfile.motherYob = Number(target.value);
              }
            }"
          />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <BankOutlined class="!text-gray-500" />
            <span>Nghề Nghiệp</span>
          </div>
          <input
            type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.motherOccupation"
            placeholder="Nghề nghiệp mẹ"
          />
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
import { adminUpdateUserStudent, studentInformation } from "@/services/api";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import { uploadImage } from "@/services/uploadImage";

const { profile, open, studentId } = defineProps<{
  profile: StudentProfile;
  open: boolean;
  reload: boolean;
  studentId: string;
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
  gender: convertGender(profile?.gender ?? ""),
  dob: profile?.dob ? dayjs(profile.dob) : null,
  studentId: studentId,
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
    put(adminUpdateUserStudent, {
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
