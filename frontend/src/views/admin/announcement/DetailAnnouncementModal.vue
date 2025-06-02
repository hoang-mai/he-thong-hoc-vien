<template>
  <a-modal v-bind:open="open" @cancel="handleCancel" :width="700">
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>

    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Chi Tiết Thông Báo
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>

    <a-card :bordered="false" class="announcement-card">
    <div class="description-label flex flex-row items-center justify-between">
      <a-typography-title :level="3" style="margin-bottom: 0; color: #f5222d">
        {{ formState.title }}
      </a-typography-title>
      <a-tag color="red">{{ convertTargetToName(formState.target) }}</a-tag>
    </div>

      <a-row class="meta-info-row">
        <a-col :span="24">
          <a-space>
            <UserOutlined style="color: #f5222d" />
            <span>Admin: {{ formState.adminName }}</span>
            <a-divider type="vertical" style="border-color: #ffccc7" />
            <CalendarOutlined style="color: #f5222d" />
            <span>Thông báo: {{ formatDate(formState.date) }}</span>
          </a-space>
        </a-col>
      </a-row>

      <a-divider style="background-color: #ffccc7; margin: 16px 0" />

      <div class="content-container">
        <a-typography>
          <div v-html="formState.content" class="content-html"></div>
        </a-typography>
      </div>
      <a-row class="meta-info-row">
        <a-col :span="24">
          <a-space>
            <CalendarOutlined style="color: #f5222d" />
            <span>Ngày tạo: {{ formatDate(formState.createdAt) }}</span>
            <a-divider type="vertical" style="border-color: #ffccc7" />
            <CalendarOutlined style="color: #f5222d" />
            <span>Ngày cập nhật: {{ formatDate(formState.updatedAt) }}</span>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel"
      >
        Đóng
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { UserOutlined, CalendarOutlined } from "@ant-design/icons-vue";
import { defineProps, defineEmits, onMounted, reactive } from "vue";
import { get } from "@/services/callApi";
import { adminAnnouncement } from "@/services/api";
import dayjs from "dayjs";

interface Announcement {
  id: number;
  title: string;
  content: string;
  target: Role;
  targetName: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  adminName: string;
  adminId: number;
}

const formState = reactive<Announcement>({
  id: 0,
  title: "",
  content: "",
  target: "STUDENT",
  targetName: "",
  date: "",
  createdAt: "",
  updatedAt: "",
  adminName: "",
  adminId: 0,
});

const { open, announcementId } = defineProps<{
  open: boolean;
  announcementId: number;
}>();

const emit = defineEmits<(e: "update:open", open: boolean) => void>();
const handleCancel = () => {
  emit("update:open", false);
};

const formatDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

const convertTargetToName = (target: Role) => {
  switch (target) {
    case "STUDENT":
      return "Học sinh";
    case "TEACHER":
      return "Giáo viên";
    case "ADMIN":
      return "Quản trị viên";
    default:
      return "";
  }
};

onMounted(() => {
  get(adminAnnouncement + "/" + announcementId).then((res) => {
    if (res.code === 200) {
      formState.id = res.data.id;
      formState.title = res.data.title;
      formState.adminName = res.data.adminName;
      formState.createdAt = res.data.createdAt;
      formState.updatedAt = res.data.updatedAt;
      formState.content = res.data.content;
      formState.target = res.data.target;
      formState.date = res.data.date;
    }
  });
});
</script>

<style scoped>
.custom-title {
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #ffccc7;
}

.announcement-card {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.15);
}

.description-label {
  display: flex;
  align-items: center;
}

.meta-info-row {
  margin: 16px 0;
  color: #595959;
}

.content-container {
  padding: 16px 0;
  background-color: #fff2f0;
  border-radius: 4px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.content-html {
  padding: 0 16px;
}

:deep(.ant-modal-content) {
  border: 1px solid #ffccc7;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  background-color: #fff1f0;
  border-bottom: none;
}

:deep(.ant-descriptions-item-label) {
  width: 80%;
}
</style>
