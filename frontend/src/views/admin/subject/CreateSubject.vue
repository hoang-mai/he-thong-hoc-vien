<template>
    <a-modal v-bind:open="open" @ok="handleOk" @cancel="handleCancel">
        <template #closeIcon>
            <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
                <CloseOutlined class="text-lg" />
            </span>
        </template>

        <template #title>
            <div class="text-center text-(--color-text-red) font-bold text-2xl">
                Tạo Môn Học Mới
            </div>
            <hr class="my-2 border-(--color-border-gray)" />
        </template>
        <a-form :model="formState" :rules="rules" ref="formRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">

            <a-form-item label="Mã môn học" name="code">
                <a-input v-model:value="formState.code" :size="'large'" placeholder="Mã môn học" />
            </a-form-item>
            <a-form-item label="Tên môn học" name="name">
                <a-input v-model:value="formState.name" :size="'large'" placeholder="Nhập tên môn học" />
            </a-form-item>



            <a-form-item label="Mô tả" name="description">
                <a-textarea v-model:value="formState.description" :rows="4" placeholder="Nhập mô tả môn học..."
                    :style="{ resize: 'none' }" />
            </a-form-item>
        </a-form>
        <template #footer>
            <button
                class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
                @click="handleCancel">
                Hủy bỏ
            </button>
            <button class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
                @click="handleOk">
                Tạo Môn Học
            </button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { post } from "@/services/callApi";
import { toast } from "vue3-toastify";
import { adminCreateSubject } from "@/services/api";

interface FormState {
    name: string;
    code: string;
    description: string;
}

const { open } = defineProps<{
    open: boolean;
    reload: boolean;
}>();

const emit = defineEmits<{
    (e: "update:open", open: boolean): void;
    (e: "update:reload", reload: boolean): void;
}>();

const formState = reactive<FormState>({
    name: "",
    code: "",
    description: "",
});

const rules = {
    code: [
        { required: true, message: "Vui lòng nhập mã môn học" },
        { pattern: /^[A-Z0-9]{2,10}$/, message: "Mã môn học phải gồm 2-10 ký tự in hoa hoặc số" },
    ],
    name: [
        { required: true, message: "Vui lòng nhập tên môn học" },
    ],
};

const handleCancel = () => {
    emit("update:open", false);
};

const handleOk = () => {
    if (!formState.name.trim() || !formState.code.trim()) {
        toast.error("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    toast.promise(
        post(adminCreateSubject, formState).then((res) => {
            if (res.code === 201) {
                emit("update:open", false);
                emit("update:reload", true);
            } else {
                throw new Error("Tạo môn học thất bại");
            }
        }),
        {
            pending: "Đang tạo môn học...",
            success: "Tạo môn học thành công!",
            error: "Tạo môn học thất bại!",
        }
    );
};
</script>

<style scoped>
:deep(.ant-btn-primary) {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
}

:deep(.ant-btn-primary:hover) {
    background-color: #ff7875;
    border-color: #ff7875;
}

:deep(.ant-input:focus),
:deep(.ant-input:hover),
:deep(.ant-input:active) {
    border-color: var(--color-border-gray);
}
</style>