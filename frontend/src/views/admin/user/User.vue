<template>
  <div class="p-6">
    <a-table
      :dataSource="users"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :customRow="
        (record: User) => ({
          onClick: () => handleRowClick(record),
        })
      "
      class="hover:cursor-pointer"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userInfo'">
          <div class="flex items-center">
            <img
              v-if="record.avatarUrl"
              :src="record.avatarUrl"
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
              <div class="font-medium">{{ record.fullName }}</div>
              <div class="text-gray-500 text-sm">{{ record.email }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'role'">
          <a-tag
            :color="
              record.role === 'ADMIN'
                ? 'blue'
                : record.role === 'TEACHER'
                ? 'green'
                : 'orange'
            "
          >
            {{ convertRoleToName(record.role) }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { del, get } from "@/services/callApi";
import { adminGetAllUsers } from "@/services/api";
import { UserOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  gender: string;
  dob: string;
  phoneNumber: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  studentId: number | null;
  teacherId: number | null;
  adminId: number | null;
}

const users = ref<User[]>([]);

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
const router = useRouter();

const columns: TableColumnsType = [
  {
    title: "Thông tin người dùng",
    dataIndex: "userInfo",
    key: "userInfo",
    width: 250,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
    customRender: ({ text }: { text: string }) => convertGender(text),
  },
  {
    title: "Ngày sinh",
    dataIndex: "dob",
    key: "dob",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    customRender: ({ text }: { text: Role }) => convertRoleToName(text),
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: "Ngày cập nhật",
    dataIndex: "updatedAt",
    key: "updatedAt",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
];

const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format("DD-MM-YYYY");
};

const convertRoleToName = (role: Role) => {
  switch (role) {
    case "STUDENT":
      return "Học sinh";
    case "TEACHER":
      return "Giáo viên";
    case "ADMIN":
      return "Quản trị viên";
    default:
      return "";
  }
};

const convertGender = (gender: string) => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "UNDEFINED":
      return "Khác";
    default:
      return "";
  }
};

const handleTableChange = (paginationTable: {
  current: number;
  pageSize: number;
}) => {
  pagination.current = paginationTable.current;
  pagination.pageSize = paginationTable.pageSize;
};

const handleRowClick = (record: User) => {
  if (record.role === "ADMIN") {
    // Redirect to admin detail page
    router.push({ name: "admin", params: { adminId: record.adminId } });
  } else if (record.role === "TEACHER") {
    // Redirect to teacher detail page
    router.push({ name: "teacher", params: { teacherId: record.teacherId } });
  } else if (record.role === "STUDENT") {
    // Redirect to student detail page
    router.push({ name: "student", params: { studentId: record.studentId } });
  }
};

const fetchUsers = () => {
  get(adminGetAllUsers).then((res) => {
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    users.value = res.data;
    pagination.total = res.data.length;
  });
};

onMounted(() => {
  fetchUsers();
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
