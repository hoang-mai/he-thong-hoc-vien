<template>
  <a-modal
    v-bind:open="open"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
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
        Tạo Lớp Học Mới
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <a-form
      :model="formState"
      :rules="rules"
      ref="formRef"
      layout="vertical"
      name="create_class_form"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item name="className" label="Tên lớp">
          <a-input v-model:value="formState.className" />
        </a-form-item>
        <a-form-item name="finalTermWeight" label="Trọng số cuối kỳ">
          <a-input v-model:value="formState.finalTermWeight" />
        </a-form-item>
      </div>
      <a-form-item name="description" label="Mô tả">
        <a-textarea
          v-model:value="formState.description"
          :rows="4"
          :style="{ resize: 'none' }"
        />
      </a-form-item>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item name="teacherId" label="Giáo viên">
          <div class="relative">
            <a-input
              v-model:value="searchQuery"
              placeholder="Tìm kiếm giáo viên"
              @input="debounceSearch(searchQuery)"
            />
            <div
              v-if="searchResult.length > 0"
              class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-64 overflow-y-auto"
              ref="searchContainerRef"
            >
              <div
                v-for="teacher in searchResult"
                :key="teacher.teacherId"
                class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                @click="handleSelectTeacher(teacher)"
              >
                <img
                  v-if="teacher.avatarUrl"
                  :src="teacher.avatarUrl"
                  class="w-8 h-8 rounded-full object-cover mr-2"
                  alt="Avatar"
                />
                <div
                  v-else
                  class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-2"
                >
                  <UserOutlined class="text-white" />
                </div>
                <div>
                  <div class="font-medium">{{ teacher.fullName }}</div>
                  <div class="text-xs text-gray-500">{{ teacher.email }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="selectedTeacher"
            class="flex items-center mt-2 p-2 bg-gray-100 rounded"
          >
            <img
              v-if="selectedTeacher.avatarUrl"
              :src="selectedTeacher.avatarUrl"
              class="w-8 h-8 rounded-full object-cover mr-2"
              alt="Avatar"
            />
            <div
              v-else
              class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-2"
            >
              <UserOutlined class="text-white" />
            </div>
            <div>
              <div class="font-medium">{{ selectedTeacher.fullName }}</div>
              <div class="text-xs text-gray-500">
                {{ selectedTeacher.email }}
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item name="subjectId" label="Môn học">
          <div class="relative">
            <a-input
              v-model:value="subjectSearchQuery"
              placeholder="Tìm kiếm môn học"
              @input="debounceSubjectSearch(subjectSearchQuery)"
            />
            <div
              v-if="subjectSearchResult.length > 0"
              class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-64 overflow-y-auto"
              ref="subjectSearchContainerRef"
            >
              <div
                v-for="subject in subjectSearchResult"
                :key="subject.subjectId"
                class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                @click="handleSelectSubject(subject)"
              >
                <div
                  class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2"
                >
                  <span class="text-white text-sm font-bold">{{
                    subject.subjectCode.charAt(0)
                  }}</span>
                </div>
                <div>
                  <div class="font-medium">{{ subject.subjectName }}</div>
                  <div class="text-xs text-gray-500">
                    {{ subject.subjectCode }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="selectedSubject"
            class="flex items-center mt-2 p-2 bg-gray-100 rounded"
          >
            <div
              class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2"
            >
              <span class="text-white text-sm font-bold">{{
                selectedSubject.subjectCode.charAt(0)
              }}</span>
            </div>
            <div>
              <div class="font-medium">{{ selectedSubject.subjectName }}</div>
              <div class="text-xs text-gray-500">
                {{ selectedSubject.subjectCode }}
              </div>
            </div>
          </div>
        </a-form-item>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item name="startDate" label="Ngày bắt đầu">
          <a-config-provider :locale="viVN">
            <a-date-picker
              v-model:value="formState.startDate"
              format="DD-MM-YYYY"
              style="width: 100%"
            />
          </a-config-provider>
        </a-form-item>

        <a-form-item name="endDate" label="Ngày kết thúc">
          <a-config-provider :locale="viVN">
            <a-date-picker
              v-model:value="formState.endDate"
              format="DD-MM-YYYY"
              style="width: 100%"
            />
          </a-config-provider>
        </a-form-item>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item name="tuition" label="Học phí">
          <a-input-number
            v-model:value="formState.tuition"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item name="tuitionDueDate" label="Hạn nộp học phí">
          <a-config-provider :locale="viVN">
            <a-date-picker
              v-model:value="formState.tuitionDueDate"
              format="DD-MM-YYYY"
              style="width: 100%"
            />
          </a-config-provider>
        </a-form-item>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item
          name="absenceWarningThreshold"
          label="Ngưỡng cảnh báo vắng"
        >
          <a-input-number
            v-model:value="formState.absenceWarningThreshold"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item name="absenceLimit" label="Giới hạn vắng">
          <a-input-number
            v-model:value="formState.absenceLimit"
            style="width: 100%"
          />
        </a-form-item>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item name="dayOfWeek" label="Ngày trong tuần">
          <a-select
            v-model:value="formState.dayOfWeek"
            placeholder="Chọn ngày trong tuần"
          >
            <a-select-option value="MON">Thứ Hai</a-select-option>
            <a-select-option value="TUES">Thứ Ba</a-select-option>
            <a-select-option value="WED">Thứ Tư</a-select-option>
            <a-select-option value="THURS">Thứ Năm</a-select-option>
            <a-select-option value="FRI">Thứ Sáu</a-select-option>
            <a-select-option value="SAT">Thứ Bảy</a-select-option>
            <a-select-option value="SUN">Chủ Nhật</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="room" label="Phòng học">
          <a-input v-model:value="formState.room" />
        </a-form-item>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a-form-item name="periodStart" label="Tiết bắt đầu">
          <a-input-number
            v-model:value="formState.periodStart"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item name="periodEnd" label="Tiết kết thúc">
          <a-input-number
            v-model:value="formState.periodEnd"
            style="width: 100%"
          />
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="handleCancel"
      >
        Hủy bỏ
      </button>
      <button
        class="bg-(--color-text-red) text-(--color-text-white) px-6 py-2 rounded-2xl text-base font-medium"
        @click="handleOk"
      >
        Tạo Lớp Học
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { get, post } from "@/services/callApi";
import {
  adminSearchTeacher,
  adminCreateClass,
  adminSearchSubject,
} from "@/services/api";
import { toast } from "vue3-toastify";
import { UserOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import viVN from "ant-design-vue/es/locale/vi_VN";

interface SearchResult {
  teacherId: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}

interface Subject {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
}

interface FormState {
  className: string;
  teacherId: string;
  subjectId: string;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  description: string;
  tuition: number;
  tuitionDueDate: dayjs.Dayjs | null;
  finalTermWeight: number;
  absenceWarningThreshold: number;
  absenceLimit: number;
  dayOfWeek: DayOfWeek;
  periodStart: number;
  periodEnd: number;
  room: string;
}

const { open } = defineProps<{
  open: boolean;
  reload: boolean;
}>();

const emit = defineEmits(["update:open", "update:reload"]);

const formRef = ref<FormInstance>();
const searchQuery = ref<string>("");
const searchResult = ref<SearchResult[]>([]);
const searchContainerRef = ref<HTMLElement | null>(null);
const selectedTeacher = ref<SearchResult | null>(null);

// Subject search variables
const subjectSearchQuery = ref<string>("");
const subjectSearchResult = ref<Subject[]>([]);
const subjectSearchContainerRef = ref<HTMLElement | null>(null);
const selectedSubject = ref<Subject | null>(null);

const formState = reactive<FormState>({
  className: "",
  teacherId: "",
  subjectId: "",
  startDate: null,
  endDate: null,
  description: "",
  tuition: 0,
  tuitionDueDate: null,
  finalTermWeight: 0,
  absenceWarningThreshold: 0,
  absenceLimit: 0,
  dayOfWeek: "MON",
  periodStart: 1,
  periodEnd: 2,
  room: "",
});

const rules = {
  className: [{ required: true, message: "Vui lòng nhập tên lớp" }],
  startDate: [
    { required: true, message: "Vui lòng chọn ngày bắt đầu" },
    {
      validator: (_: any, value: dayjs.Dayjs) => {
        if (!value || !formState.endDate) return Promise.resolve();
        if (value.isAfter(formState.endDate)) {
          return Promise.reject(
            new Error("Ngày bắt đầu phải trước ngày kết thúc")
          );
        }
        if (
          formState.tuitionDueDate &&
          value.isAfter(formState.tuitionDueDate)
        ) {
          return Promise.reject(
            new Error("Ngày bắt đầu phải trước hạn nộp học phí")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  endDate: [
    { required: true, message: "Vui lòng chọn ngày kết thúc" },
    {
      validator: (_: any, value: dayjs.Dayjs) => {
        if (!value || !formState.startDate) return Promise.resolve();
        if (formState.startDate.isAfter(value)) {
          return Promise.reject(
            new Error("Ngày kết thúc phải sau ngày bắt đầu")
          );
        }
        if (
          formState.tuitionDueDate &&
          formState.tuitionDueDate.isAfter(value)
        ) {
          return Promise.reject(
            new Error("Hạn nộp học phí phải trước ngày kết thúc")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  tuition: [{ required: true, message: "Vui lòng nhập học phí" }],
  tuitionDueDate: [
    { required: true, message: "Vui lòng chọn hạn nộp học phí" },
    {
      validator: (_: any, value: dayjs.Dayjs) => {
        if (!value) return Promise.resolve();
        if (formState.endDate && value.isAfter(formState.endDate)) {
          return Promise.reject(
            new Error("Hạn nộp học phí phải trước ngày kết thúc")
          );
        }
        if (formState.startDate && formState.startDate.isAfter(value)) {
          return Promise.reject(
            new Error("Hạn nộp học phí phải sau ngày bắt đầu")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  finalTermWeight: [
    { required: true, message: "Vui lòng nhập trọng số" },
    {
      validator: (_: any, value: number) => {
        if (value < 0 || value > 100) {
          return Promise.reject(new Error("Trọng số phải từ 0 đến 100"));
        }
        return Promise.resolve();
      },
    },
  ],
  absenceWarningThreshold: [
    { required: true, message: "Vui lòng nhập ngưỡng cảnh báo vắng" },
    {
      validator: (_: any, value: number) => {
        if (formState.absenceLimit && value > formState.absenceLimit) {
          return Promise.reject(
            new Error("Ngưỡng cảnh báo phải nhỏ hơn hoặc bằng giới hạn vắng")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  absenceLimit: [
    { required: true, message: "Vui lòng nhập giới hạn vắng" },
    {
      validator: (_: any, value: number) => {
        if (
          formState.absenceWarningThreshold &&
          formState.absenceWarningThreshold > value
        ) {
          return Promise.reject(
            new Error("Giới hạn vắng phải lớn hơn hoặc bằng ngưỡng cảnh báo")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  dayOfWeek: [{ required: true, message: "Vui lòng chọn ngày trong tuần" }],
  periodStart: [
    { required: true, message: "Vui lòng nhập tiết bắt đầu" },
    {
      validator: (_: any, value: number) => {
        if (formState.periodEnd && value >= formState.periodEnd) {
          return Promise.reject(
            new Error("Tiết bắt đầu phải nhỏ hơn tiết kết thúc")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  periodEnd: [
    { required: true, message: "Vui lòng nhập tiết kết thúc" },
    {
      validator: (_: any, value: number) => {
        if (formState.periodStart && formState.periodStart >= value) {
          return Promise.reject(
            new Error("Tiết kết thúc phải lớn hơn tiết bắt đầu")
          );
        }
        return Promise.resolve();
      },
    },
  ],
  room: [{ required: true, message: "Vui lòng nhập phòng học" }],
};

// Watchers to trigger re-validation when related fields change
watch(
  () => formState.startDate,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["endDate", "tuitionDueDate"]);
    }
  }
);

watch(
  () => formState.endDate,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["startDate", "tuitionDueDate"]);
    }
  }
);

watch(
  () => formState.tuitionDueDate,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["startDate", "endDate"]);
    }
  }
);

watch(
  () => formState.absenceWarningThreshold,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["absenceLimit"]);
    }
  }
);

watch(
  () => formState.absenceLimit,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["absenceWarningThreshold"]);
    }
  }
);

watch(
  () => formState.periodStart,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["periodEnd"]);
    }
  }
);

watch(
  () => formState.periodEnd,
  () => {
    if (formRef.value) {
      formRef.value.validateFields(["periodStart"]);
    }
  }
);

const debounceSearch = debounce((value: string) => {
  handleSearchNow(value);
}, 500);

// Subject search debounce function
const debounceSubjectSearch = debounce((value: string) => {
  handleSubjectSearchNow(value);
}, 500);

const handleSelectTeacher = (teacher: SearchResult) => {
  selectedTeacher.value = teacher;
  formState.teacherId = teacher.teacherId.toString();
  searchQuery.value = "";
  searchResult.value = [];
};

// Subject selection handler
const handleSelectSubject = (subject: Subject) => {
  selectedSubject.value = subject;
  formState.subjectId = subject.subjectId.toString();
  subjectSearchQuery.value = "";
  subjectSearchResult.value = [];
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainerRef.value &&
    !searchContainerRef.value.contains(event.target as Node)
  ) {
    searchResult.value = [];
  }

  if (
    subjectSearchContainerRef.value &&
    !subjectSearchContainerRef.value.contains(event.target as Node)
  ) {
    subjectSearchResult.value = [];
  }
};

const handleSearchNow = (value: string) => {
  if (!value) {
    searchResult.value = [];
    return;
  }

  get(adminSearchTeacher, { query: value })
    .then((res: any) => {
      if (res.code !== 200) {
        toast.error("Tìm kiếm thất bại");
        return;
      }
      searchResult.value = res.data;
    })
    .catch(() => {
      searchResult.value = [];
    });
};

// Subject search function
const handleSubjectSearchNow = (value: string) => {
  if (!value) {
    subjectSearchResult.value = [];
    return;
  }

  get(adminSearchSubject, { query: value }).then((res: any) => {
    if (res.code !== 200) {
      toast.error("Tìm kiếm môn học thất bại");
      return;
    }
    subjectSearchResult.value = res.data;
    console.log("Subject search result:", subjectSearchResult.value);
  });
};

const handleOk = () => {
  formRef.value?.validate().then(() => {
    // Additional validation checks
    if (!selectedTeacher.value) {
      toast.error("Vui lòng chọn giáo viên");
      return;
    }

    if (!selectedSubject.value) {
      toast.error("Vui lòng chọn môn học");
      return;
    }

    // Check if all required fields are filled before submitting
    if (!formState.className || !formState.className.trim()) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }

    if (!formState.startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }

    if (!formState.endDate) {
      toast.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    if (!formState.tuition) {
      toast.error("Vui lòng nhập học phí");
      return;
    }

    if (!formState.tuitionDueDate) {
      toast.error("Vui lòng chọn hạn nộp học phí");
      return;
    }

    if (formState.finalTermWeight === undefined || formState.finalTermWeight === null) {
      toast.error("Vui lòng nhập trọng số cuối kỳ");
      return;
    }

    if (formState.absenceWarningThreshold === undefined || formState.absenceWarningThreshold === null) {
      toast.error("Vui lòng nhập ngưỡng cảnh báo vắng");
      return;
    }

    if (formState.absenceLimit === undefined || formState.absenceLimit === null) {
      toast.error("Vui lòng nhập giới hạn vắng");
      return;
    }

    if (!formState.dayOfWeek) {
      toast.error("Vui lòng chọn ngày trong tuần");
      return;
    }

    if (formState.periodStart === undefined || formState.periodStart === null) {
      toast.error("Vui lòng nhập tiết bắt đầu");
      return;
    }

    if (formState.periodEnd === undefined || formState.periodEnd === null) {
      toast.error("Vui lòng nhập tiết kết thúc");
      return;
    }

    if (!formState.room || !formState.room.trim()) {
      toast.error("Vui lòng nhập phòng học");
      return;
    }

    // Validate final term weight (should be between 0 and 1 for backend, but displayed as percentage)
    const finalTermWeightDecimal = formState.finalTermWeight;
    if (finalTermWeightDecimal < 0 || finalTermWeightDecimal > 1) {
      toast.error("Trọng số cuối kỳ phải từ 0 đến 1");
      return;
    }

    const submitData = {
      className: formState.className,
      teacherId: Number(formState.teacherId),
      subjectId: Number(formState.subjectId),
      startDate: formState.startDate?.format("YYYY-MM-DD"),
      endDate: formState.endDate?.format("YYYY-MM-DD"),
      description: formState.description,
      tuition: formState.tuition,
      tuitionDueDate: formState.tuitionDueDate?.format("YYYY-MM-DD"),
      finalTermWeight: finalTermWeightDecimal, // Convert percentage to decimal
      absenceWarningThreshold: formState.absenceWarningThreshold,
      absenceLimit: formState.absenceLimit,
      dayOfWeek: formState.dayOfWeek,
      periodStart: formState.periodStart,
      periodEnd: formState.periodEnd,
      room: formState.room,
    };

    toast.promise(
      post(adminCreateClass, submitData).then((res: any) => {
        if (res.code !== 201) {
          throw new Error(res.error || "Tạo lớp học thất bại");
        }
        emit("update:open", false);
        emit("update:reload", true);
      }),
      {
        pending: "Đang tạo lớp học...",
        success: "Tạo lớp học thành công!",
        error: {
          render: (error: any) => {
            console.log("Error creating class:", error);
            return error.data.message || "Giáo viên đã được phân công lớp học khác này";
          },
        },
      }
    );
  });
};

const handleCancel = () => {
  emit("update:open", false);
};

// Add/remove event listeners for click outside
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
:deep(.ant-slider-track) {
  background-color: var(--color-bg-red);
}

:deep(.ant-slider-handle) {
  border-color: var(--color-bg-red);
}
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
