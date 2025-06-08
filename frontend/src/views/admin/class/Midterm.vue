<template>
  <div v-if="exam.attendanceResponses" class="w-full">
    <MidtermNotExist
      :attendanceResponses="exam.attendanceResponses"
      :class-id="classId"
      :open="open"
      @update:open="emit('update:open', $event)"
      :reload="reload"
      @update:reload="emit('update:reload', $event)"
    />
  </div>
  <div v-else class="w-full" >
    <MidtermExist v-if="exam.examStudentResponses && exam.date && exam.examinationType && exam.examinationId"
      :exam-responses="exam"
      :class-id="classId"
      :open="open"
      @update:open="emit('update:open', $event)"
      :reload="reload"
      @update:reload="emit('update:reload', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import MidtermNotExist from "./MidtermNotExist.vue";
import MidtermExist from "./MidtermExist.vue";
import { get } from "@/services/callApi";
import { adminGetAllExamsByClass } from "@/services/api";

interface ExamResponse {
  examinationId: number | null;
  date: string | null;
  examinationType: string | null;
  examStudentResponses: ExamStudentResponses[] | null;
  attendanceResponses: AttendanceResponse[] | null;
}
interface ExamStudentResponses {
    studentExaminationId: number;
    studentName: string;
    studentEmail: string;
    grade: number | null;
}
interface AttendanceResponse {
  classStudentId: number;
  studentName: string;
  studentEmail: string;
  absenceAttendanceCount: number;
  totalAttendanceCount: number;
}

const exam = ref<ExamResponse>({
  examinationId: null,
  date: null,
  examinationType: null,
  examStudentResponses: [],
  attendanceResponses: [],
});

const { open, reload, classId } = defineProps<{
  open: boolean;
  reload: boolean;
  classId: number;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:reload", value: boolean): void;
}>();

onMounted(() => {
  get(adminGetAllExamsByClass + `/${classId}`, {
    examinationType: "MIDTERM",
  }).then((res) => {
    if (res.code === 200) {
      exam.value = res.data;
    } else {
      toast.error(res.message || "Lỗi khi tải dữ liệu bài thi");
    }
  });
});
</script>
<style lang="css" scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: var(--color-bg-red);
  color: #fff;
}

:deep(.ant-table) {
  border: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td) {
  border: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr:nth-child(odd)) {
  background-color: #fff;
}

:deep(.ant-table-tbody > tr:nth-child(odd):hover > td) {
  background-color: #ffeeee !important;
}

:deep(.ant-table-tbody > tr:nth-child(even)) {
  background-color: var(--color-bg-gray);
}

:deep(.ant-table-tbody > tr:nth-child(even):hover > td) {
  background-color: #ffeeee !important;
}
</style>
