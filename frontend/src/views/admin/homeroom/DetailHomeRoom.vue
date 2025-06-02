<template>
  <div class="p-5">
    <a-card class="mb-6">
      <a-row>
        <a-col :span="24">
          <h2 class="text-xl font-bold text-red-700 mb-6">
            Chi Tiết Lớp Chủ Nhiệm
          </h2>
        </a-col>
      </a-row>

      <div v-if="homeroom">
        <a-row :gutter="[16, 16]">
          <!-- Basic Information -->
          <a-col :xs="24" :md="12">
            <a-card
              class="h-full shadow-sm hover:shadow-md transition-shadow"
              :bodyStyle="{ padding: '16px' }"
            >
              <template #title>
                <div class="flex items-center">
                  <span class="text-red-700 font-semibold"
                    >Thông tin cơ bản</span
                  >
                </div>
              </template>
              <div class="flex items-center mb-4">
                <div
                  class="w-10 h-10 flex items-center justify-center bg-red-50 rounded-full mr-3"
                >
                  <i class="fas fa-school text-red-700"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Tên lớp</p>
                  <p class="font-bold text-lg">{{ homeroom.name }}</p>
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full mr-3"
                >
                  <img
                    v-if="homeroom.teacherAvatarUrl"
                    :src="homeroom.teacherAvatarUrl"
                    class="w-8 h-8 rounded-full"
                    alt="Teacher"
                  />
                  <i v-else class="fas fa-user-tie text-blue-600"></i>
                </div>
                <div>
                  <p class="font-bold">{{ homeroom.teacherName }}</p>
                  <p class="text-gray-500 text-sm">
                    {{ homeroom.teacherEmail }}
                  </p>
                </div>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-card
              class="h-full shadow-sm hover:shadow-md transition-shadow"
              :bodyStyle="{ padding: '16px' }"
            >
              <template #title>
                <div class="flex items-center">
                  <span class="text-red-700 font-semibold">Thời gian</span>
                </div>
              </template>
              <div class="space-y-4">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 flex items-center justify-center bg-green-50 rounded-full mr-3"
                  >
                    <i class="fas fa-calendar-plus text-green-600"></i>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Ngày tạo</p>
                    <p class="font-medium">
                      {{ formatDate(homeroom.createdAt) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-full mr-3"
                  >
                    <i class="fas fa-calendar-check text-amber-600"></i>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">Ngày cập nhật</p>
                    <p class="font-medium">
                      {{ formatDate(homeroom.updatedAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>

          <!-- Students Statistics -->
          <a-col :xs="24">
            <a-card class="shadow-sm hover:shadow-md transition-shadow">
              <template #title>
                <p class="text-red-700 font-semibold">Thống kê học sinh</p>
              </template>
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="12" :md="6">
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-3xl font-bold">
                      {{ homeroom.totalStudents }}
                    </div>
                    <div class="text-gray-600">Tổng Số Học Sinh</div>
                  </div>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6">
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-3xl font-bold text-blue-600">
                      {{ homeroom.anticipatedStudents }}
                    </div>
                    <div class="text-blue-600">Học Sinh Đang học</div>
                  </div>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6">
                  <div class="text-center p-4 bg-red-50 rounded-lg">
                    <div class="text-3xl font-bold text-red-700">
                      {{ homeroom.expelledStudents }}
                    </div>
                    <div class="text-red-700">Học Sinh Bị Đuổi</div>
                  </div>
                </a-col>
                <a-col :xs="24" :sm="12" :md="6">
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-3xl font-bold text-green-600">
                      {{ homeroom.graduatedStudents }}
                    </div>
                    <div class="text-green-600">Học Sinh Đã Tốt Nghiệp</div>
                  </div>
                </a-col>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <a-divider />

      <div class="flex flex-col">
        <h3 class="text-lg font-semibold text-red-700 my-4">
          Danh Sách Học Sinh
        </h3>
        <div class="mb-4">
          <button
            @click="showAddStudentModal = true"
            class="flex items-center bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition duration-200"
          >
            <PlusOutlined class="mr-1" />
            <span>Thêm học sinh</span>
          </button>
        </div>
        <a-table
          :dataSource="homeroom?.students || []"
          :columns="columns"
          rowKey="id"
          :pagination="pagination"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'studentInfo'">
              <div class="flex items-center">
                <div
                  class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white)"
                >
                  <img
                    v-if="record.studentAvatarUrl"
                    :src="record.studentAvatarUrl"
                    alt="Avatar"
                    class="w-full h-full object-cover rounded-full"
                  />
                  <UserOutlined v-else />
                </div>
                <div class="ml-3">
                  <div class="font-medium">{{ record.studentName }}</div>
                  <div class="text-gray-500 text-sm">
                    {{ record.studentEmail }}
                  </div>
                </div>
              </div>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ convertStatusToName(record.status) }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                type="link"
                class="!text-green-700 !hover:text-green-500"
                @click="
                  showEditStudentModal = true;
                  selectedStudent = record;
                  statusClone = record.status;
                "
              >
                <EditOutlined /> Sửa
              </a-button>
              <a-button
                type="link"
                class="!text-red-700 !hover:text-red-500"
                @click="
                  showDeleteStudentModal = true;
                  selectedStudent = record;
                "
              >
                <DeleteOutlined /> Xóa
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
    :homeroomId="homeRoomId"
  />
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
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Xóa học sinh
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <p class="text-center text-gray-700">
      Bạn có chắc chắn muốn xóa học sinh
      <strong class="text-red-600">{{ selectedStudent.studentName }}</strong>
      khỏi lớp chủ nhiệm này không?
    </p>
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
        Xóa học sinh
      </button>
    </template>
  </a-modal>
  <a-modal
    v-if="showEditStudentModal && selectedStudent && statusClone"
    v-model:open="showEditStudentModal"
    @cancel="showEditStudentModal = false"
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
        Cập nhật học sinh
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <div class="p-4">
      <div class="mb-4">
        <div class="text-gray-700 mb-2 font-medium">Thông tin học sinh</div>
        <div class="flex items-center mb-4">
          <div
            class="w-10 h-10 text-(--color-text-white) bg-red-600 rounded-full flex items-center justify-center mr-3"
          >
            <img
              v-if="selectedStudent?.studentAvatarUrl"
              :src="selectedStudent.studentAvatarUrl"
              alt="Avatar"
              class="w-full h-full object-cover rounded-full"
            />
            <UserOutlined v-else />
          </div>
          <div>
            <div class="font-medium">{{ selectedStudent?.studentName }}</div>
            <div class="text-gray-500 text-sm">
              {{ selectedStudent?.studentEmail }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <div class="text-gray-700 mb-2 font-medium">Trạng thái</div>
        <a-select
          v-model:value="statusClone"
          style="width: 100%"
          :options="[
            { value: 'ANTICIPATED', label: 'Đang học', color: 'blue' },
            { value: 'EXPELLED', label: 'Bị đuổi', color: 'red' },
            { value: 'GRADUATED', label: 'Đã tốt nghiệp', color: 'green' },
          ]"
        >
          <template #option="{ label, color }">
            <a-tag :color="color">{{ label }}</a-tag>
          </template>
        </a-select>
      </div>
    </div>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancelEdit"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleOkEdit"
      >
        Cập nhật học sinh
      </button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { del, get, put } from "@/services/callApi";
import { adminHomeRoom } from "@/services/api";
import { toast } from "vue3-toastify";
import { PlusOutlined, UserOutlined } from "@ant-design/icons-vue";
import AddStudent from "./AddStudent.vue";

// Define interfaces
interface Student {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentAvatarUrl: string;
  studentCode: string;
  status: HomeRoomStatus;
  statusName: string;
  createdAt: string;
  updatedAt: string;
}

interface HomeRoom {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  teacherEmail: string;
  teacherAvatarUrl: string;
  totalStudents: number;
  anticipatedStudents: number;
  expelledStudents: number;
  graduatedStudents: number;
  createdAt: string;
  updatedAt: string;
  students: Student[];
}

// Get the homeroom ID from route params
const route = useRoute();
const homeRoomId = Number(route.params.homeRoomId);
const homeroom = ref<HomeRoom | null>(null);
const showAddStudentModal = ref(false);
const reload = ref(false);
const showDeleteStudentModal = ref(false);
const showEditStudentModal = ref(false);
const selectedStudent = ref<Student | null>(null);
const statusClone = ref<string | null>(null);

// Table columns
const columns = [
  {
    title: "Thông tin học sinh",
    dataIndex: "studentInfo",
    key: "studentInfo",
  },
  {
    title: "Trang thái",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: "Ngày cập nhật",
    dataIndex: "updatedAt",
    key: "updatedAt",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: "Hành động",
    key: "action",
  },
];
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `Tổng ${total} mục`,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "50"],
  locale: {
    items_per_page: " / trang",
  },
});
// Utility functions
const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format("DD-MM-YYYY");
};
watch(
  () => reload.value,
  (newValue) => {
    if (newValue) {
      fetchHomeRoomData();
      reload.value = false;
    }
  }
);

