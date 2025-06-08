<template>
  <a-form-item label="Lịch thi">
    <a-input
      :value="new Date(examResponses.date).toLocaleDateString('en-GB')"
      readOnly
      :size="'large'"
    />
  </a-form-item>
  <a-table
    :width="800"
    :dataSource="examResponses.examStudentResponses"
    :columns="columns"
    class="hover:cursor-pointer"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'grade'">
        <p class="text-red-500 font-bold" v-if="record.absent" >Cấm thi</p>
        <a-input-number v-else
          :min="0"
          :max="10"
          :step="0.1"
          style="width: 100px"
          :value="getGrade(record.studentExaminationId)"
          @change="(value:any) => updateGrade(record.studentExaminationId, value)"
        />
      </template>
    </template>
  </a-table>
  <div class="flex justify-end mt-4">
    <button
      class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
      @click="handleCancel"
    >
      Hủy bỏ
    </button>
    <button
      class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium mr-4"
      @click="handleDeleteExam"
    >
      Xóa kỳ thi
    </button>
    <button
      class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
      @click="handleUpdateGrade"
    >
      Lưu Điểm
    </button>
  </div>
</template>
<script setup lang="ts">
import { adminExam, adminUpdateGrade } from "@/services/api";
import { del, post } from "@/services/callApi";
import { ref, watch } from "vue";
import { toast } from "vue3-toastify";
interface AttendanceResponse {
  classStudentId: number;
  studentName: string;
  studentEmail: string;
  absenceAttendanceCount: number;
  totalAttendanceCount: number;
}
interface ExamStudentResponses {
  studentExaminationId: number;
  studentName: string;
  studentEmail: string;
  grade: number | null;
  absent: boolean;
}
interface ExamResponse {
  examinationId: number;
  date: string;
  examinationType: string;
  examStudentResponses: ExamStudentResponses[];
  attendanceResponses: AttendanceResponse[] | null;
}
interface UpdateGradeRequest {
  studentExaminationId: number;
  grade: number | null;
}
const { open, reload, classId, examResponses } = defineProps<{
  open: boolean;
  reload: boolean;
  classId: number;
  examResponses: ExamResponse;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:reload", value: boolean): void;
}>();
const formState = ref<UpdateGradeRequest[]>(
  examResponses.examStudentResponses.map((student) => ({
    studentExaminationId: student.studentExaminationId,
    grade: student.grade || null,
  }))
);
const columns = [
  {
    title: "Tên học sinh",
    dataIndex: "studentName",
    key: "studentName",
  },
  {
    title: "Email học sinh",
    dataIndex: "studentEmail",
    key: "studentEmail",
  },
  {
    title: "Điểm số",
    dataIndex: "grade",
    key: "grade",
  },
];
const getGrade = (studentExaminationId: number) => {
  const student = formState.value.find(s => s.studentExaminationId === studentExaminationId);
  return student?.grade || null;
};

const updateGrade = (studentExaminationId: number, grade: number | null) => {
  const student = formState.value.find(s => s.studentExaminationId === studentExaminationId);
  if (student) {
    student.grade = grade;
  }
};
watch(
  () => examResponses.examStudentResponses,
  (newResponses: ExamStudentResponses[]) => {
    formState.value = newResponses.map((response: ExamStudentResponses) => ({
      studentExaminationId: response.studentExaminationId,
      grade: response.grade || null,
    }));
  },
  { immediate: true }
);
const handleCancel = () => {
  emit("update:open", false);
};
const handleUpdateGrade = () => {
  toast.promise(
    post(adminUpdateGrade, {
      updateGradeRequests: formState.value,
    }).then((res) => {
        if(res.code !== 202) {
          throw new Error(res.message || "Cập nhật điểm thất bại");
        }
      emit("update:open", false);
      emit("update:reload", true);
    }),
    {
      pending: "Đang cập nhật điểm...",
      success: "Cập nhật điểm thành công!",
      error: {
        render: (error: any) => {
          return error.data.message || "Thêm học sinh thất bại";
        },
      },
    }
  );
};
const handleDeleteExam = () => {
  toast.promise(
    del(adminExam + `/${examResponses.examinationId}`).then((res) => {
      if (res.code === 202) {
        emit("update:open", false);
        emit("update:reload", true);
        return res.message || "Xóa kỳ thi thành công!";
      } else {
        throw new Error(res.message || "Lỗi khi xóa kỳ thi");
      }
    }),
    {
      pending: "Đang xóa kỳ thi...",
      success: "Xóa kỳ thi thành công!",
      error: {
        render: (error: any) => {
          return error.data.message || "Xóa kỳ thi thất bại";
        },
      },
    }
  );
};
</script>
