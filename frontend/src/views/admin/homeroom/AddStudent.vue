<template>
  <a-modal v-bind:open="open" :width="600" @cancel="handleCancel">
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Thêm học sinh
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-form>
      <a-form-item name="studentName" :label="'Tên học sinh'">
        <div class="relative" ref="searchContainerRef">
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
            class="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <ul class="py-2">
              <li
                v-for="(result, index) in searchResult"
                :key="index"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                @click="handleSelectResult(result)"
              >
                <div
                  class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white)"
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
      </a-form-item>
      <a-form-item
        v-if="selectedStudents.length > 0"
        label="Học sinh "
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <div class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
          <div
            v-for="(student, index) in selectedStudents"
            :key="student.studentId"
            class="flex items-center justify-between gap-2 p-2 border rounded border-gray-200 hover:bg-gray-50"
          >
            <div class="flex items-center gap-2 flex-1 overflow-hidden">
              <div
                class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white) flex-shrink-0"
              >
                <img
                  v-if="student.avatarUrl"
                  :src="student.avatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover rounded-full"
                />
                <UserOutlined v-else />
              </div>
              <div class="flex flex-col overflow-hidden">
                <span class="font-medium text-gray-800 truncate">{{
                  student.fullName
                }}</span>
                <span class="text-sm text-gray-500 truncate">{{
                  student.email
                }}</span>
              </div>
            </div>
            <a-button
              type="text"
              class="text-red-500 flex-shrink-0"
              @click="removeStudent(index)"
            >
              <CloseOutlined />
            </a-button>
          </div>
        </div>
      </a-form-item>
    </a-form>
    
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
        Thêm học sinh
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
interface SearchResult {
  studentId: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}
import { adminAddStudentToHomeRoom, adminSearchStudent } from "@/services/api";
import { get, post } from "@/services/callApi";
import debounce from "lodash/debounce";
import { onMounted, onUnmounted, ref } from "vue";
import {
  CloseOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { toast } from "vue3-toastify";
const { open, homeroomId } = defineProps<{
  open: boolean;
  reload: boolean;
  homeroomId: number;
}>();
const emit = defineEmits(["update:open", "update:reload"]);
const searchQuery = ref<string>("");
const searchResult = ref<SearchResult[]>([]);
const selectedStudents = ref<SearchResult[]>([]);
const searchContainerRef = ref<HTMLElement | null>(null);

const handleCancel = () => {
  emit("update:open", false);
  selectedStudents.value = [];
  searchQuery.value = "";
};

const handleOk = () => {
  if (selectedStudents.value.length === 0) {
    toast.warning("Vui lòng chọn ít nhất một học sinh");
    return;
  }
  toast.promise(
    post(adminAddStudentToHomeRoom, {
      studentIds: selectedStudents.value.map((student) => student.studentId),
      homeroomId: homeroomId,
      status: "ANTICIPATED"
    }).then((res) => {
      if (res.code !== 201) {
        throw new Error("Thêm học sinh thất bại");
      }
      emit("update:reload", true);
      emit("update:open", false);
      selectedStudents.value = [];
      searchQuery.value = "";
    }),
    {
      pending: "Đang thêm học sinh...",
      success: "Thêm học sinh thành công",
      error: "Thêm học sinh thất bại",
    }
  );
  selectedStudents.value = [];
  searchQuery.value = "";
};

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
  const alreadySelected = selectedStudents.value.some(
    (student) => student.studentId === result.studentId
  );

  if (!alreadySelected) {
    selectedStudents.value.push(result);
    searchQuery.value = "";
    searchResult.value = [];
  } else {
    toast.info("Học sinh này đã được chọn");
  }
};

const removeStudent = (index: number) => {
  selectedStudents.value.splice(index, 1);
};
</script>
