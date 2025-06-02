<template>
    <a-modal v-bind:open="open" @ok="onFinish" @cancel="handleCancel" width="800px">
        <template #closeIcon>
            <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
                <CloseOutlined class="text-lg" />
            </span>
        </template>

        <template #title>
            <div class="text-center text-(--color-text-red) font-bold text-2xl">
                Tạo Tài Khoản Mới
            </div>
            <hr class="my-2 border-(--color-border-gray)" />
        </template>
        <a-form :model="formState" name="createAccount" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off" @finish="onFinish" @finish-failed="onFinishFailed">
            <a-form-item label="Tên đăng nhập" name="username"
                :rules="[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]">
                <a-input v-model:value="formState.username" placeholder="Nhập tên đăng nhập" :size="'large'" />
            </a-form-item>

            <a-form-item label="Mật khẩu" name="password" :rules="[
                { required: true, message: 'Vui lòng nhập mật khẩu!', min: 8 },
            ]">
                <a-input-password v-model:value="formState.password" placeholder="Nhập mật khẩu" :size="'large'" />
            </a-form-item>

            <a-form-item label="Họ và tên" name="fullName"
                :rules="[{ required: true, message: 'Vui lòng nhập họ và tên!' }]">
                <a-input v-model:value="formState.fullName" placeholder="Nhập họ và tên đầy đủ" :size="'large'" />
            </a-form-item>
            <a-form-item label="Email" name="email" :rules="[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
            ]">
                <a-input v-model:value="formState.email" placeholder="Nhập địa chỉ email" :size="'large'" />
            </a-form-item>
            <a-form-item label="Vai trò" name="role" :rules="[{ required: true, message: 'Vui lòng chọn vai trò!' }]">
                <a-select v-model:value="formState.role" placeholder="Chọn vai trò người dùng" :size="'large'">
                    <a-select-option value="STUDENT">Học sinh</a-select-option>
                    <a-select-option value="TEACHER">Giáo viên</a-select-option>
                    <a-select-option value="ADMIN">Quản trị viên</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Ngày sinh" name="dob">
                <a-config-provider :locale="viVN">
                    <a-date-picker v-model:value="formState.dob" style="width: 100%" placeholder="Chọn ngày sinh"
                        :format="'DD/MM/YYYY'" :size="'large'" />
                </a-config-provider>
            </a-form-item>

            <a-form-item label="Giới tính" name="gender">
                <a-select v-model:value="formState.gender" placeholder="Chọn giới tính" :size="'large'">
                    <a-select-option value="MALE">Nam</a-select-option>
                    <a-select-option value="FEMALE">Nữ</a-select-option>
                    <a-select-option value="UNDEFINED">Khác</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Số điện thoại" name="phoneNumber">
                <a-input v-model:value="formState.phoneNumber" placeholder="Nhập số điện thoại" :maxlength="10"
                    @keypress="(e: KeyboardEvent) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }"
                    :size="'large'" />
            </a-form-item>



            <a-form-item label="Ảnh đại diện" name="avatarUrl">
                <a-upload v-model:file-list="fileList" list-type="picture" :max-count="1" :accept="'image/*'"
                    :before-upload="(file: File) => {
                        const isLt2M = file.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                            toast.error('Ảnh phải nhỏ hơn 2MB!');
                            return false;
                        }
                        return true;
                    }">
                    <a-button :size="'large'"
                        class="hover:!border-[var(--color-border-gray)] focus:!border-[var(--color-border-gray)] active:!border-[var(--color-border-gray)] hover:!text-[var(--color-text-gray)] focus:!text-[var(--color-text-gray)] active:!text-[var(--color-text-gray)]">
                        <upload-outlined style="color: currentColor" />
                        Chọn ảnh đại diện (tối đa 2MB)
                    </a-button>
                </a-upload>
            </a-form-item>
        </a-form>
        <template #footer>
            <button
                class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
                @click="() => emit('update:open', false)">
                Hủy bỏ
            </button>
            <button class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
                @click="() => onFinish(formState)">
                Tạo Tài Khoản
            </button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import dayjs from "dayjs";
