<template>
  <div class="p-6">
    <div class="mb-4">
      <a-button
        type="link"
        class="!text-red-600 font-medium px-0"
        @click="goBack"
      >
        <template #icon><LeftOutlined /></template>
        Quay lại
      </a-button>
    </div>
    <a-card :bordered="false" class="rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold text-red-600">Chi tiết lớp học</h2>
        <a-button type="primary" @click="handleEdit">
          <template #icon>
            <EditOutlined />
          </template>
          Chỉnh sửa
        </a-button>
      </div>

      <a-descriptions :column="3" bordered>
        <a-descriptions-item label="Tên lớp học" :span="1">{{
          classData.className
        }}</a-descriptions-item>
        <a-descriptions-item label="Môn học" :span="1">{{
          classData.subjectName
        }}</a-descriptions-item>
        <a-descriptions-item label="Số lượng học sinh" :span="1">{{
          classData.studentCount || students.length
        }}</a-descriptions-item>
        <a-descriptions-item label="Giáo viên" :span="1">
          <div class="flex items-center">
            <img
              v-if="classData.teacherAvatarUrl"
              :src="classData.teacherAvatarUrl"
              alt="Avatar"
              class="w-8 h-8 rounded-full object-cover mr-2"
            />
            <div
              v-else
              class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white mr-2"
            >
              <UserOutlined class="text-sm" />
            </div>
            <div class="flex flex-col">
              <div>{{ classData.teacherFullName }}</div>
              <div class="text-gray-500 text-sm">
                {{ classData.teacherEmail }}
              </div>
            </div>
          </div>
        </a-descriptions-item>

        <a-descriptions-item label="Ngày bắt đầu" :span="1">{{
          formatDate(classData.startDate)
        }}</a-descriptions-item>
        <a-descriptions-item label="Ngày kết thúc" :span="1">{{
          formatDate(classData.endDate)
        }}</a-descriptions-item>
        <a-descriptions-item label="Thứ trong tuần" :span="1">{{
          convertDaysOfWeekToString(classData.dayOfWeek) || "N/A"
        }}</a-descriptions-item>
        <a-descriptions-item label="Tiết học" :span="1"
          >{{ classData.periodStart }}-{{
            classData.periodEnd
          }}</a-descriptions-item
        >
        <a-descriptions-item label="Phòng học" :span="1">{{
          classData.room || "N/A"
        }}</a-descriptions-item>
        <a-descriptions-item label="Học phí" :span="1">{{
          formatCurrency(classData.tuition)
        }}</a-descriptions-item>
        <a-descriptions-item label="Hạn đóng học phí" :span="1">{{
          formatDate(classData.tuitionDueDate)
        }}</a-descriptions-item>
        <a-descriptions-item label="Trọng số cuối kỳ" :span="1">{{
          classData.finalTermWeight
        }}</a-descriptions-item>
        <a-descriptions-item label="Ngưỡng cảnh báo vắng" :span="1">{{
          classData.absenceWarningThreshold
        }}</a-descriptions-item>
        <a-descriptions-item label="Giới hạn vắng mặt" :span="2">{{
          classData.absenceLimit
        }}</a-descriptions-item>
        <a-descriptions-item
          label="Mô tả"
          :span="3"
          v-if="classData.description"
          >{{ classData.description }}</a-descriptions-item
        >
      </a-descriptions>

      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-red-600">Danh sách học sinh</h3>
          <a-button type="primary" @click="showExamModal = true">
            <template #icon>
              <FileTextOutlined />
            </template>
            Bài thi
          </a-button>
          <a-button type="primary" @click="showAddStudentModal = true">
            <template #icon>
              <PlusOutlined />
            </template>
            Thêm học sinh
          </a-button>
        </div>
        <a-table
          :dataSource="students"
          :columns="columns"
          rowKey="id"
          :pagination="false"
          class="bg-white"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'studentInfo'">
              <div class="flex items-center">
                <img
                  v-if="record.avatarUrl"
                  :src="record.avatarUrl"
                  alt="Avatar"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white"
                >
                  <UserOutlined class="text-xl" />
                </div>
                <div class="ml-3">
                  <div class="font-medium">{{ record.fullName }}</div>
                  <div class="text-gray-500 text-sm">
                    {{ record.email }}
                  </div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                type="link"
                class="!text-red-700 !hover:text-red-500"
                @click="handleRemoveStudent(record)"
              >
                <DeleteOutlined class="mr-1" />
                Xóa
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>

  <AddStudent
    v-if="showAddStudentModal"
    v-model:open="showAddStudentModal"
    v-model:reload="reload"
    :class-id="classId"
  />

  <!-- Delete Student Modal -->
  <a-modal
    v-if="showDeleteStudentModal && selectedStudent"
    v-model:open="showDeleteStudentModal"
    @cancel="showDeleteStudentModal = false"
  >
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-red-700 font-bold text-2xl">
        Xóa học sinh
      </div>
      <hr class="my-2 border-gray-300" />
    </template>
    <p class="text-center text-gray-700">
      Bạn có chắc chắn muốn xóa học sinh
      <strong class="text-red-600">{{ selectedStudent.fullName }}</strong>
      khỏi lớp học này không?
    </p>
    <template #footer>
      <button
        class="bg-white text-red-700 px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-red-700 text-white px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleOk"
      >
        Xóa học sinh
      </button>
    </template>
  </a-modal>

  <EditClass
    v-if="showEditModal && classData"
    v-model:open="showEditModal"
    v-model:reload="reload"
    :class-data="classData"
  />
  <Exam
    v-if="showExamModal"
    v-model:open="showExamModal"
    v-model:reload="reload"
    :class-id="classId"
  />
