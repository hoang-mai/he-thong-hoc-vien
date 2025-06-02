<template>
    <div class="p-6">
        <div class="mb-4">
            <a-button type="primary" danger @click="showCreateSubjectModal = true" class="!flex !items-center">
                <template #icon>
                    <PlusOutlined />
                </template>
                Tạo Môn Học
            </a-button>
        </div>

        <a-table :dataSource="subjects" :columns="columns" :pagination="pagination" @change="handleTableChange"
            :customRow="(record: Subject) => ({
                    onClick: () => handleRowClick(record),
                })
                " class="hover:cursor-pointer">
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
            </template>
        </a-table>
    </div>
    <CreateSubject v-if="showCreateSubjectModal" v-model:open="showCreateSubjectModal" v-model:reload="reload" />
    <EditSubject v-if="showEditSubjectModal && selectedSubject" v-model:open="showEditSubjectModal"
        v-model:reload="reload" :subject="selectedSubject" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import type { TableColumnsType } from "ant-design-vue";
import CreateSubject from "../../admin/subject/CreateSubject.vue";
import EditSubject from "../../admin/subject/EditSubject.vue";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { del, get } from "@/services/callApi";
import { toast } from "vue3-toastify";
import { adminGetAllSubjects } from "@/services/api";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

const router = useRouter();
interface Subject {
    id: number;
    name: string;
    code: string;
    description: string;
    totalClasses: number;
    createdAt: string;
    updatedAt: string;
}

const subjects = ref<Subject[]>([]);
const selectedSubject = ref<Subject | null>(null);
const showCreateSubjectModal = ref(false);
const showEditSubjectModal = ref(false);
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
        title: "Mã môn học",
        dataIndex: "code",
        key: "code",
    },
    {
        title: "Tên môn học",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Số lớp học",
        dataIndex: "totalClasses",
        key: "totalClasses",
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
            fetchSubjects(pagination.current, pagination.pageSize);
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
    fetchSubjects(pagination.current, pagination.pageSize);
};

const handleRowClick = (record: Subject) => {
    router.push({
        name: "adminSubject",
        params: {
            subjectId: record.id,
        },
    });
};

const handleEdit = (record: Subject) => {
    showEditSubjectModal.value = true;
    selectedSubject.value = record;
};


const fetchSubjects = (page: number, size: number) => {
    get(adminGetAllSubjects, {
        page: page - 1,
        size: size,
    }).then((res) => {
        if (res.code !== 200) {
            throw new Error(res.message);
        }
        subjects.value = res.data.subjects;
        pagination.total = res.data.paging.totalElements;
        pagination.current = res.data.paging.page + 1;
        pagination.pageSize = res.data.paging.size;
    });
};

onMounted(() => {
    fetchSubjects(pagination.current, pagination.pageSize);
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