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
        Tạo Thông Báo Mới
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
        Tạo Thông Báo
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import viVN from "ant-design-vue/es/locale/vi_VN";
import dayjs from "dayjs";
import { post } from "@/services/callApi";
import { adminCreateAnnouncement } from "@/services/api";
import { toast } from "vue3-toastify";

interface FormState {
  title: string;
  content: string;
  target: Role;
  date: dayjs.Dayjs;
}

const { open } = defineProps<{
  open: boolean;
  reload: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
  (e: "update:reload", reload: boolean): void;
}>();

const formState = reactive<FormState>({
  title: "",
  content: "",
  target: "STUDENT",
  date: dayjs(),
});

const rules = {
  title: [
    { required: true, message: "Vui lòng nhập tiêu đề" },
  ],
  content: [
    { required: true, message: "Vui lòng nhập nội dung" },
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
    post(adminCreateAnnouncement, {
      ...formState,
      date: formState.date.toDate().toISOString(),
    }).then((res) => {
      if (res.code === 201) {
        emit("update:open", false);
        emit("update:reload", true);
      } else {
        throw new Error("Tạo thông báo thất bại");
      }
    }),
    {
      pending: "Đang tạo thông báo...",
      success: "Tạo thông báo thành công!",
      error: "Tạo thông báo thất bại!",
    }
  );
};
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