</template>

<script setup lang="ts">
import AddStudent from "./AddStudent.vue";
// Define interfaces
interface Student {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  absenceCount: number;
  midtermGrade: number | null;
  finalGrade: number | null;
  tuitionStatus: string; // "PAID", "UNPAID", "PROCESSING"
  isAbsentMidterm: boolean;
  isAbsentFinalTerm: boolean;
}

interface Class {
  id: number;
  className: string;
  teacherId: number;
  teacherFullName: string;
  teacherEmail: string;
  teacherAvatarUrl: string;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  startDate: string;
  endDate: string;
  description: string;
  tuition: number;
  tuitionDueDate: string;
  finalTermWeight: number;
  studentCount: number;
  dayOfWeek: string;
  periodStart: number;
  periodEnd: number;
  room: string;
  absenceWarningThreshold: number;
  absenceLimit: number;
  classStudentResponses: Student[];
}

import { onMounted, ref, watch } from "vue";
import {
  Card as ACard,
  Descriptions as ADescriptions,
  Table as ATable,
  Button as AButton,
  Modal as AModal,
} from "ant-design-vue";
import {
  LeftOutlined,
  EditOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import { del, get } from "@/services/callApi";
import { adminClass } from "@/services/api";
import { toast } from "vue3-toastify";
import EditClass from "./EditClass.vue";
import Exam from "./Exam.vue";

// Register components
const ADescriptionsItem = ADescriptions.Item;
const route = useRoute();
const router = useRouter();
const classId = Number(route.params.classId);
const showExamModal = ref(false);
// Default class data
const defaultClassData: Class = {
  id: 0,
  className: "",
  teacherId: 0,
  teacherFullName: "",
  teacherEmail: "",
  teacherAvatarUrl: "",
  subjectId: 0,
  subjectName: "",
  startDate: "",
  subjectCode: "",
  endDate: "",
  description: "",
  tuition: 0,
  tuitionDueDate: "",
  finalTermWeight: 0,
  studentCount: 0,
  dayOfWeek: "",
  periodStart: 0,
  periodEnd: 0,
  room: "",
  absenceWarningThreshold: 0,
  absenceLimit: 0,
  classStudentResponses: [],
};

const classData = ref<Class>(defaultClassData);
const students = ref<Student[]>([]);
const showEditModal = ref(false);
const showAddStudentModal = ref(false);
const showDeleteStudentModal = ref(false);
const selectedStudent = ref<Student | null>(null);
const reload = ref(false);
const convertDaysOfWeekToString = (dayOfWeek: string): string => {
  if (dayOfWeek == "MON") return "Thứ Hai";
  if (dayOfWeek == "TUES") return "Thứ Ba";
  if (dayOfWeek == "WED") return "Thứ Tư";
  if (dayOfWeek == "THUS") return "Thứ Năm";
  if (dayOfWeek == "FRI") return "Thứ Sáu";
  if (dayOfWeek == "SAT") return "Thứ Bảy";
  if (dayOfWeek == "SUN") return "Chủ Nhật";
  return "";
};
// Table columns
const columns = [
  {
    title: "Thông tin học sinh",
    dataIndex: "studentInfo",
    key: "studentInfo",
  },
  {
    title: "Số lần vắng mặt",
    dataIndex: "absenceCount",
    key: "absenceCount",
  },
  {
    title: "Điểm giữa kỳ",
    dataIndex: "midtermGrade",
    key: "midtermGrade",
    customRender: ({
      text,
      record,
    }: {
      text: number | null;
      record: Student;
    }) => {
      if (record.isAbsentMidterm) {
        return "Cấm thi";
      }
      return text ? text.toString() : "Chưa có điểm";
    },
  },
  {
    title: "Điểm cuối kỳ",
    dataIndex: "finalGrade",
    key: "finalGrade",
    customRender: ({
      text,
      record,
    }: {
      text: number | null;
      record: Student;
    }) => {
      if (record.isAbsentFinalTerm) {
        return "Cấm thi";
      }
      return text ? text.toString() : "Chưa có điểm";
    },
  },
  {
    title: "Điểm tổng kết",
    key: "calculatedGrade",
    customRender: ({ record }: { record: Student }) => {
      if (record.isAbsentMidterm || record.isAbsentFinalTerm) {
        return "Cấm thi";
      }
      if (
        record.midtermGrade === null ||
        record.finalGrade === null ||
        record.midtermGrade === undefined ||
        record.finalGrade === undefined
      ) {
        return "Chưa có điểm";
      }
      const finalWeight = classData.value.finalTermWeight;
      const midtermWeight = 1 - finalWeight;
      const calculatedGrade =
        record.midtermGrade * midtermWeight + record.finalGrade * finalWeight;
      return calculatedGrade.toFixed(2);
    },
  },
  {
    title: "Trạng thái học phí",
    dataIndex: "tuitionStatus",
    key: "tuitionStatus",
    customRender: ({ text }: { text: string }) => {
      const statusMap: { [key: string]: string } = {
        PAID: "Đã thanh toán",
        UNPAID: "Chưa thanh toán",
        PROCESSING: "Đang xử lý",
      };
      return statusMap[text] || text;
    },
  },

  {
    title: "Hành động",
    key: "action",
  },
];

const handleEdit = () => {
  showEditModal.value = true;
};

const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format("DD-MM-YYYY");
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const goBack = () => {
  router.back();
};

const handleRemoveStudent = (student: any) => {
  selectedStudent.value = student as Student;
  showDeleteStudentModal.value = true;
};

const handleCancel = () => {
  showDeleteStudentModal.value = false;
  selectedStudent.value = null;
};

const handleOk = () => {
  if (!selectedStudent.value) return;
  toast.promise(
    del(`${adminClass}/${selectedStudent.value.id}/students/remove`).then((res: any) => {
      if (res.code !== 202) {
        throw new Error("Xóa học sinh thất bại");
      }
      showDeleteStudentModal.value = false;
      selectedStudent.value = null;
      fetchClassData();
    }),
    {
      pending: "Đang xóa học sinh...",
      success: "Xóa học sinh thành công!",
      error: "Xóa học sinh thất bại!",
    }
  );
};

watch(
  () => reload.value,
  (newValue) => {
    if (newValue) {
      fetchClassData();
      reload.value = false;
    }
  }
);

const fetchClassData = () => {
  get(`${adminClass}/${classId}`).then((response: any) => {
    if (response.code === 200) {
      classData.value = response.data;
      students.value = response.data.classStudentResponses || [];
    } else {
      throw new Error("Failed to fetch class details");
    }
  });
};

onMounted(() => {
  fetchClassData();
});
</script>

<style scoped>
:deep(.ant-descriptions-item-label) {
  background-color: rgb(254 242 242);
  color: rgb(220 38 38);
}

:deep(.ant-btn-primary) {
  background-color: #ff4d4f;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff7875;
}

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

:deep(.ant-card-body) {
  padding: 1.5rem;
}
</style>
