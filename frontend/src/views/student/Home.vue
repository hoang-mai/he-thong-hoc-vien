<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-red-600 mb-2">Bảng Điểm Sinh Viên</h1>
      <p class="text-gray-600">Xem điểm số các môn học của bạn</p>
    </div>

    <a-table
      :dataSource="gradesData"
      :columns="columns"
      :pagination="pagination"

      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'className'">
          <span class="font-medium text-red-700">{{ record.className }}</span>
        </template>
        <template v-if="column.key === 'midtermGrade'">
          <span >
            {{ formatGrade(record.midtermGrade) }}
          </span>
        </template>
        <template v-if="column.key === 'finalExamGrade'">
          <span >
            {{ formatGrade(record.finalExamGrade) }}
          </span>
        </template>
        <template v-if="column.key === 'finalGrade'">
          <span
            
            class="font-semibold"
          >
            {{ formatGrade(record.finalGrade) }}
          </span>
        </template>
        <template v-if="column.key === 'finalTermWeight'">
          <span class="text-gray-600">
            {{ (record.finalTermWeight ) }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import { get } from "@/services/callApi";
import { toast } from "vue3-toastify";
import { studentGetAllGrades } from "@/services/api";

interface GradeData {
  classId: number;
  className: string;
  midtermGrade: number;
  finalExamGrade: number;
  finalTermWeight: number;
  finalGrade: number;
}

interface GradeResponse {
  data: GradeData[];
  paging: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const gradesData = ref<GradeData[]>([]);

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
    title: "Tên Lớp",
    dataIndex: "className",
    key: "className",
    width: 200,
    fixed: "left",
  },
  {
    title: "Điểm Giữa Kỳ",
    key: "midtermGrade",
    width: 150,
    align: "center",
  },
  {
    title: "Điểm Cuối Kỳ",
    key: "finalExamGrade",
    width: 150,
    align: "center",
  },
  {
    title: "Trọng Số Cuối Kỳ",
    key: "finalTermWeight",
    width: 150,
    align: "center",
  },
  {
    title: "Điểm Tổng Kết",
    key: "finalGrade",
    width: 150,
    align: "center",
  },
];

const formatGrade = (grade: number): string => {
  if (grade === null || grade === undefined) return "Chưa có điểm";
  return grade.toFixed(1);
};


const handleTableChange = (paginationInfo: {
  current: number;
  pageSize: number;
}) => {
  loadGradesData(paginationInfo.current, paginationInfo.pageSize);
};

const loadGradesData = async (page: number, size: number) => {
  try {
    // Replace with your actual API endpoint
    const response = await get(studentGetAllGrades, {
      page: page - 1,
      size: size,
    });

    if (response.code !== 200) {
      console.error("Failed to load grades data:", response.message);
      toast.error("Không thể tải dữ liệu điểm số");
      return;
    }

    gradesData.value = response.data;
    pagination.total = response.paging.totalElements;
    pagination.current = response.paging.page + 1;
    pagination.pageSize = response.paging.size;
  } catch (error) {
    console.error("Error loading grades:", error);
    toast.error("Có lỗi xảy ra khi tải dữ liệu");

    
  }
};

onMounted(() => {
  loadGradesData(pagination.current, pagination.pageSize);
});
</script>

<style scoped>
.pagination {
  margin-top: 24px;
  text-align: right;
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
