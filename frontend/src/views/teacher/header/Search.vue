<template>
  <div class="relative" ref="searchContainerRef">
    <a-input-search v-model:value="searchQuery" :style="{
      borderColor: 'var(--color-border-gray)',
    }" class="sm:!w-20 md:!w-36 lg:!w-56"
      @focus="(e: Event) => ((e.target as HTMLInputElement).style.borderColor = 'var(--color-border-gray)')"
      @blur="(e: Event) => ((e.target as HTMLInputElement).style.borderColor = 'var(--color-border-gray)')"
      :placeholder="'Tìm kiếm'" @search="handleSearch"
      @input="(e: Event) => handleSearchNow((e.target as HTMLInputElement).value)">
      <template #enterButton>
        <a-button type="primary" class="!w-8 sm:!w-9 md:!p-1" style="
            background-color: var(--color-border-gray);
            border-color: var(--color-border-gray);
          ">
          <SearchOutlined class="!text-[var(--color-text-red)] text-lg" />
        </a-button>
      </template>
    </a-input-search>

    <!-- Search Results Dropdown -->
    <div v-if="searchQuery && searchResult.length > 0"
      class="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
      <ul class="py-2">
        <li v-for="(result, index) in searchResult" :key="index"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          @click="handleSelectAccount(result.id)">
          <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-(--color-text-white)">
            <img v-if="result.avatarUrl" :src="result.avatarUrl" alt="Avatar"
              class="w-full h-full object-cover rounded-full" />
            <UserOutlined v-else/>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">{{ result.fullName }}</span>
            <span class="text-sm text-gray-500">{{ result.email }}</span>
          </div>
          <a-tag :color="result.role === 'ADMIN'
            ? 'blue'
            : result.role === 'TEACHER'
              ? 'green'
              : 'orange'
            " class="ml-auto">
            {{ convertRole(result.role) }}
          </a-tag>
        </li>
      </ul>
    </div>
  </div>
  <!-- Account Detail Modal -->
  <a-modal v-model:open="showDetailAccountModal" @cancel="showDetailAccountModal = false"><template #closeIcon>
      <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
        <CloseOutlined class="text-lg" />
      </span>
    </template>

    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Thông tin tài khoản
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <div v-if="selectedAccount" class="flex flex-col">
      <div class="flex items-center mb-4">
        <div class="w-16 h-16 rounded-full overflow-hidden mr-4 bg-red-600 flex items-center justify-center text-white">
          <img v-if="selectedAccount.avatarUrl" :src="selectedAccount.avatarUrl" alt="Avatar"
            class="w-full h-full object-cover" />
          <UserOutlined v-else style="font-size: 24px" />
        </div>
        <div>
          <h2 class="text-lg font-bold">{{ selectedAccount.fullName }}</h2>
          <p class="text-gray-500">{{ selectedAccount.email }}</p>
          <a-tag :color="selectedAccount.role === 'ADMIN'
            ? 'blue'
            : selectedAccount.role === 'TEACHER'
              ? 'green'
              : 'orange'
            ">
            {{ convertRole(selectedAccount.role) }}
          </a-tag>
          <a-tag :color="selectedAccount.accountStatus === 'ACTIVE' ? 'green' : 'red'
            " class="ml-2">
            {{
              selectedAccount.accountStatus === "ACTIVE"
                ? "Đang hoạt động"
                : "Đã khóa"
            }}
          </a-tag>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p class="text-gray-500 mb-1">Ngày sinh</p>
          <p>
            {{
              selectedAccount.dob
                ? new Date(selectedAccount.dob).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"
            }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">Giới tính</p>
          <p>
            {{
              selectedAccount.gender === "MALE"
                ? "Nam"
                : selectedAccount.gender === "FEMALE"
                  ? "Nữ"
                  : selectedAccount.gender === "UNDEFINED"
                    ? "Khác"
                    : "Chưa cập nhật"
            }}
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="showDetailAccountModal = false">
        Đóng
      </button>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
import {
  searchUser,
  searchUserView,
} from "@/services/api";
import { get } from "@/services/callApi";
interface SearchResult {
  id: number;
  avatarUrl: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
}
interface Account {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  dob: string;
  gender: Gender;
  email: string;
  accountStatus: Status;
  avatarUrl: string;
}
import { UserOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { ref, onMounted, onUnmounted } from "vue";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
const searchQuery = ref<string>("");
const searchResult = ref<SearchResult[]>([]);
const searchContainerRef = ref<HTMLElement | null>(null);
const selectedAccount = ref<Account | null>(null);
const showDetailAccountModal = ref(false);

const handleSelectAccount = (accountId: number) => {
  showDetailAccountModal.value = true;
  get(searchUserView, { userId: accountId }).then((res) => {
    if (res.code !== 200) {
      toast.error("Lấy thông tin tài khoản thất bại");
      return;
    }
    selectedAccount.value = res.data;
  });

  searchQuery.value = "";
  searchResult.value = [];
};
// Handle clicking outside search container
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

const handleSearchNow = (value: string) => {
  if (!value) {
    searchResult.value = [];
    return;
  }

  get(searchUser, { query: value })
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
</script>