import viVN from "ant-design-vue/es/locale/vi_VN";
import { toast } from "vue3-toastify";
import { post } from "@/services/callApi";
import { adminCreateAccount } from "@/services/api";
import { uploadImage } from "@/services/uploadImage";
interface FormState {
    username: string;
    password: string;
    role: string;
    fullName: string;
    dob: any;
    gender: string;
    phoneNumber: string;
    email: string;
    avatarUrl: string;
}

const { open } = defineProps<{
    open: boolean;
    reload: boolean;
}>()

const emit = defineEmits<{
    (e: "update:open", open: boolean): void;
    (e: "update:reload", reload: boolean): void;
}>();

const formState = reactive<FormState>({
    username: "",
    password: "",
    role: "STUDENT",
    fullName: "",
    dob: null,
    gender: "MALE",
    phoneNumber: "",
    email: "",
    avatarUrl: "",
});
const fileList = ref<any[]>([]);

const onFinish = async (values: FormState) => {
    // Kiểm tra các trường bắt buộc
    if (!values.username || !values.password || !values.fullName || !values.email || !values.role) {
        toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
        return;
    }
    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
        toast.error("Vui lòng nhập email hợp lệ!");
        return;
    }
    // Kiểm tra mật khẩu tối thiểu 8 ký tự
    if (values.password.length < 8) {
        toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
        return;
    }
    // Kiểm tra số điện thoại nếu có nhập
    if (values.phoneNumber && !/^\d{10}$/.test(values.phoneNumber)) {
        toast.error("Số điện thoại phải gồm 10 chữ số!");
        return;
    }

    let avatarUrl = "";
    const formattedData = {
        ...values,
        dob: values.dob
            ? dayjs(values.dob).format("YYYY-MM-DD")
            : null,
    };
    if (fileList.value && fileList.value.length > 0) {
        try {
            avatarUrl = await uploadImage(fileList.value[0].originFileObj, "avatar");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Tải ảnh lên thất bại!";
            toast.error(`Tải ảnh lên thất bại: ${errorMessage}`);
            return;
        }
    }
    toast.promise(post(adminCreateAccount, {
        ...formattedData,
        avatarUrl
    }).then((res) => {
        if (res.code !== 201) {
            throw new Error(res.message);
        }
        emit("update:reload", true);
        emit("update:open", false);
    }), {
        pending: "Đang tạo tài khoản...",
        success: "Tạo tài khoản thành công!",
        error: {
            render({ data }) {
                return data.message;
            },
        },
    });
}

const onFinishFailed = () => {
    toast.error(
        "Vui lòng kiểm tra lại thông tin!"
    );
};

const handleCancel = () => {
    emit("update:open", false);
};
</script>

<style scoped>
.account-card {
    margin: 20px auto;
    max-width: 800px;
    width: 90%;
}

:deep(.ant-btn-primary) {
    background-color: #f5222d;
    /* Red color */
    border-color: #f5222d;
}

:deep(.ant-btn-primary:hover),
:deep(.ant-btn-primary:focus) {
    background-color: var(--color-text-red);
    border-color: var(--color-text-red);
}

:deep(.ant-form-item-label label) {
    font-weight: 500;
}

:deep(.ant-card-head) {
    background-color: #fff1f0;
    border-bottom: 2px solid #f5222d;
}

:deep(.ant-card-head-title) {
    color: var(--color-text-red);
    font-weight: 600;
    font-size: 1.3rem;
}

:deep(.ant-select-selection-item),
:deep(.ant-select-selection-placeholder) {
    text-align: left;
}

:deep(.ant-input:focus),
:deep(.ant-input:hover),
:deep(.ant-input:active) {
    border: 1px solid var(--color-border-gray);
}

:deep(.ant-input-password:hover),
:deep(.ant-input-password:focus),
:deep(.ant-input-password:active) {
    border: 1px solid var(--color-border-gray);
}

:deep(.ant-input-password .ant-input:hover),
:deep(.ant-input-password .ant-input:focus),
:deep(.ant-input-password .ant-input:active) {
    border: none !important;
}
</style>
