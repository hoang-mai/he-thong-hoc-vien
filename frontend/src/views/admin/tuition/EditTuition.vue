<template>
  <a-modal
    v-bind:open="open"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirm-loading="loading"
    width="600px"
  >
    <template #closeIcon>
      <span
        class="w-8 h-8 flex items-center justify-center !hover:rounded-full hover:bg-gray-200 transition-all"
      >
        <CloseOutlined class="text-lg" />
      </span>
    </template>
    <template #title>
      <div class="text-center text-(--color-text-red) font-bold text-2xl">
        Cập Nhật Học Phí
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-form :model="form" layout="vertical" ref="formRef">
      <a-form-item
        label="Tên Lớp"
        name="className"
        :rules="[{ required: true, message: 'Vui lòng nhập tên lớp!' }]"
      >
        <a-input v-model:value="form.className" :disabled="true" />
      </a-form-item>

      <a-form-item
        label="Học Phí (VNĐ)"
        name="tuition"
        :rules="[{ required: true, message: 'Vui lòng nhập học phí!' }]"
      >
        <a-input-number
          v-model:value="form.tuition"
          :min="0"
          :formatter="(value: string | number) => formatCurrency(Number(value))"
          :disabled="true"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="Trạng Thái Thanh Toán" name="tuitionStatus">
        <a-select
          v-model:value="form.tuitionStatus"
          placeholder="Chọn trạng thái"
        >
          <a-select-option
            v-for="status in ['PAID', 'UNPAID', 'PROCESSING']"
            :key="status"
            :value="status"
          >
            {{ convertTuitionStatus(status) }}
          </a-select-option>
        </a-select>
      </a-form-item> </a-form
    ><template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleSubmit"
      >
        Cập Nhật Học Phí
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import { toast } from "vue3-toastify";
import { patch } from "@/services/callApi";
import { adminUpdateTuition } from "@/services/api";

interface TuitionRecord {
  id: number;
  className: string;
  tuition: number;
  tuitionStatus: "PAID" | "UNPAID" | "PROCESSING";
}

const props = defineProps<{
  open: boolean;
  reload: boolean;
  tuition: TuitionRecord;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update:reload": [value: boolean];
}>();
const loading = ref(false);
const formRef = ref<FormInstance>();

const form = reactive<TuitionRecord>({
  id: props.tuition ? props.tuition.id : 0,
  className: props.tuition ? props.tuition.className : "",
  tuition: props.tuition ? props.tuition.tuition : 0,
  tuitionStatus: props.tuition ? props.tuition.tuitionStatus : "UNPAID",
});
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};


const handleSubmit = async () => {
  toast
    .promise(
      patch(adminUpdateTuition+`/${form.id}`,{
        status: form.tuitionStatus,
      }).then((res) => {
        if (res.code !== 202) {
          throw new Error(res.error || "Cập nhật học phí thất bại");
        }
        emit("update:reload", true);
        emit("update:open", false);
        formRef.value?.resetFields();
      }),

      {
        pending: "Đang cập nhật học phí...",
        success: "Cập nhật học phí thành công",
        error: {
          render: (error: any) => {
            return error.data.message || "Cập nhật học phí thất bại";
          },
        },
      }
    );
};
const convertTuitionStatus = (status: string) => {
  switch (status) {
    case "PAID":
      return "Đã Thanh Toán";
    case "UNPAID":
      return "Chưa Thanh Toán";
    case "PROCESSING":
      return "Đang Xử Lý";
    default:
      return "Không Xác Định";
  }
};
const handleCancel = () => {
  emit("update:open", false);
  formRef.value?.resetFields();
  
};
</script>
