<template>
    <div class="bg-gray-50/50">
        <div class="container mx-auto px-4 py-6">
            <div class="grid grid-cols-[1fr_2fr] gap-6">
                <!-- Section 1: Basic Info (Top Left) -->
                <div class="bg-red-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 relative">
                    <div class="absolute top-4 left-4">
                        <button @click="$router.go(-1)"
                            class=" flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors">
                            <LeftOutlined />
                            <span>Quay lại</span>
                        </button>
                    </div>
                    <div class="flex flex-col items-center gap-4">
                        <div class="relative">
                            <img v-if="profile?.avatarUrl" :src="profile?.avatarUrl" alt="Avatar"
                                class=" rounded-full border-4 border-white shadow-lg w-36 h-36" />
                            <div v-else class="flex items-center justify-center rounded-full shadow-lg">
                                <UserOutlined class="!text-red-500" style="font-size: 96px; padding: 16px;" />
                            </div>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 mb-2 text-center">
                            {{ profile?.fullName || 'Chưa cung cấp' }}
                        </h1>
                        <div class="flex items-center gap-2 text-gray-600 justify-center">
                            <MailOutlined class="text-red-500" />
                            <span>{{ profile?.email || 'Chưa cung cấp' }}</span>
                        </div>
                    </div>
                </div>


                <!-- Section 3: Personal Info (Top Right) -->
                <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                    <div class="flex items-center gap-2 text-red-500 mb-4">
                        <UserOutlined />
                        <span class="text-lg font-semibold">Thông Tin Cá Nhân</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <CalendarOutlined class="!text-gray-500" />
                                <span>Ngày Sinh</span>
                            </div>
                            <span>{{ profile?.dob ? dayjs(profile.dob).format('DD-MM-YYYY') : 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <ContactsOutlined class="!text-gray-500" />
                                <span>Giới Tính</span>
                            </div>
                            <span>{{ convertGender(profile?.gender ?? 'Chưa cung cấp') || 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <CalendarOutlined class="!text-gray-500" />
                                <span>Ngày tạo</span>
                            </div>
                            <span>{{ profile?.createdAt ? dayjs(profile.createdAt).format('DD-MM-YYYY') : 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <CalendarOutlined class="!text-gray-500" />
                                <span>Ngày cập nhật</span>
                            </div>
                            <span>{{ profile?.updatedAt ? dayjs(profile.updatedAt).format('DD-MM-YYYY') : 'Chưa cung cấp' }}</span>
                        </div>
                    </div>
                </div>
                <!-- Section 2: Security Info (Bottom Left) -->
                <div
                    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col ">
                    <div class="flex items-center gap-2 text-red-500 mb-4">
                        <LockOutlined />
                        <span class="text-lg font-semibold">Thông Tin </span>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow mb-4">

                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <PhoneOutlined class="!text-gray-500" />
                                <span>Số Điện Thoại</span>
                            </div>
                            <span>{{ profile?.phoneNumber || 'Chưa cung cấp' }}</span>
                        </div>

                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">

                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <SolutionOutlined class="!text-gray-500" />
                                <span>Bằng cấp</span>
                            </div>
                            <span>{{ convertDiplomaLevel(profile?.diplomaLevel) || 'Chưa cung cấp' }}</span>
                        </div>

                    </div>
                    <div class="mt-4 flex justify-center">
                        <button @click="handleEditProfile"
                            class="bg-(--color-bg-red) text-white rounded-xl px-4 py-2 hover:bg-red-900 transition-colors duration-200 flex items-center gap-2">
                            <EditOutlined class="text-white" />
                            Chỉnh sửa
                        </button>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                    <div class="flex items-center gap-2 text-red-500 mb-4">
                        <FileDoneOutlined />
                        <span class="text-lg font-semibold">Mô tả bằng cấp</span>
                    </div>
                    <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                        <span>{{ profile?.careerDesc || 'Chưa cung cấp' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EditProfile v-if="profile && openEditProfileModal" :profile="profile" v-model:open="openEditProfileModal"
        v-model:reload="reload"
        :teacherId="Array.isArray(route.params.teacherId) ? route.params.teacherId[0] : route.params.teacherId" />
</template>

<script setup lang="ts">
interface TeacherProfile {
    id: number | null,
    userId: number | null,
    username: string | null,
    fullName: string | null,
    gender: Role | null,
    dob: string | null,
    email: string | null,
    phoneNumber: string | null,
    avatarUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    diplomaLevel: DiplomaLevel | null,
    careerDesc: string | null,
}
import { onMounted, ref, watch } from "vue";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    SolutionOutlined,
    FileDoneOutlined,
    EditOutlined,
    HomeOutlined,
    IdcardOutlined,
    CalendarOutlined,
    GlobalOutlined,
    BankOutlined,
    EnvironmentOutlined,
    LockOutlined,
    ContactsOutlined,
} from '@ant-design/icons-vue';
import EditProfile from './EditProfile.vue';
import dayjs from 'dayjs';
import { get } from "@/services/callApi";
import { teacherInformation } from "@/services/api";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
const defaultStudentProfile: TeacherProfile = {
    id: null,
    userId: null,
    username: null,
    fullName: null,
    gender: null,
    dob: null,
    email: null,
    phoneNumber: null,
    avatarUrl: null,
    createdAt: null,
    updatedAt: null,
    diplomaLevel: null,
    careerDesc: null,

};

const reload = ref(false);
const profile = ref<TeacherProfile | null>(defaultStudentProfile);
const openEditProfileModal = ref(false);
const handleEditProfile = () => {
    openEditProfileModal.value = true;
};
const route = useRoute();

const convertGender = (gender: string) => {
    if (!gender) return 'Chưa cung cấp';
    switch (gender) {
        case 'MALE':
            return 'Nam';
        case 'FEMALE':
            return 'Nữ';
        case 'UNDEFINED':
            return 'Khác';
        default:
            return gender;
    }
};
const convertDiplomaLevel = (diplomaLevel: DiplomaLevel | null | undefined) => {
    if (!diplomaLevel) return 'Chưa cung cấp';
    switch (diplomaLevel) {
        case 'HIGH_SCHOOL':
            return 'Trung học phổ thông';
        case 'VOCATIONAL':
            return 'Trung cấp nghề';
        case 'ASSOCIATE':
            return 'Cao đẳng';
        case 'DIPLOMA':
            return 'Cao đẳng / Văn bằng chuyên ngành';
        case 'ADVANCED_DIPLOMA':
            return 'Cao đẳng nâng cao';
        case 'BACHELOR':
            return 'Cử nhân';
        case 'POSTGRADUATE_DIPLOMA':
            return 'Văn bằng sau đại học';
        case 'MASTER':
            return 'Thạc sĩ';
        case 'DOCTORATE':
            return 'Tiến sĩ';
        default:
            return diplomaLevel;
    }
};
watch(reload, (newValue) => {
    if (newValue) {
        fetchProfile();
        reload.value = false;
    }
});
const fetchProfile = () => {
    get(teacherInformation).then((res) => {
        if (res.code === 200) {
            profile.value = res.data;
        } else {
            profile.value = defaultStudentProfile;
            toast.error("Lấy thông tin thất bại");
        }
    });
};
onMounted(() => {
    fetchProfile();
});
</script>
