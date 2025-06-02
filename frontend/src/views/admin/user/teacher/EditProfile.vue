<template>
  <a-modal v-bind:open="open" :width="800" @cancel="handleCancel">
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
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center w-full">
        <div class="flex items-center w-full text-(--color-text-red) font-bold text-lg gap-2">
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
                <a-upload v-model:file-list="fileList" name="avatar" list-type="picture" class="avatar-uploader"
                  :max-count="1" :accept="'image/*'" :before-upload="(file: File) => {
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      toast.error('Ảnh phải nhỏ hơn 2MB!');
                      return false;
                    }
                    return true;
                  }">
                  <div v-if="cloneProfile.avatarUrl" class="relative">
                    <img :src="cloneProfile.avatarUrl" alt="avatar" class="w-20 h-20 rounded-full object-cover" />
                  </div>
                  <a-button
                    class="hover:!border-[var(--color-border-gray)] focus:!border-[var(--color-border-gray)] active:!border-[var(--color-border-gray)] hover:!text-[var(--color-text-gray)] focus:!text-[var(--color-text-gray)] active:!text-[var(--color-text-gray)]">
                    <upload-outlined style="color: currentColor" />
                    Chọn ảnh
                  </a-button>
                  <a-button @click.stop="removeAvatar"
                    class="hover:!border-[var(--color-border-gray)] focus:!border-[var(--color-border-gray)] active:!border-[var(--color-border-gray)] hover:!text-[var(--color-text-gray)] focus:!text-[var(--color-text-gray)] active:!text-[var(--color-text-gray)]">
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
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.fullName" placeholder="Nhập họ và tên" />
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <MailOutlined class="!text-gray-500" />
            <span>Email</span>
          </div>
          <input type="email"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.email" placeholder="Nhập email" />
        </div>


        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <PhoneOutlined class="!text-gray-500" />
            <span>Số điện thoại</span>
          </div>
          <input type="text"
            class="border border-(--color-border-gray) rounded-lg px-4 py-2 w-2/3 outline-none transition-colors focus:shadow-sm duration-300"
            v-model="cloneProfile.phoneNumber" placeholder="Số điện thoại" maxlength="10" @input="e => {
              const target = e.target as HTMLInputElement;
              if (target) {
                target.value = target.value.replace(/\D/g, '').slice(0, 10);
                cloneProfile.phoneNumber = target.value;
              }
            }" />
        </div>

        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <CalendarOutlined class="!text-gray-500" />
            <span>Ngày Sinh</span>
          </div>
          <a-config-provider :locale="viVN">
            <a-date-picker v-model:value="cloneProfile.dob"
              class="w-2/3 h-10 !border !border-(--color-border-gray) !rounded-lg !outline-none !transition-colors focus:!shadow-sm !duration-300"
              :inputReadOnly="true" placeholder="Nhập ngày sinh" :format="'DD/MM/YYYY'">
            </a-date-picker>
          </a-config-provider>
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <ContactsOutlined class="!text-gray-500" />
            <span>Giới Tính</span>
          </div>
          <a-select ref="select" v-model:value="cloneProfile.gender" :placeholder="'Chọn giới tính'" size="large"
            class="w-2/3">
            <a-select-option value="Nam">Nam</a-select-option>
            <a-select-option value="Nữ">Nữ</a-select-option>
            <a-select-option value="Khác">Khác</a-select-option>
          </a-select>
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 w-1/3">
            <SolutionOutlined class="!text-gray-500" />
            <span>Bằng cấp</span>
          </div>
          <a-select ref="select" v-model:value="cloneProfile.diplomaLevel" :placeholder="'Chọn bằng cấp'" size="large"
            class="w-2/3">
            <a-select-option value="Trung học phổ thông">Trung học phổ thông</a-select-option>
            <a-select-option value="Trung cấp nghề">Trung cấp nghề</a-select-option>
            <a-select-option value="Cao đẳng">Cao đẳng</a-select-option>
            <a-select-option value="Cao đẳng / Văn bằng chuyên ngành">Cao đẳng / Văn bằng chuyên ngành</a-select-option>
            <a-select-option value="Cao đẳng nâng cao">Cao đẳng nâng cao</a-select-option>
            <a-select-option value="Cử nhân">Cử nhân</a-select-option>
            <a-select-option value="Văn bằng sau đại học">Văn bằng sau đại học</a-select-option>
            <a-select-option value="Thạc sĩ">Thạc sĩ</a-select-option>
            <a-select-option value="Tiến sĩ">Tiến sĩ</a-select-option>
          </a-select>
        </div>
        <div class="flex flex-row w-full items-center mb-4">
          <div class="flex items-center gap-2 font-medium text-gray-500 !w-1/3">
            <FileDoneOutlined class="!text-gray-500" />
            <span>Mô tả</span>
          </div>
          <a-textarea v-model:value="cloneProfile.careerDesc" :placeholder="'Nhập mô tả'" size="large" class="!w-2/3 !border !border-(--color-border-gray) !rounded-lg !outline-none !transition-colors focus:!shadow-sm !duration-300"
            :rows="4" :style="{ resize: 'none' }"></a-textarea>
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
import { ref, reactive, watch } from "vue";
import viVN from "ant-design-vue/es/locale/vi_VN";
interface TeacherProfile {
  id: number | null,
  userId: number | null,
  username: string | null,
  fullName: string | null,
  gender: Role | null,
  dob: string | null,
  email: string | null,
  phoneNumber: string | null,
  avatarUrl: string | null,
  createdAt: string | null,
  updatedAt: string | null,
  diplomaLevel: DiplomaLevel | null,
  careerDesc: string | null,
}
import {
  UserOutlined,
  SolutionOutlined,
  FileDoneOutlined,
  TeamOutlined,
  HeartOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons-vue";
import { put } from "@/services/callApi";
import { adminUpdateUserTeacher, studentInformation } from "@/services/api";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
import { uploadImage } from "@/services/uploadImage";

const { profile, open, teacherId } = defineProps<{
  profile: TeacherProfile;
  open: boolean;
  reload: boolean;
  teacherId: string;
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
const convertDiplomaLevel = (diplomaLevel: DiplomaLevel | null | undefined) => {
  if (!diplomaLevel) return 'Chưa cung cấp';
  switch (diplomaLevel) {
    case 'HIGH_SCHOOL':
      return 'Trung học phổ thông';
    case 'VOCATIONAL':
      return 'Trung cấp nghề';
    case 'ASSOCIATE':
      return 'Cao đẳng';
    case 'DIPLOMA':
      return 'Cao đẳng / Văn bằng chuyên ngành';
    case 'ADVANCED_DIPLOMA':
      return 'Cao đẳng nâng cao';
    case 'BACHELOR':
      return 'Cử nhân';
    case 'POSTGRADUATE_DIPLOMA':
      return 'Văn bằng sau đại học';
    case 'MASTER':
      return 'Thạc sĩ';
    case 'DOCTORATE':
      return 'Tiến sĩ';
    default:
      return diplomaLevel;
  }
};
const convertStringToDiplomaLevel = (diplomaLevel: string) => {
  switch (diplomaLevel) {
    case 'Trung học phổ thông':
      return 'HIGH_SCHOOL';
    case 'Trung cấp nghề':
      return 'VOCATIONAL';
    case 'Cao đẳng':
      return 'ASSOCIATE';
    case 'Cao đẳng / Văn bằng chuyên ngành':
      return 'DIPLOMA';
    case 'Cao đẳng nâng cao':
      return 'ADVANCED_DIPLOMA';
    case 'Cử nhân':
      return 'BACHELOR';
    case 'Văn bằng sau đại học':
      return 'POSTGRADUATE_DIPLOMA';
    case 'Thạc sĩ':
      return 'MASTER';
    case 'Tiến sĩ':
      return 'DOCTORATE';
    default:
      return diplomaLevel;
  }
};
const cloneProfile = reactive({
  ...profile,
  gender: convertGender(profile?.gender ?? ""),
  dob: profile?.dob ? dayjs(profile.dob) : null,
  teacherId: teacherId,
  diplomaLevel: convertDiplomaLevel(profile?.diplomaLevel),
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
    put(adminUpdateUserTeacher, {
      ...cloneProfile,
      gender: convertStringToGender(cloneProfile.gender),
      avatarUrl: avatarUrl,
      diplomaLevel: convertStringToDiplomaLevel(cloneProfile.diplomaLevel),
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
