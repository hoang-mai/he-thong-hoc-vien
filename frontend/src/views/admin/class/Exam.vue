<template>
  <a-modal
    v-bind:open="open"
    :width="800"
    @cancel="handleCancel"
    :footer="null"
  >
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Bài Thi
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-tabs v-model:activeKey="activeTab" centered>
      <a-tab-pane key="midterm" tab="Thi giữa kỳ">
        <Midterm
          v-if="activeTab === 'midterm'"
          :class-id="classId"
          :open="open"
          @update:open="emit('update:open', $event)"
          :reload="reload"
          @update:reload="emit('update:reload', $event)"
        />
      </a-tab-pane>
      <a-tab-pane key="final" tab="Thi cuối kỳ">
        <Final 
          v-if="activeTab === 'final'"
          :class-id="classId"
          :open="open"
          @update:open="emit('update:open', $event)"
          :reload="reload"
          @update:reload="emit('update:reload', $event)"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CloseOutlined } from "@ant-design/icons-vue";
import { get } from "@/services/callApi";
import { adminGetAllExamsByClass } from "@/services/api";
import Midterm from "./Midterm.vue";
import { toast } from "vue3-toastify";
import { Footer } from "ant-design-vue/es/layout/layout";
import Final from "./Final.vue";
interface ExamResponse {
  examinationId: number | null;
  date: string | null;
  examinationType: string | null;
  examStudentResponses: any[] | null;
  attendanceResponses: AttendanceResponse[] | null;
}

interface AttendanceResponse {
  classStudentId: number;
  studentName: string;
  studentEmail: string;
  absenceAttendanceCount: number;
  totalAttendanceCount: number;
}
const activeTab = ref("midterm");
const { open, reload, classId } = defineProps<{
  open: boolean;
  reload: boolean;
  classId: number;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:reload", value: boolean): void;
}>();
const handleCancel = () => {
  emit("update:open", false);
};
</script>
<style lang="css" scoped>
:deep(.ant-tabs-tab-active .ant-tabs-tab-btn),
:deep(.ant-tabs-tab:hover) {
  color: var(--color-text-red) !important;
}
:deep(.ant-tabs-ink-bar) {
  background: var(--color-text-red) !important;
}
</style>
