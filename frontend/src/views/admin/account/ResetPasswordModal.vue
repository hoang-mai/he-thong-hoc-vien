<template>
    <a-modal v-bind:open="open" @ok="handleOk" @cancel="handleCancel">
        <template #closeIcon>
            <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
                <CloseOutlined class="text-lg" />
            </span>
        </template>

        <template #title>
            <div class="text-center text-(--color-text-red) font-bold text-2xl">
                Đặt Lại Mật Khẩu
            </div>
            <hr class="my-2 border-(--color-border-gray)" />
        </template>

        <form ref="form" class="flex flex-col">
            <div class="flex flex-col gap-2 mb-4">
                <label for="newPassword" class="text-base font-medium">
                    Mật khẩu mới<strong class="text-red-500">*</strong>
                </label>
                <div>
                    <a-input-password v-model:value="formState.newPassword" :placeholder="'Nhập mật khẩu mới'"
                        :size="'large'" :prefix-icon="LockOutlined" :show-password="true"
                        :style="{ borderColor: 'var(--color-border-gray)' }" />
                    <p v-if="formState.newPassword.length > 0 && formState.newPassword.length < 8"
                        class="text-red-500 text-sm">
                        Mật khẩu phải có ít nhất 8 ký tự
                    </p>
                    <p v-else class="h-5"></p>
                </div>
            </div>
            <div class="flex flex-col gap-2 mb-4">
                <label for="confirmPassword" class="text-base font-medium">
                    Xác nhận mật khẩu mới<strong class="text-red-500">*</strong>
                </label>
                <div>
                    <a-input-password v-model:value="formState.confirmPassword" :placeholder="'Xác nhận mật khẩu mới'"
                        :size="'large'" :prefix-icon="LockOutlined" :show-password="true"
                        :style="{ borderColor: 'var(--color-border-gray)' }" autocomplete="off" />
                    <p v-if="formState.confirmPassword !== formState.newPassword && formState.confirmPassword.length > 0"
                        class="text-red-500 text-sm">
                        Mật khẩu xác nhận không khớp
                    </p>
                    <p v-else class="h-5"></p>
                </div>
            </div>
        </form>

        <template #footer>
            <button
                class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
                @click="handleCancel">
                Hủy bỏ
            </button>
            <button class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
                @click="handleOk">
                Đặt Lại Mật Khẩu
            </button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { adminResetAccountPassword } from "@/services/api";
import { post } from "@/services/callApi";
import { LockOutlined, CloseOutlined } from "@ant-design/icons-vue";
import { reactive } from "vue";
import { toast } from "vue3-toastify";

interface FormState {
    newPassword: string;
    confirmPassword: string;
}

const { open, username } = defineProps<{
    open: boolean;
    username: string;
}>();

const emit = defineEmits<{
    (e: 'update:open', open: boolean): void;
}>();

const formState = reactive<FormState>({
    newPassword: "",
    confirmPassword: "",
});

const handleCancel = () => {
    emit("update:open", false);
    formState.newPassword = "";
    formState.confirmPassword = "";
};

const handleOk = () => {
    if (formState.newPassword === "" || formState.confirmPassword === "") {
        toast.error("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if (formState.newPassword.length < 8) {
        toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
        return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
    }
    toast.promise(post(adminResetAccountPassword, {
        username: username,
        newPassword: formState.newPassword,
    }).then((res) => {
        if (res.code === 202) {
            emit("update:open", false);
            formState.newPassword = "";
            formState.confirmPassword = "";
        }
    }), {
        pending: "Đang đặt lại mật khẩu...",
        success: "Đặt lại mật khẩu thành công",
        error: "Đặt lại mật khẩu thất bại",
    });
};
</script>

<style scoped>
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
