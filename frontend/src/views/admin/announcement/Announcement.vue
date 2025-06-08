<template>
  <div class="p-6">
    <div class="mb-4">
      <a-button
        type="primary"
        danger
        @click="showCreateAnnouncementModal = true"
        class="!flex !items-center"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        Tạo Thông Báo
      </a-button>
    </div>

    <a-table
      :dataSource="announcements"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :customRow="
        (record: Announcement) => ({
          onClick: () => handleRowClick(record),
        })
      "
      class="hover:cursor-pointer"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button
              type="link"
              @click.stop="handleEdit(record)"
              style="color: green"
            >
              <template #icon><EditOutlined /></template>
              Sửa
            </a-button>
            <a-button type="link" danger @click.stop="handleDelete(record)">
              <template #icon><DeleteOutlined /></template>
              Xóa
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
  <CreateAnnouncementModal
    v-if="showCreateAnnouncementModal"
    v-model:open="showCreateAnnouncementModal"
    v-model:reload="reload"
  />
  <EditAnnouncementModal
    v-if="showEditAnnouncementModal && selectedAnnouncement"
    v-model:open="showEditAnnouncementModal"
    v-model:reload="reload"
    :announcementId="selectedAnnouncement.id"
  />
  <DetailAnnouncementModal
    v-if="showDetailAnnouncementModal && selectedAnnouncement"
    v-model:open="showDetailAnnouncementModal"
    :announcementId="selectedAnnouncement.id"
  />
  <a-modal
    v-if="showDeleteAnnouncementModal && selectedAnnouncement"
    v-model:open="showDeleteAnnouncementModal"
    @ok="handleDelete"
  >
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Xóa Thông Báo
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <p class="text-center">Bạn có chắc chắn muốn xóa thông báo này không?</p>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="showDeleteAnnouncementModal = false"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleConfirmDelete"
      >
        Xóa Thông Báo
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import CreateAnnouncementModal from "./CreateAnnouncementModal.vue";
import EditAnnouncementModal from "./EditAnnouncementModal.vue";
import DetailAnnouncementModal from "./DetailAnnouncementModal.vue";
import dayjs from "dayjs";
import { del, get } from "@/services/callApi";
import { adminAnnouncement, adminGetAllAnnouncements } from "@/services/api";
import { toast } from "vue3-toastify";

interface Announcement {
  id: number;
  title: string;
  contentPreview: string;
  target: Role;
  targetName: string;
  date: string;
  adminName: string;
}
const announcements = ref<Announcement[]>([]);
const selectedAnnouncement = ref<Announcement | null>(null);
const showCreateAnnouncementModal = ref(false);
const showDeleteAnnouncementModal = ref(false);
const showEditAnnouncementModal = ref(false);
const showDetailAnnouncementModal = ref(false);
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
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Nội dung xem trước",
    dataIndex: "contentPreview",
    key: "contentPreview",
  },
  {
    title: "Đối tượng",
    dataIndex: "target",
    key: "target",
    customRender: ({ text }: { text: Role }) => convertTargetToName(text),
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: "Người quản trị",
    dataIndex: "adminName",
    key: "adminName",
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
const convertTargetToName = (target: Role) => {
  switch (target) {
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

const handleTableChange = (pagination: {
  current: number;
  pageSize: number;
}) => {
  fetchAnnouncements(pagination.current, pagination.pageSize);
};
const handleRowClick = (record: Announcement) => {
  selectedAnnouncement.value = record;
  showDetailAnnouncementModal.value = true;
};
const handleEdit = (record: Announcement) => {
  showEditAnnouncementModal.value = true;
  selectedAnnouncement.value = record;
};

const handleDelete = (record: Announcement) => {
  showDeleteAnnouncementModal.value = true;
  selectedAnnouncement.value = record;
};
const handleConfirmDelete = () => {
  toast.promise(
    del(adminAnnouncement + `/${selectedAnnouncement.value?.id}`).then(
      (res) => {
        if (res.code !== 202) {
          throw new Error("Xóa thông báo thất bại!");
        }
        showDeleteAnnouncementModal.value = false;
        selectedAnnouncement.value = null;
        fetchAnnouncements(pagination.current, pagination.pageSize);
      }
    ),
    {
      pending: "Đang xóa thông báo...",
      success: "Xóa thông báo thành công!",
      error: "Xóa thông báo thất bại!",
    }
  );
};

const fetchAnnouncements = (page: number, size: number) => {
  get(adminGetAllAnnouncements, {
    page: page - 1,
    size: size,
  }).then((res) => {
    if (res.code !== 200) {
      throw new Error(res.message);
    }
    announcements.value = res.data;
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