const convertStatusToName = (status: string) => {
  switch (status) {
    case "ANTICIPATED":
      return "Đang học";
    case "EXPELLED":
      return "Bị đuổi";
    case "GRADUATED":
      return "Đã tốt nghiệp";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ANTICIPATED":
      return "blue";
    case "EXPELLED":
      return "red";
    case "GRADUATED":
      return "green";
    default:
      return "default";
  }
};
const fetchHomeRoomData = () => {
  get(adminHomeRoom + `/${homeRoomId}`).then((res) => {
    if (res.code !== 200) {
      toast.error("Lấy dữ liệu thất bại, vui lòng thử lại");
      throw new Error(res.message);
    }
    homeroom.value = res.data;
    pagination.total = res.data.students.length;
  });
};

const handleCancel = () => {
  showDeleteStudentModal.value = false;
};

const handleOk = () => {
  if (!selectedStudent.value) return;
  toast.promise(
    del(adminHomeRoom + "/students", {
      studentId: selectedStudent.value.studentId,
      homeroomId: homeRoomId,
    }).then((res) => {
      if (res.code !== 202) {
        throw new Error("Xóa học sinh thất bại");
      }
      showDeleteStudentModal.value = false;
      reload.value = true;
      selectedStudent.value = null;
      fetchHomeRoomData();
    }),
    {
      pending: "Đang xóa học sinh...",
      success: "Xóa học sinh thành công!",
      error: "Xóa học sinh thất bại!",
    }
  );
};
const handleCancelEdit = () => {
  showEditStudentModal.value = false;
};
const handleOkEdit = () => {
  if (!selectedStudent.value || !statusClone.value) return;
  toast.promise(
    put(
      adminHomeRoom +
        `/students/${homeRoomId}/${selectedStudent.value.studentId}/status`,
      {
        status: statusClone.value,
      }
    ).then((res) => {
      if (res.code !== 202) {
        throw new Error("Cập nhật học sinh thất bại");
      }
      showEditStudentModal.value = false;
      reload.value = true;
      selectedStudent.value = null;
      fetchHomeRoomData();
    }),
    {
      pending: "Đang cập nhật học sinh...",
      success: "Cập nhật học sinh thành công!",
      error: "Cập nhật học sinh thất bại!",
    }
  );
};
onMounted(() => {
  fetchHomeRoomData();
});
</script>

<style scoped>
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
