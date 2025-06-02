<template>
  <div class="p-6">
    <a-table
      :dataSource="processedData"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'className'">
          <span class="font-medium">{{ record.className }}</span>
        </template>
        <template v-if="column.key === 'midtermSchedule'">
          <div v-if="record.midtermSchedule">

              {{ formatDate(record.midtermSchedule.date) }}

          </div>
          <span v-else class="text-gray-400">Chưa có lịch</span>
        </template>
        <template v-if="column.key === 'finalSchedule'">
          <div v-if="record.finalSchedule">
           
              {{ formatDate(record.finalSchedule.date) }}

          </div>
          <span v-else class="text-gray-400">Chưa có lịch</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { get } from "@/services/callApi";
import { adminScheduleExam } from "@/services/api";
import { toast } from "vue3-toastify";

interface ClassScheduleResponse {
  examinationId: number;
  examinationType: "MIDTERM" | "FINAL";
  date: string;
}

interface ScheduleExamData {
  classId: number;
  className: string;
  classScheduleResponses: ClassScheduleResponse[];
}

const scheduleData = ref<ScheduleExamData[]>([]);

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
  },
  {
    title: "Lịch Giữa Kỳ",
    key: "midtermSchedule",
    width: 250,
  },
  {
    title: "Lịch Cuối Kỳ",
    key: "finalSchedule",
    width: 250,
  },
];

const processedData = computed(() => {
  return scheduleData.value.map((item) => {
    const midtermSchedule = item.classScheduleResponses.find(
      (schedule) => schedule.examinationType === "MIDTERM"
    );
    const finalSchedule = item.classScheduleResponses.find(
      (schedule) => schedule.examinationType === "FINAL"
    );

    return {
      classId: item.classId,
      className: item.className,
      midtermSchedule,
      finalSchedule,
    };
  });
});

const formatDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

const handleTableChange = (paginationInfo: {
  current: number;
  pageSize: number;
}) => {
  loadSampleData(paginationInfo.current, paginationInfo.pageSize);
};

// Sample data for demonstration
const loadSampleData = (page: number, size: number) => {
  get(adminScheduleExam, {
    page: page - 1,
    size: size,
  }).then((response) => {
    if (response.code !== 200) {
      console.error("Failed to load schedule data:", response.message);
      toast.error("Không thể tải dữ liệu lịch thi");
      return;
    }
    scheduleData.value = response.data;
    pagination.total = response.paging.totalElements;
    pagination.current = response.paging.page + 1;
    pagination.pageSize = response.paging.size;
  });
};

onMounted(() => {
  loadSampleData(pagination.current, pagination.pageSize);
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
