<template>
  <div class="p-6">
    <div class="mb-4">
      <a-button
        type="primary"
        danger
        @click="showCreateClassModal = true"
        class="!flex !items-center"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        Tạo lớp học
      </a-button>
    </div>
    <a-table
      :dataSource="classes"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :customRow="(record: Class) => ({
                onClick: () => handleRowClick(record),
            })
                "
      class="hover:cursor-pointer"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'teacherInfo'">
          <div class="flex items-center">
            <img
              v-if="record.teacherAvatarUrl"
              :src="record.teacherAvatarUrl"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div
              v-else
              class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white)"
            >
              <UserOutlined class="text-2xl text-white" />
            </div>

            <div class="ml-3">
              <div class="font-medium">{{ record.teacherFullName }}</div>
              <div class="text-gray-500 text-sm">{{ record.teacherEmail }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'subjectInfo'">
          <div>{{ record.subjectName }}</div>
        </template>
        <template v-if="column.key === 'dateInfo'">
          <div>
            {{ formatDate(record.startDate) }}

          </div>
          <div class="">
            {{ formatDate(record.endDate) }}
          </div>
        </template>
        <template v-if="column.key === 'tuitionInfo'">
          <div>{{ formatCurrency(record.tuition) }}</div>
          <div class="text-sm text-gray-500">
            Hạn: {{ formatDate(record.tuitionDueDate) }}
          </div>
        </template>
        <template v-if="column.key === 'dayOfWeekInfo'">
          <div>{{ convertDaysOfWeekToString(record.dayOfWeek) }} - Phòng {{ record.room }}</div>
          <div class="text-sm text-gray-500">
            Tiết {{ record.periodStart }} - Tiết {{ record.periodEnd }}
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <CreateClass
    v-if="showCreateClassModal"
    v-model:open="showCreateClassModal"
    v-model:reload="reload"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { get } from "@/services/callApi";
import { useRouter } from "vue-router";
import {
  PlusOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { adminGetAllClasses } from "@/services/api";
import { toast } from "vue3-toastify";

// Import the components
import CreateClass from "./CreateClass.vue";

interface Class {
  id: number;
  className: string;
  teacherId: number;
  teacherFullName: string;
  teacherEmail: string;
  teacherAvatarUrl: string;
  subjectId: number;
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
}

const classes = ref<Class[]>([]);
const showCreateClassModal = ref(false);
const reload = ref(false);
const router = useRouter();
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

const columns: TableColumnsType = [
  {
    title: "Tên lớp",
    dataIndex: "className",
    key: "className",
  },
  {
    title: "Thông tin giáo viên",
    dataIndex: "teacherInfo",
    key: "teacherInfo",
  },
  {
    title: "Môn học",
    dataIndex: "subjectInfo",
    key: "subjectInfo",
  },
  {
    title: "Ngày bắt đầu - kết thúc",
    dataIndex: "dateInfo",
    key: "dateInfo",
  },
  {
    title: "Số lượng học sinh",
    dataIndex: "studentCount",
    key: "studentCount",

  },
  {
    title: "Trọng số",
    dataIndex: "finalTermWeight",
    key: "finalTermWeight",

  },
  {
    title: "Ngày học",
    dataIndex: "dayOfWeekInfo",
    key: "dayOfWeekInfo",
  },
  {
    title: "Học phí",
    dataIndex: "tuitionInfo",
    key: "tuitionInfo",
  }
];

watch(
  () => reload.value,
  (newValue) => {
    if (newValue) {
      fetchClasses(pagination.current, pagination.pageSize);
      reload.value = false;
    }
  }
);

const formatDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const handleTableChange = (pagination: {
  current: number;
  pageSize: number;
}) => {
  fetchClasses(pagination.current, pagination.pageSize);
};

const handleRowClick = (record: Class) => {
  router.push({
    name: "adminClass",
    params: {
      classId: record.id,
    },
  });
};


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

const fetchClasses = (page: number, size: number) => {
  get(adminGetAllClasses, {
    page: page - 1,
    size: size,
  }).then((res: any) => {
    if (res.code !== 200) {
      toast.error(res.message || "Lỗi khi tải dữ liệu lớp học");
      throw new Error(res.message);
    }
    classes.value = res.data;
    pagination.total = res.paging.totalElements;
    pagination.current = res.paging.page + 1;
    pagination.pageSize = res.paging.size;
  });
};

onMounted(() => {
  fetchClasses(pagination.current, pagination.pageSize);
});
</script>

<style scoped>
.pagination {
  margin-top: 24px;
  text-align: right;
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
</style>
