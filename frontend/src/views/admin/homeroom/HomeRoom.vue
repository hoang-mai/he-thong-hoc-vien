<template>
  <div class="p-6">
    <div class="mb-4">
      <a-button
        type="primary"
        danger
        @click="showCreateHomeRoomModal = true"
        class="!flex !items-center"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        Tạo lớp học
      </a-button>
    </div>

    <a-table
      :dataSource="homeRooms"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :customRow="(record: HomeRoom) => ({
                onClick: () => handleRowClick(record),
            })
                "
      class="hover:cursor-pointer"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'teacherInfo'">
          <div class="flex items-center">
            <img
              v-if="record.teacherAvatarUrl"
              :src="record.teacherAvatarUrl"
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
              <div class="font-medium">{{ record.teacherName }}</div>
              <div class="text-gray-500 text-sm">{{ record.teacherEmail }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              type="link"
              @click.stop="handleEdit(record)"
              style="color: green"
            >
              <template #icon>
                <EditOutlined />
              </template>
              Sửa
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
  <CreateHomeRoom
    v-if="showCreateHomeRoomModal"
    v-model:open="showCreateHomeRoomModal"
    v-model:reload="reload"
  />
  <EditHomeRoom
    v-if="showEditHomeRoomModal && selectedHomeRoom"
    v-model:open="showEditHomeRoomModal"
    v-model:reload="reload"
    :homeRoom="selectedHomeRoom"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import CreateHomeRoom from "./CreateHomeRoom.vue";
import EditHomeRoom from "./EditHomeRoom.vue";
import dayjs from "dayjs";
import { get } from "@/services/callApi";
import { adminGetAllHomeRooms } from "@/services/api";
import { useRouter } from "vue-router";

interface HomeRoom {
  id: number;
  name: string;
  teacherId: number;
  teacherName: string;
  teacherAvatarUrl: string;
  teacherEmail: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}
const homeRooms = ref<HomeRoom[]>([]);
const selectedHomeRoom = ref<HomeRoom | null>(null);
const showCreateHomeRoomModal = ref(false);
const showEditHomeRoomModal = ref(false);
const reload = ref(false);
const router = useRouter();
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
    title: "Tên lớp",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Thông tin giáo viên",
    dataIndex: "teacherInfo",
    key: "teacherInfo",
    width: 250,
  },
  {
    title: "Số lượng học sinh",
    dataIndex: "studentCount",
    key: "studentCount",
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
  {
    title: "Thao tác",
    key: "action",
  },
];

watch(
  () => reload.value,
  (newValue) => {
    if (newValue) {
      fetchAnnouncements(pagination.current, pagination.pageSize);
      reload.value = false;
    }
  }
);

const formatDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};

const handleTableChange = (pagination: {
  current: number;
  pageSize: number;
}) => {
  fetchAnnouncements(pagination.current, pagination.pageSize);
};
const handleRowClick = (record: HomeRoom) => {
    router.push({
        name: "adminHomeRoom",
        params: {
            homeRoomId: record.id,
        },
    });
};
const handleEdit = (record: HomeRoom) => {
  showEditHomeRoomModal.value = true;
  selectedHomeRoom.value = record;
};

const fetchAnnouncements = (page: number, size: number) => {
  get(adminGetAllHomeRooms, {
    page: page - 1,
    size: size,
  }).then((res) => {
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    homeRooms.value = res.data;
    pagination.total = res.paging.totalElements;
    pagination.current = res.paging.page + 1;
    pagination.pageSize = res.paging.size;
  });
};
onMounted(() => {
  fetchAnnouncements(pagination.current, pagination.pageSize);
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
