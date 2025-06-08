<template>
    <div class="p-6 flex justify-center mx-auto">
        <a-card :bordered="false" class="max-w-3xl mx-auto" style="width: 600px;">
            <template #title>
                <div class="flex items-center gap-2 justify-center">
                    <span class="text-lg font-bold text-(--color-text-red)">Thông tin quản trị viên</span>
                </div>
            </template>
            <div class="flex gap-8 mb-6">
                <div class="flex-shrink-0 ">
                    <img v-if="admin.avatarUrl" :src="admin.avatarUrl" alt="Avatar"
                        class="w-32 h-32 rounded-full object-cover border-2 border-gray-300" />
                    <div v-else class="flex items-center justify-center rounded-full shadow-lg bg-red-600">
                        <UserOutlined class="!text-white" style="font-size: 96px; padding: 16px;" />
                    </div>
                </div>
                <div class="flex-1">
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Họ và tên:</span>
                        <span class="text-gray-800">{{ admin.fullName }}</span>
                    </div>
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Email:</span>
                        <span class="text-gray-800">{{ admin.email }}</span>
                    </div>
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Ngày sinh:</span>
                        <span class="text-gray-800">{{ formatDate(admin.dob) }}</span>
                    </div>
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Giới tính:</span>
                        <span class="text-gray-800">{{ admin.gender === 'MALE' ? 'Nam' : admin.gender === 'FEMALE' ?
                            'Nữ' :
                            admin.gender === 'UNDEFINED' ? 'Khác' : '' }}</span>
                    </div>
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Số điện thoại:</span>
                        <span class="text-gray-800">{{ admin.phoneNumber }}</span>
                    </div>

                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Ghi chú:</span>
                        <span class="text-gray-800">{{ admin.note }}</span>
                    </div>
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Ngày tạo:</span>
                        <span class="text-gray-800">{{ formatDate(admin.createdAt) }}</span>
                    </div>
                    <div class="mb-4 flex gap-4">
                        <span class="min-w-[120px] font-bold text-gray-600">Cập nhật:</span>
                        <span class="text-gray-800">{{ formatDate(admin.updatedAt) }}</span>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-200 pt-6 flex justify-between">
                <button @click="handleReturn"
                    class="bg-gray-200 text-gray-700 rounded-xl px-4 py-2 hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2">
                    <ArrowLeftOutlined class="text-gray-700" />
                    Quay lại
                </button>
                <button @click="handleEdit"
                    class="bg-(--color-bg-red) text-white rounded-xl px-4 py-2 hover:bg-red-900 transition-colors duration-200 flex items-center gap-2">
                    <EditOutlined class="text-white" />
                    Chỉnh sửa
                </button>
            </div>
        </a-card>
    </div>
    <EditProfile v-if="open && admin" v-model:open="open" :profile="admin" v-model:reload="reload"
        :adminId="Array.isArray(route.params.adminId) ? route.params.adminId[0] : route.params.adminId" />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@/services/callApi'
import { adminGetUserAdmin } from '@/services/api'
import { toast } from 'vue3-toastify'
import EditProfile from './EditProfile.vue'

interface Admin {
    id: number
    userId: number
    username: string
    fullName: string
    gender: Gender
    dob: string
    email: string
    phoneNumber: string
    avatarUrl: string
    note: string
    createdAt: string
    updatedAt: string
}
const router = useRouter();
const route = useRoute();
const open = ref(false)
const reload = ref(false)
// Dữ liệu mẫu quản trị viên (thay thế bằng dữ liệu thực từ API)
const admin = ref<Admin>({
    id: 1,
    userId: 1,
    username: "",
    fullName: "",
    gender: "UNDEFINED",
    dob: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "", // URL ảnh đại diện mặc định
    note: "",
    createdAt: "",
    updatedAt: ""
})

const formatDate = (date: string) => {
    if (!date) return ''
    // Using Vietnamese date format
    return dayjs(date).format('DD-MM-YYYY')
}
watch(reload, (newValue) => {
    if (newValue) {
        fetchAdminData()
        reload.value = false
    }
})

const handleEdit = () => {
    open.value = true
}

const handleReturn = () => {
    router.back()
}
const fetchAdminData = async () => {
    get(adminGetUserAdmin + `/${route.params.adminId}`).then((res) => {
        if (res.code !== 200) {
            toast.error("Lấy thông tin quản trị viên thất bại");
            return;
        }
        admin.value = res.data;
    });
}
onMounted(() => {
    fetchAdminData()
})
</script>

<style scoped>
:deep(.ant-btn-primary) {
    background-color: rgb(220, 38, 38);
    border-color: rgb(220, 38, 38);
}

:deep(.ant-btn-primary:hover) {
    background-color: rgb(239, 68, 68);
    border-color: rgb(239, 68, 68);
}

:deep(.ant-card-head-title) {
    font-size: 1.125rem;
    font-weight: 700;
    color: rgb(31, 41, 55);
}
</style>