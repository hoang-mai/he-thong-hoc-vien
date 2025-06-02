<template>
    <a-modal v-bind:open="open" @ok="handleOk" @cancel="handleCancel">
        <template #closeIcon>
            <span class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all">
                <CloseOutlined class="text-lg" />
            </span>
        </template>

        <template #title>
            <div class="text-center text-(--color-text-red) font-bold text-2xl">
                Chỉnh Sửa Môn Học
            </div>
            <hr class="my-2 border-(--color-border-gray)" />
        </template>
        <a-form :model="formState" name="editSubjectForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
            <a-form-item label="Mã môn học" name="code" :rules="[
                { required: true, message: 'Vui lòng nhập mã môn học!' },
                { pattern: /^[A-Z0-9]{2,10}$/, message: 'Mã môn học phải gồm 2-10 ký tự in hoa hoặc số' }
            ]">
                <a-input v-model:value="formState.code" />
            </a-form-item>

            <a-form-item label="Tên môn học" name="name"
                :rules="[{ required: true, message: 'Vui lòng nhập tên môn học!' }]">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item label="Mô tả" name="description">
                <a-textarea v-model:value="formState.description" :rows="4" :style="{ resize: 'none' }"
                    placeholder="Nhập mô tả môn học..." />
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
                Cập nhật Môn Học
            </button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { get, patch, put } from '@/services/callApi';
import { adminUpdateSubject } from '@/services/api';
import { toast } from 'vue3-toastify';

const { open, subject } = defineProps<{
    open: boolean;
    subject: Subject;
    reload: boolean;
}>();

const emit = defineEmits(['update:open', 'update:reload']);
interface Subject {
    id: number;
    name: string;
    code: string;
    description: string;
    totalClasses: number;
    createdAt: string;
    updatedAt: string;
}
interface FormState {
    id: number;
    code: string;
    name: string;
    description: string;

}

const formState = reactive<FormState>({
    id: subject.id,
    code: subject.code,
    name: subject.name,
    description: subject.description,
});

const handleCancel = () => {
    emit('update:open', false);
};

const handleOk = () => {
    toast.promise(
        patch(adminUpdateSubject, { ...formState })
            .then((res) => {
                if (res.code !== 202) {
                    throw new Error(res.message);
                }
                
            }),
        {
            pending: 'Đang cập nhật thông tin',
            success: 'Cập nhật thông tin thành công',
            error: 'Cập nhật thông tin thất bại',
        }).then(() => {
            emit('update:open', false);
            emit('update:reload', true);
        });
};



</script>

<style scoped>
:deep(.ant-input:focus),
:deep(.ant-input:hover),
:deep(.ant-input:active) {
    border-color: var(--color-border-gray);
}
</style>