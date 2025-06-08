<template>
  <a-modal v-bind:open="open" @ok="handleOk" @cancel="handleCancel">
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>

    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Chỉnh Sửa Thông Báo
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-form
      :model="formState"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="Tiêu đề" name="title">
        <a-input v-model:value="formState.title" :size="'large'" />
      </a-form-item>

      <a-form-item label="Nội dung" name="content">
        <a-textarea
          v-model:value="formState.content"
          :rows="4"
          placeholder="Nhập nội dung thông báo..."
          :style="{ resize: 'none' }"
        />
      </a-form-item>

      <a-form-item label="Đối tượng" name="target">
        <a-select v-model:value="formState.target" :size="'large'">
          <a-select-option value="STUDENT">Học sinh</a-select-option>
          <a-select-option value="TEACHER">Giáo viên</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Ngày" name="date">
        <a-config-provider :locale="viVN">
          <a-date-picker
            v-model:value="formState.date"
            format="DD-MM-YYYY"
            style="width: 100%"
            :size="'large'"
          />
        </a-config-provider>
      </a-form-item>
    </a-form>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleOk"
      >
        Cập Nhật
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import viVN from "ant-design-vue/es/locale/vi_VN";
import dayjs from "dayjs";
import { get, put } from "@/services/callApi";
import { adminAnnouncement, adminUpdateAnnouncement } from "@/services/api";
import { toast } from "vue3-toastify";

interface FormState {
  id: number;
  title: string;
  content: string;
  target: Role;
  date: dayjs.Dayjs;
}

const { open, announcementId } = defineProps<{
  open: boolean;
  reload: boolean;
  announcementId: number;
}>();

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
  (e: "update:reload", reload: boolean): void;
}>();

const formState = reactive<FormState>({ 
    id: 0,
    title: "",
    content: "",
    target: "STUDENT",
    date: dayjs(),
 });

const rules = {
  title: [
    { required: true, message: "Vui lòng nhập tiêu đề", trigger: "blur" },
  ],
  content: [
    { required: true, message: "Vui lòng nhập nội dung", trigger: "blur" },
  ],
  target: [
    { required: true, message: "Vui lòng chọn đối tượng", trigger: "change" },
  ],
  date: [{ required: true, message: "Vui lòng chọn ngày", trigger: "change" }],
};

const handleCancel = () => {
  emit("update:open", false);
};

const handleOk = () => {
  toast.promise(
    put(adminUpdateAnnouncement, {
      ...formState,
      date: formState.date.toDate().toISOString(),
    }).then((res) => {
      if (res.code === 202) {
        emit("update:open", false);
        emit("update:reload", true);
      } else {
        throw new Error("Cập nhật thông báo thất bại");
      }
    }),
    {
      pending: "Đang cập nhật thông báo...",
      success: "Cập nhật thông báo thành công!",
      error: "Cập nhật thông báo thất bại!",
    }
  );
};
onMounted(() => {
  get(adminAnnouncement + "/" + announcementId).then((res) => {
    if (res.code === 200) {
      formState.id = res.data.id;
      formState.title = res.data.title;
      formState.content = res.data.content;
      formState.target = res.data.target;
      formState.date = dayjs(res.data.date);
    }
  });
});
</script>

<style scoped>
:deep(.ant-btn-primary) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff7875;
  border-color: #ff7875;
}

:deep(.ant-input:focus),
:deep(.ant-input:hover),
:deep(.ant-input:active) {
  border-color: var(--color-border-gray);
}
</style>
