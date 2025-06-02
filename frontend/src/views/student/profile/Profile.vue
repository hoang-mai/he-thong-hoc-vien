<template>
    <div class="bg-gray-50/50">
        <div class="container mx-auto px-4 py-6">
            <div class="grid grid-cols-[1fr_2fr] gap-6">
                <!-- Section 1: Basic Info (Top Left) -->
                <div class="bg-red-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                    <div class="flex flex-col items-center gap-4">
                        <div class="relative">
                            <img v-if="profile?.avatarUrl" :src="profile?.avatarUrl" alt="Avatar"
                                class=" rounded-full border-4 border-white shadow-lg" />
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
                                <GlobalOutlined class="!text-gray-500" />
                                <span>Dân Tộc</span>
                            </div>
                            <span>{{ profile?.ethnicity || 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <HomeOutlined class="!text-gray-500" />
                                <span>Địa Chỉ</span>
                            </div>
                            <span>{{ profile?.address || 'Chưa cung cấp' }}</span>
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
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <IdcardOutlined class="!text-gray-500" />
                                <span>Số CCCD</span>
                            </div>
                            <span>{{ profile?.idCardNumber || 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <BankOutlined class="!text-gray-500" />
                                <span>Nơi Cấp</span>
                            </div>
                            <span>{{ profile?.idCardPlaceOfIssue || 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <PhoneOutlined class="!text-gray-500" />
                                <span>Số Điện Thoại</span>
                            </div>
                            <span>{{ profile?.phoneNumber || 'Chưa cung cấp' }}</span>
                        </div>
                        <div>
                            <div class="text-gray-500 font-medium mb-1 flex items-center gap-2">
                                <EnvironmentOutlined class="!text-gray-500" />
                                <span>Nơi Cư Trú</span>
                            </div>
                            <span>{{ profile?.residence || 'Chưa cung cấp' }}</span>
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

                <!-- Section 4: Family Info (Bottom Right) -->
                <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                    <div class="flex items-center gap-2 text-red-500 mb-4">
                        <TeamOutlined />
                        <span class="text-lg font-semibold">Thông Tin Gia Đình</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Mother Information -->
                        <div class="mb-6">
                            <div class="flex items-center gap-2 mb-3">
                                <HeartOutlined class="text-red-500" />
                                <span class="font-medium">Thông Tin Mẹ</span>
                            </div>
                            <div class="space-y-2 pl-6 border-l-4 border-red-500 rounded-lg">
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <UserOutlined class="!text-gray-400" />
                                        Họ và Tên
                                    </div>
                                    <span class="text-base">{{ profile?.motherName || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <PhoneOutlined class="!text-gray-400" />
                                        Điện Thoại
                                    </div>
                                    <span class="text-base">{{ profile?.motherPhone || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <MailOutlined class="!text-gray-400" />
                                        Email
                                    </div>
                                    <span class="text-base">{{ profile?.motherMail || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <IdcardOutlined class="!text-gray-400" />
                                        Năm Sinh
                                    </div>
                                    <span class="text-base">{{ profile?.motherYob || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <BankOutlined class="!text-gray-400" />
                                        Nghề Nghiệp
                                    </div>
                                    <span class="text-base">{{ profile?.motherOccupation || 'Chưa cung cấp' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Father Information -->
                        <div>
                            <div class="flex items-center gap-2 mb-3">
                                <HeartOutlined class="text-red-500" />
                                <span class="font-medium">Thông Tin Cha</span>
                            </div>
                            <div class="space-y-2 pl-6 border-l-4 border-red-500 rounded-lg">
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <UserOutlined class="!text-gray-400" />
                                        Họ và Tên
                                    </div>
                                    <span class="text-base">{{ profile?.fatherName || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <PhoneOutlined class="!text-gray-400" />
                                        Điện Thoại
                                    </div>
                                    <span class="text-base">{{ profile?.fatherPhone || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <MailOutlined class="!text-gray-400" />
                                        Email
                                    </div>
                                    <span class="text-base">{{ profile?.fatherMail || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <IdcardOutlined class="!text-gray-400" />
                                        Năm Sinh
                                    </div>
                                    <span class="text-base">{{ profile?.fatherYob || 'Chưa cung cấp' }}</span>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-base flex items-center gap-1 font-medium">
                                        <BankOutlined class="!text-gray-400" />
                                        Nghề Nghiệp
                                    </div>
                                    <span>{{ profile?.fatherOccupation || 'Chưa cung cấp' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <EditProfile v-if="profile && openEditProfileModal" :profile="profile" v-model:open="openEditProfileModal"
        v-model:reload="reload" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    HeartOutlined,
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
import { watch } from "vue";
import { get } from "@/services/callApi";
import { studentInformation } from "@/services/api";
import { toast } from "vue3-toastify";
import dayjs from "dayjs";
const defaultStudentProfile: StudentProfile = {
    id: 0,
    email: null,
    fullName: null,
    dob: null,
    gender: null,
    phoneNumber: null,
    avatarUrl: null,
    ethnicity: null,
    idCardNumber: null,
    idCardPlaceOfIssue: null,
    residence: null,
    address: null,
    religion: null,
    motherName: null,
    motherYob: null,
    motherPhone: null,
    motherMail: null,
    motherOccupation: null,
    fatherName: null,
    fatherYob: null,
    fatherPhone: null,
    fatherMail: null,
    fatherOccupation: null,
};

const reload = ref(false);
const profile = ref<StudentProfile | null>(defaultStudentProfile);
const openEditProfileModal = ref(false);
const handleEditProfile = () => {
    openEditProfileModal.value = true;
};

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
watch(reload, (newValue) => {
    if (newValue) {
        fetchProfile();
        reload.value = false;
    }
});
const fetchProfile = () => {
    get(studentInformation).then((res) => {
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
