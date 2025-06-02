<template>
  <a-modal v-bind:open="open" @cancel="handleCancel" :width="1000">
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Điểm Danh Học Sinh
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-table
      :dataSource="attendanceData"
      :columns="dynamicColumns"
      :pagination="false"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'studentInfo'">
          <div class="flex items-center">
            <div class="ml-3">
              <div class="font-medium flex items-center">
                {{ record.studentName }}
                <a-tag v-if="record.attendanceHistories?.filter((h: AttendanceHistory) => h.attendanceStatus === 'ABSENT' || h.attendanceStatus === 'LATE').length >= absenceWarningThreshold" 
                      :color="record.attendanceHistories?.filter((h: AttendanceHistory) => h.attendanceStatus === 'ABSENT' || h.attendanceStatus === 'LATE').length >= absenceLimit ? 'red' : 'orange'"
                      class="ml-2 text-xs">
                  {{ record.attendanceHistories?.filter((h: AttendanceHistory) => h.attendanceStatus === 'ABSENT' || h.attendanceStatus === 'LATE').length }}/{{ absenceLimit }}
                </a-tag>
              </div>
              <div class="text-gray-500 text-sm">{{ record.studentEmail }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'todayAttendance'">
          <div>
            <template v-if="getTodayAttendance(record)">
              <a-tag
                :color="getStatusColor(getTodayAttendance(record)!.attendanceStatus)"
              >
                {{
                  getStatusText(getTodayAttendance(record)!.attendanceStatus)
                }}
              </a-tag>
            </template>
            <div v-else>
              <a-select
                placeholder="Chọn trạng thái"
                style="width: 120px"
                v-model:value="
                  formState.attendanceResults.find(
                    (result) => result.classStudentId === record.classStudentId
                  )!.attendanceStatus"
              >
                <a-select-option value="PRESENT">Có mặt</a-select-option>
                <a-select-option value="ABSENT">Vắng mặt</a-select-option>
                <a-select-option value="LATE">Muộn</a-select-option>
                <a-select-option value="EXCUSED">Có phép</a-select-option>
              </a-select>
            </div>
          </div>
        </template>
        <template v-if="column.key && column.key.startsWith('session_')">
          <div class="text-center">
            <template
              v-if="
                getAttendanceForDate(record, column.key.replace('session_', ''))
              "
            >
              <a-tag
                :color="getStatusColor(getAttendanceForDate(record, column.key.replace('session_', ''))!.attendanceStatus)"
              >
                {{
                  getStatusText(
                    getAttendanceForDate(
                      record,
                      column.key.replace("session_", "")
                    )!.attendanceStatus
                  )
                }}
              </a-tag>
            </template>
            <div v-else class="text-gray-400 text-xs">-</div>
          </div>
        </template>
      </template>
    </a-table>
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
        Xác nhận
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { teacherCreateAttendance, teacherGetAttendance } from "@/services/api";
import { get, post } from "@/services/callApi";
import { onMounted, reactive, ref, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";

interface AttendanceHistory {
  attendanceId: number;
  date: string;
  attendanceType: string;
  attendanceStatus: string;
}

interface AttendanceRecord {
  classStudentId: number;
  studentName: string;
  studentEmail: string;
  attendanceHistories: AttendanceHistory[];
}
interface FormState {
  classId: number;
  attendanceType: string;
  date: string;
  attendanceResults: AttendanceResult[];
}
interface AttendanceResult {
  classStudentId: number;
  attendanceStatus: string;
}

const { open, reload, classId, absenceWarningThreshold, absenceLimit } =
  defineProps<{
    open: boolean;
    reload: boolean;
    classId: number;
    absenceWarningThreshold: number;
    absenceLimit: number;
  }>();

const emits = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:reload", value: boolean): void;
}>();

const handleCancel = () => {
  emits("update:open", false);
};

const handleOk = () => {
  toast.promise(
    post(teacherCreateAttendance + `/${classId}`, formState).then(
      (response) => {
        if (response.code === 201) {
          emits("update:open", false);
          emits("update:reload", true);
        } else {
          throw new Error(response.error || "Lỗi khi tạo điểm danh");
        }
      }
    ),
    {
      pending: "Đang tạo điểm danh...",
      success: "Điểm danh đã được tạo thành công!",
      error: "Lỗi khi tạo điểm danh. Vui lòng thử lại.",
    }
  );
};

const attendanceData = ref<AttendanceRecord[]>([]);
const formState = reactive<FormState>({
  classId: classId,
  attendanceType: "MANUAL",
  date: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  attendanceResults: [],
});

const dynamicColumns = ref<TableColumnsType>([]);

const baseColumns: TableColumnsType = [
  {
    title: "Thông tin học sinh",
    dataIndex: "studentInfo",
    key: "studentInfo",
  },
  {
    title: "Điểm danh hôm nay",
    dataIndex: "todayAttendance",
    key: "todayAttendance",
    align: "center",
  },
];

const getAttendanceForDate = (record: AttendanceRecord, dateStr: string) => {
  return record.attendanceHistories?.find(
    (history) => dayjs(history.date).format("HH:mm YYYY-MM-DD") === dateStr
  );
};

const getTodayAttendance = (record: AttendanceRecord) => {
  const today = dayjs().format("HH:mm YYYY-MM-DD");
  return getAttendanceForDate(record, today);
};

const generateDynamicColumns = () => {
  if (attendanceData.value.length === 0) return;

  // Get all unique dates from all attendance histories, excluding today
  const today = dayjs().format("HH:mm YYYY-MM-DD");
  const allDates = new Set<string>();

  attendanceData.value.forEach((record) => {
    if (record.attendanceHistories) {
      record.attendanceHistories.forEach((history) => {
        const historyDate = dayjs(history.date).format("HH:mm YYYY-MM-DD");
        if (historyDate !== today) {
          allDates.add(historyDate);
        }
      });
    }
  });

  // Sort dates in descending order (newest first)
  const sortedDates = Array.from(allDates).sort(
    (a, b) => dayjs(b).valueOf() - dayjs(a).valueOf()
  );
  // Create session columns
  const sessionColumns = sortedDates.map((date) => ({
    title: dayjs(date).format("HH:mm DD/MM/YYYY"),
    dataIndex: `session_${date}`,
    key: `session_${date}`,
    align: "center" as const,
    width: 120,
  }));

  // Combine base columns with session columns
  dynamicColumns.value = [
    baseColumns[0], // Student info (fixed left)
    baseColumns[1], // Today's attendance (fixed left)
    ...sessionColumns, // Session columns (scrollable)
  ];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PRESENT":
      return "green";
    case "ABSENT":
      return "red";
    case "LATE":
      return "orange";
    case "EXCUSED":
      return "blue";
    default:
      return "gray";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PRESENT":
      return "Có mặt";
    case "ABSENT":
      return "Vắng mặt";
    case "LATE":
      return "Muộn";
    case "EXCUSED":
      return "Có phép";
    default:
      return status;
  }
};

