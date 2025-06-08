<template>
  <div class="px-10 py-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-[var(--color-text-red)]">
        Thời khoá biểu
      </h1>
    </div>
    <a-card class="rounded-lg shadow-md">
      <a-config-provider :locale="viVN">
        <a-calendar :fullscreen="false" @panelChange="onPanelChange"
        @select="onSelect" 
        >
          <template #dateCellRender="{ current }">
            <ul class="p-0 m-0 list-none">
              <li
                v-for="item in getListData(current)"
                :key="item.id"
                class="mb-0.5 inline-block mr-1"
              >
                <a-tooltip :title="item.content" color="var(--color-text-red)">
                  <div
                    class="cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    <div
                      class="w-2 h-2 rounded-full transition-all duration-300 ease-in-out"
                      :style="{ backgroundColor: item.color }"
                    ></div>
                  </div>
                </a-tooltip>
              </li>
            </ul>
          </template>
        </a-calendar>
      </a-config-provider>
    </a-card>

    <a-modal
      v-model:visible="modalVisible"
      @cancel="handleCancel"
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
        Lịch học ngày {{ selectedDate ? selectedDate.format("DD/MM/YYYY") : "" }}
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
      <a-list
        v-if="selectedEvents.length"
        :dataSource="selectedEvents"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card
              :bordered="false"
              :style="{ width: '100%', borderLeft: `4px solid ${item.color}` }"
              class="mb-3 schedule-detail-card"
            >
              <div class="flex justify-between">
                <h3 class="font-bold text-lg">{{ item.content }}</h3>
              </div>
              <p><strong>Giảng viên:</strong> {{ item.teacherName }}</p>
              <p><strong>Email:</strong> {{ item.teacherEmail }}</p>
              <p><strong>Phòng:</strong> {{ item.room }}</p>
              <p><strong>Thời gian:</strong> {{ item.timeRange }}</p>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <a-empty v-else description="Không có lịch học cho ngày này" />
      <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel"
      >
        Hủy bỏ
      </button>
      
    </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import viVN from "ant-design-vue/es/locale/vi_VN";
import { get } from "@/services/callApi";
import { studentSchedule, teacherSchedule } from "@/services/api";

// Extend dayjs with plugins
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Define interface for the schedule data structure
interface ScheduleItem {
  classId: number;
  className: string;
  startDate: string;
  endDate: string;
  teacherName: string;
  teacherEmail: string;
  teacherAvatarUrl: string;
  dayOfWeek: string;
  periodStart: number;
  periodEnd: number;
  room: string;
  subjectCode: string;
  subjectName: string;
}

const modalVisible = ref(false);
const selectedDate = ref<Dayjs | null>(null);
const scheduleData = ref<ScheduleItem[]>([]);
const currentMonth = ref(dayjs().month() + 1);
const currentYear = ref(dayjs().year());

// Day of week mapping
const dayOfWeekMap: Record<string, number> = {
  MON: 1,
  TUES: 2,
  WED: 3,
  THUS: 4,
  FRI: 5,
  SAT: 6,
  SUN: 0,
};

// Color palette for different subjects
const subjectColors = [
  "#f50",
  "#2db7f5",
  "#87d068",
  "#722ed1",
  "#fa8c16",
  "#eb2f96",
  "#52c41a",
  "#1890ff",
  "#faad14",
  "#13c2c2",
];
const handleCancel = () => {
  modalVisible.value = false;
  selectedDate.value = null;
};
// Convert period range to time range
const getPeriodTimeRange = (periodStart: number, periodEnd: number): string => {
  const startTime = periodStart;
  const endTime = periodEnd;
  return `Tiết ${startTime} - Tiết ${endTime}`;
};

// Convert day of week string to weekday number
const getDayOfWeekNumber = (dayOfWeek: string): number => {
  return dayOfWeekMap[dayOfWeek] ?? 1;
};

// Check if a schedule item occurs on a specific date
const isScheduleOnDate = (item: ScheduleItem, targetDate: Dayjs): boolean => {
  const startDate = dayjs(item.startDate);
  const endDate = dayjs(item.endDate);
  const targetWeekday = getDayOfWeekNumber(item.dayOfWeek);

  // Check if target date is within the schedule period
  if (targetDate.isBefore(startDate) || targetDate.isAfter(endDate)) {
    return false;
  }

  // Check if target date has the correct weekday
  return targetDate.day() === targetWeekday;
};

// Get schedule items for a specific date with display properties
const getScheduleForDate = (targetDate: Dayjs) => {
  const filtered = scheduleData.value.filter((item) =>
    isScheduleOnDate(item, targetDate)
  );

  const result = filtered.map((item, index) => ({
    ...item,
    id: `${item.classId}-${targetDate.format("YYYY-MM-DD")}`,
    color: subjectColors[index % subjectColors.length],
    content: `${item.subjectName} (${item.className})`,
    timeRange: getPeriodTimeRange(item.periodStart, item.periodEnd),
    targetDate: targetDate,
  }));
  return result;
};

// Fetch schedule data
const fetchScheduleData = async (month: number, year: number) => {
  try {
    const response = await get(studentSchedule, {
      month,
      year,
    });

    if (response && response.data) {
      scheduleData.value = response.data;
    } else {
      scheduleData.value = [];
    }
  } catch (error) {
    scheduleData.value = [];
  }
};

const onSelect = (date: Dayjs) => {
  selectedDate.value = date;
  modalVisible.value = true;
};

// Get events for a specific date
const getListData = (value: Dayjs) => {
  return getScheduleForDate(value);
};

// Computed property for selected date events
const selectedEvents = computed(() => {
  if (!selectedDate.value) return [];
  const events = getScheduleForDate(selectedDate.value);
  return events;
});

const onPanelChange = (date: Dayjs) => {
  const newMonth = date.month() + 1;
  const newYear = date.year();

  // Only fetch new data if month or year has changed
  if (newMonth !== currentMonth.value || newYear !== currentYear.value) {
    currentMonth.value = newMonth;
    currentYear.value = newYear;
    fetchScheduleData(newMonth, newYear);
  }
};

// For a-list rendering - not actually used due to template rendering
const renderItem = () => {};

// Initialize component
onMounted(() => {
  fetchScheduleData(currentMonth.value, currentYear.value);

});
</script>

<style scoped>
:deep(.ant-picker-calendar-date-content) {
  height: 1rem; /* further reduced for icon-only display */
  overflow-y: visible;
  display: flex;
  align-items: center;
}

:deep(.ant-picker-calendar-header) {
  margin-bottom: 1rem; /* equivalent to mb-4 */
}

:deep(.ant-picker-calendar-date) {
  padding: 0.125rem; /* reduced from 0.25rem */
  transition: background-color 0.2s ease;
}

:deep(.ant-picker-cell-selected .ant-picker-calendar-date::after),
:deep(.calendar-cell-selected .ant-picker-calendar-date::after) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(245, 34, 45, 0.6);
  border-radius: 2px;
  pointer-events: none;
}

:deep(.ant-radio-button-wrapper) {
  display: none;
}

:deep(.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner),
:deep(
    .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner
  ),
:deep(
    .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner
  ) {
  color: #fff;
  background: var(--color-text-red) !important;
}

:deep(
    .ant-picker-cell-in-view.ant-picker-cell-today
      .ant-picker-cell-inner::before
  ) {
  border-color: var(--color-text-red) !important;
}
</style>
