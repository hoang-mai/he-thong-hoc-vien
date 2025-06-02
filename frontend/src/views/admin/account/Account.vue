<template>
  <div class="p-6">
    <div class="mb-4">
      <a-button type="primary" danger @click="showCreateAccountModal = true" class="!flex !items-center">
        <template #icon>
          <PlusOutlined />
        </template>
        Tạo Tài Khoản
      </a-button>
    </div>

    <a-table :dataSource="accounts" :columns="columns" :pagination="pagination" @change="handleTableChange" class="hover:cursor-pointer">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click.stop="handleEdit(record)" style="color: green">
              <template #icon>
                <EditOutlined />
              </template>
              Sửa
            </a-button>
          </a-space>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'ACTIVE' ? 'green' : 'red'">
            {{ convertStatus(record.status) }}
          </a-tag>
        </template>
        <template v-if="column.key === 'role'">
          <a-tag :color="record.role === 'ADMIN' ? 'blue' : record.role === 'TEACHER' ? 'green' : 'orange'">
            {{ convertRole(record.role) }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
  <CreateAccount v-if="showCreateAccountModal" v-model:open="showCreateAccountModal" v-model:reload="reload"/>
  <ResetPasswordModal v-if="showEditAccountModal && selectedAccount" v-model:open="showEditAccountModal" :username="selectedAccount?.username" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import { PlusOutlined, EditOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { get } from "@/services/callApi";
import { adminGetAllAccounts } from "@/services/api";
import CreateAccount from "./CreateAccount.vue";
import ResetPasswordModal from "./ResetPasswordModal.vue";

interface Account {
  id: number;
  username: string;
  fullName: string;
  role: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  userId: number;
}

const accounts = ref<Account[]>([]);
const showCreateAccountModal = ref(false);
const showEditAccountModal = ref(false);
const selectedAccount = ref<Account | null>(null);
const reload = ref(false);

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
    title: "Tên đăng nhập",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Họ và tên",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: "Thao tác",
    key: "action",
  },
];


const formatDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

const convertRole = (role: string) => {
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

const convertStatus = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngừng hoạt động";
    default:
      return status;
  }
};
const handleTableChange = (paginationTable: {
  current: number;
  pageSize: number;
}) => {
  pagination.current = paginationTable.current;
  pagination.pageSize = paginationTable.pageSize;
};
watch(
  () => reload.value,
  (newValue) => {
    if (newValue) {
      fetchAccounts();
      reload.value = false;
    }
  }
);

const handleEdit = (record: Account) => {
  selectedAccount.value = record;
  showEditAccountModal.value = true;
};

const fetchAccounts = () => {
  get(adminGetAllAccounts).then((res) => {
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    accounts.value = res.data;
    pagination.total = res.data.length;
  });
};

onMounted(() => {
  fetchAccounts();
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