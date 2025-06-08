<template>
  <a-config-provider :locale="viVN">
    <a-form-item
      label="Ngày thi"
      :rules="[{ required: true, message: 'Vui lòng chọn ngày thi!' }]"
    >
      <a-date-picker
        v-model:value="formState.date"
        style="width: 100%"
        placeholder="Chọn ngày thi"
        :format="'DD/MM/YYYY'"
        :size="'large'"
      />
    </a-form-item>
  </a-config-provider>
  <a-table
    :width="800"
    :dataSource="attendanceResponses"
    :columns="columns"
    class="hover:cursor-pointer"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'notAllowExam'">
        <a-checkbox
          :checked="getIsAbsent(record.classStudentId)"
          @change="updateIsAbsent(record.classStudentId, $event.target.checked)"
        />
      </template>
      <template v-if="column.key === 'absenceAttendanceCount'">
        <a-tag
          :color="
            record.absenceAttendanceCount > record.totalAttendanceCount
              ? 'red'
              : 'green'
          "
        >
          {{ record.absenceAttendanceCount }}/{{ record.totalAttendanceCount }}
        </a-tag>
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
      class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
      @click="handleCreateExam"
    >
      Tạo Bài Thi
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import dayjs from "dayjs";
import viVN from "ant-design-vue/es/locale/vi_VN";
import { adminCreateExam } from "@/services/api";
import { post } from "@/services/callApi";
import { toast } from "vue3-toastify";

interface AttendanceResponse {
  classStudentId: number;
  studentName: string;
  studentEmail: string;
  absenceAttendanceCount: number;
  totalAttendanceCount: number;
}
interface ExamStudentRequest {
  classStudentId: number;
  isAbsent: boolean;
}

interface FormState {
  date: dayjs.Dayjs | null;
  examinationType: string;
  examStudentRequests: ExamStudentRequest[];
}

const { open, reload, classId, attendanceResponses } = defineProps<{
  open: boolean;
  reload: boolean;
  classId: number;
  attendanceResponses: AttendanceResponse[];
}>();
const handleCreateExam = () => {
  toast.promise(
    post(adminCreateExam + `/${classId}`, {
      date: formState.value.date?.format("YYYY-MM-DD") || "",
      examinationType: formState.value.examinationType,
      examStudentRequests: formState.value.examStudentRequests,
    }).then((res) => {
      if (res.code === 201) {
        emit("update:open", false);
        emit("update:reload", true);
        return res.message || "Tạo bài thi thành công!";
      } else {
        throw new Error(res.error || "Lỗi khi tạo bài thi");
      }
    }),
    {
      pending: "Đang tạo bài thi...",
      success: "Tạo bài thi thành công!",
      error: {
        render: (error: any) => {
          return error.data.message || "Thêm học sinh thất bại";
        },
      },
    }
  );
};
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:reload", value: boolean): void;
}>();

// Khởi tạo formState với examStudentRequests rỗng, sẽ được watch cập nhật
const formState = ref<FormState>({
  date: dayjs(),
  examinationType: "FINAL",
  examStudentRequests: [],
});

// Watch sẽ xử lý việc khởi tạo và cập nhật examStudentRequests
watch(
  () => attendanceResponses,
  (newResponses) => {
    formState.value.examStudentRequests = newResponses.map((response) => ({
      classStudentId: response.classStudentId,
      isAbsent: false, // Mặc định là không vắng mặt
    }));
  },
  { immediate: true }
);

const getIsAbsent = (classStudentId: number): boolean => {
  const request = formState.value.examStudentRequests.find(
    (req) => req.classStudentId === classStudentId
  );
  return request?.isAbsent || false;
};

const updateIsAbsent = (classStudentId: number, isAbsent: boolean): void => {
  const request = formState.value.examStudentRequests.find(
    (req) => req.classStudentId === classStudentId
  );
  if (request) {
    request.isAbsent = isAbsent;
  }
};

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
    title: "Không cho phép thi",
    dataIndex: "notAllowExam",
    key: "notAllowExam",
  },
  {
    title: "Vắng mặt/Điểm danh",
    dataIndex: "absenceAttendanceCount",
    key: "absenceAttendanceCount",
  },
];
const handleCancel = () => {
  emit("update:open", false);
};
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