const fetchAttendanceData = () => {
  get(teacherGetAttendance + `/${classId}`).then((response) => {
    if (response.code === 200) {
      attendanceData.value = response.data;
      formState.attendanceResults = attendanceData.value.map((record) => ({
        classStudentId: record.classStudentId,
        attendanceStatus: "PRESENT",
      }));
      generateDynamicColumns(); // Generate columns after data is loaded
    } else {
      toast.error("Error fetching attendance data:", response);
    }
  });
};

watch(
  () => reload,
  (newValue) => {
    if (newValue) {
      fetchAttendanceData();
    }
  }
);

onMounted(() => {
  fetchAttendanceData();
});
</script>

<style scoped>
:deep(.ant-btn-primary) {
  background-color: #ff4d4f;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff7875;
}

:deep(.ant-table) {
  border: 1px solid #f0f0f0;
}

:deep(.ant-table-container) {
  overflow-x: auto;
}

:deep(.ant-table-thead > tr > th) {
  background-color: var(--color-bg-red);
  color: #fff;
  white-space: nowrap;
}

:deep(.ant-table-tbody > tr > td) {
  border: 1px solid #f0f0f0;
  white-space: nowrap;
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

:deep(.ant-table-fixed-left) {
  box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15);
}

:deep(.ant-table-fixed-right) {
  box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
}
</style>
