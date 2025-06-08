<template>
  <div class="p-6">

    <a-table
      :dataSource="tuitions"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      class="hover:cursor-pointer"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'tuitionStatus'">
          <a-tag :color="record.tuitionStatus === 'PAID' ? 'green' : record.tuitionStatus === 'PROCESSING' ? 'orange' : 'red'">
            {{
              record.tuitionStatus === "PAID"
                ? "Đã Thanh Toán"
                : record.tuitionStatus === "PROCESSING"
                ? "Đang Xử Lý"
                : "Chưa Thanh Toán"
            }}
          </a-tag>
        </template>
        <template v-if="column.key === 'tuition'">
          {{ formatCurrency(record.tuition) }}
        </template>
        
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import { EditOutlined, CheckOutlined } from "@ant-design/icons-vue";
import { toast } from "vue3-toastify";
import { studentGetAllTuitions } from "@/services/api";
import { get } from "@/services/callApi";

const { studentId } = defineProps<{
  studentId: number;
}>();

// studentId can be used to filter tuitions for specific student

interface TuitionRecord {
  id: number;
  className: string;
  tuition: number;
  tuitionStatus: "PAID" | "UNPAID" | 'PROCESSING';
}

interface TuitionResponse {
  data: TuitionRecord[];
  paging: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const tuitions = ref<TuitionRecord[]>([]);

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
  },
  {
    title: "Học Phí",
    dataIndex: "tuition",
    key: "tuition",
  },
  {
    title: "Trạng Thái",
    dataIndex: "tuitionStatus",
    key: "tuitionStatus",
  },
  
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const handleTableChange = (paginationInfo: {
  current: number;
  pageSize: number;
}) => {
  fetchTuitions(paginationInfo.current, paginationInfo.pageSize);
};


const fetchTuitions = async (page: number, size: number) => {
  
    get(studentGetAllTuitions, {
      page: page - 1,
      size: size,
    }).then((res) => {
      if (res.code !== 200) {
        toast.error(res.message || "Lỗi khi tải dữ liệu học phí");
        throw new Error(res.message);
      }
      tuitions.value = res.data;
      pagination.total = res.paging.totalElements;
      pagination.current = res.paging.page + 1;
      pagination.pageSize = res.paging.size;
    });
    
};

onMounted(() => {
  fetchTuitions(pagination.current, pagination.pageSize);
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

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fff;
}

.summary-card h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.summary-card .amount {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.summary-card.total .amount {
  color: #1890ff;
}

.summary-card.paid .amount {
  color: #52c41a;
}

.summary-card.unpaid .amount {
  color: #ff4d4f;
}
</style>
