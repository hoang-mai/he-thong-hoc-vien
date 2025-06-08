<template>
  <a-modal v-bind:open="open" @ok="handleOk" @cancel="handleCancel">
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>

    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Tạo Lớp Chủ Nhiệm Mới
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-form
      :model="formState"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item name="name">
        <template #label>
          <span class="text-[#ff4d4f]">*</span>
          <span>Tên lớp</span>
        </template>
        <a-input v-model:value="formState.name" :size="'large'" />
      </a-form-item>
      <a-form-item name="teacherName">
        <template #label>
          <span class="text-[#ff4d4f]">*</span>
          <span>Tên giáo viên</span>
        </template>
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
            :placeholder="'Tên giáo viên'"
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
        v-if="selectedResult"
        label="Giáo viên đã chọn"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <div class="flex items-center gap-2 p-2 border rounded border-gray-200">
          <div
            class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white)"
          >
            <img
              v-if="selectedResult.avatarUrl"
              :src="selectedResult.avatarUrl"
              alt="Avatar"
              class="w-full h-full object-cover rounded-full"
            />
            <UserOutlined v-else />
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">{{
              selectedResult.fullName
            }}</span>
            <span class="text-sm text-gray-500">{{
              selectedResult.email
            }}</span>
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
        Tạo Lớp Học
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { get, post } from "@/services/callApi";
import { adminCreateHomeRoom, adminSearchTeacher } from "@/services/api";
import { toast } from "vue3-toastify";
import debounce from "lodash/debounce";
interface SearchResult {
  teacherId: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}
interface FormState {
  name: string;
  teacherId: string;
}

const convertRole = (role: Role) => {
  switch (role) {
    case "STUDENT":
      return "Học sinh";
    case "TEACHER":
      return "Giáo viên";
    case "ADMIN":
      return "Quản trị viên";
    default:
      return role;
  }
};
const searchQuery = ref<string>("");
const searchResult = ref<SearchResult[]>([]);
const searchContainerRef = ref<HTMLElement | null>(null);
const selectedResult = ref<SearchResult | null>(null);
const { open } = defineProps<{
  open: boolean;
  reload: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", open: boolean): void;
  (e: "update:reload", reload: boolean): void;
}>();

const formState = reactive<FormState>({
  name: "",
  teacherId: "",
});

const rules = {
  name: [{ required: true, message: "Vui lòng tên lớp" }],
};

const handleSelectResult = (teacher: SearchResult) => {
  selectedResult.value = teacher;
  formState.teacherId = teacher.teacherId.toString();
  searchQuery.value = "";
  searchResult.value = [];
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

  get(adminSearchTeacher, { query: value })
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

const handleCancel = () => {
  emit("update:open", false);
};
const handleOk = () => {
  if (!formState.name || !formState.teacherId) {
    toast.error("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  toast.promise(
    post(adminCreateHomeRoom, {
      ...formState,
    }).then((res) => {
      if (res.code === 201) {
        emit("update:open", false);
        emit("update:reload", true);
      } else {
        throw new Error("Tạo lớp học thất bại");
      }
    }),
    {
      pending: "Đang tạo lớp học...",
      success: "Tạo lớp học thành công!",
      error: "Tạo lớp học thất bại!",
    }
  );
};
</script>

<style scoped>
:deep(.ant-btn-primary) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff7875;
  border-color: #ff7875;
}

:deep(.ant-input:focus),
:deep(.ant-input:hover),
:deep(.ant-input:active) {
  border-color: var(--color-border-gray);
}
</style>
