<template>
  <div class="border border-gray-200 rounded-lg m-4">
    <div class="relative flex justify-start ml-6 mt-4" ref="searchContainerRef">
      <div class="w-full max-w-md">
        <p class="text-start mb-2 text-(--color-text-red)">Tìm kiếm học sinh</p>
        <a-input-search
          :size="'large'"
          v-model:value="searchQuery"
          :style="{
            borderColor: 'var(--color-border-gray)',
          }"
          class=""
          @focus="(e: Event) => ((e.target as HTMLInputElement).style.borderColor = 'var(--color-border-gray)')"
          @blur="(e: Event) => ((e.target as HTMLInputElement).style.borderColor = 'var(--color-border-gray)')"
          :placeholder="'Tên học sinh'"
          @search="handleSearch"
          @input="(e: Event) => handleSearchNow((e.target as HTMLInputElement).value)"
        >
          <template #enterButton>
            <a-button
              type="primary"
              class="!w-8 sm:!w-9 md:!p-1"
              style="
                background-color: var(--color-border-gray);
                border-color: var(--color-border-gray);
              "
            >
              <SearchOutlined class="!text-[var(--color-text-red)] text-lg" />
            </a-button>
          </template>
        </a-input-search>
        <!-- Search Results Dropdown -->
        <div
          v-if="searchQuery && searchResult.length > 0"
          class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          <ul class="py-2">
            <li
              v-for="(result, index) in searchResult"
              :key="index"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0"
              @click="handleSelectResult(result)"
            >
              <div
                class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white) border border-gray-300"
              >
                <img
                  v-if="result.avatarUrl"
                  :src="result.avatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover rounded-full"
                />
                <UserOutlined v-else />
              </div>
              <div class="flex flex-col">
                <span class="font-medium text-gray-800">{{
                  result.fullName
                }}</span>
                <span class="text-sm text-gray-500">{{ result.email }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Selected Student Display -->
    <div v-if="selectedStudents" class="mx-6 mt-4 mb-6">
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-start mb-3 text-(--color-text-red) font-medium">
          Học sinh đã chọn
        </p>
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white) border border-gray-300"
          >
            <img
              v-if="selectedStudents.avatarUrl"
              :src="selectedStudents.avatarUrl"
              alt="Avatar"
              class="w-full h-full object-cover rounded-full"
            />
            <UserOutlined v-else class="text-xl" />
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800 text-lg">{{
              selectedStudents.fullName
            }}</span>
            <span class="text-sm text-gray-600">{{
              selectedStudents.email
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Tab Navigation -->
    <div class="flex justify-center mt-6 mb-4">
      <a-tabs v-model:activeKey="tab" centered>
        <a-tab-pane key="all" tab="Tất cả học phí" />
        <a-tab-pane key="notPaid" tab="Chưa thanh toán" />
      </a-tabs>
    </div>
    <Tuition
      v-if="selectedStudents && tab === 'all'"
      :studentId="selectedStudents.studentId"
      :key="selectedStudents.studentId"
    />
    <TuitionNotPaid
      v-else-if="selectedStudents && tab === 'notPaid'"
      :studentId="selectedStudents.studentId"
    />
  </div>
</template>
<script setup lang="ts">
interface SearchResult {
  studentId: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}
type TabType = "all" | "notPaid";
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import { SearchOutlined, UserOutlined } from "@ant-design/icons-vue";
import { get } from "@/services/callApi";
import { adminSearchStudent } from "@/services/api";
import { toast } from "vue3-toastify";
import debounce from "lodash/debounce";
import Tuition from "./Tuition.vue";
import TuitionNotPaid from "./TuitionNotPaid.vue";
const searchQuery = ref<string>("");
const searchResult = ref<SearchResult[]>([]);
const selectedStudents = ref<SearchResult | null>(null);
const searchContainerRef = ref<HTMLElement | null>(null);
const tab = ref<TabType>("all");
const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainerRef.value &&
    !searchContainerRef.value.contains(event.target as Node)
  ) {
    searchResult.value = [];
  }
};

// Add/remove event listeners for click outside
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const handleSearchNow = (value: string) => {
  if (!value) {
    searchResult.value = [];
    return;
  }

  get(adminSearchStudent, { query: value })
    .then((res) => {
      if (res.code !== 200) {
        toast.error("Tìm kiếm thất bại");
        return;
      }
      searchResult.value = res.data;
    })
    .catch(() => {
      searchResult.value = [];
    });
};

const handleSearch = debounce(handleSearchNow, 500);

const handleSelectResult = (result: SearchResult) => {
  // Check if student is already selected
  if (
    selectedStudents.value &&
    selectedStudents.value.studentId === result.studentId
  ) {
    toast.info("Học sinh này đã được chọn");
    return;
  }
  selectedStudents.value = result;
  searchQuery.value = "";
  searchResult.value = [];
};
</script>
<style lang="css" scoped>
:deep(.ant-tabs-tab-active .ant-tabs-tab-btn),
:deep(.ant-tabs-tab:hover) {
  color: var(--color-text-red) !important;
}
:deep(.ant-tabs-ink-bar){
  background: var(--color-text-red) !important;
}
</style>
