<template>
  <a-modal
    v-bind:open="openAnnouncement"
    :width="800"
    @cancel="emit('update:openAnnouncement', false)"
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
        {{ selectedAnnouncement.title }}
      </div>
      <hr class="my-2 border-(--color-border-gray)" />
    </template>
    <div class="flex flex-col gap-4">
      <p class="text-base font-medium">
        {{ selectedAnnouncement.content }}
      </p>
      <p class="text-sm text-gray-500">Ngày gửi:</p>
      <p class="text-base font-medium">
        {{ dayjs(selectedAnnouncement.date).format("DD/MM/YYYY") }}
      </p>
    </div>
    <template #footer>
      <button
        class="bg-(--color-bg-white) text-(--color-text-red) px-6 py-2 rounded-2xl mr-4 border text-base font-medium"
        @click="emit('update:openAnnouncement', false)"
      >
        Đóng
      </button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { teacherAnnouncement } from "@/services/api";
import { get } from "@/services/callApi";
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";

interface Announcement {
  id: number;
  title: string | null;
  content: string | null;
  date: string | null;
}

const selectedAnnouncement = ref<Announcement>({
  id: 0,
  title: "",
  content: "",
  date: new Date().toString(),
});

const { openAnnouncement, selectedAnnouncementId } = defineProps<{
  openAnnouncement: boolean;
  selectedAnnouncementId: number;
}>();

const emit = defineEmits<{
  (e: "update:openAnnouncement", openAnnouncement: boolean): void;
}>();

const fetchAnnouncement = () => {
  if (selectedAnnouncementId) {
    get(teacherAnnouncement + `/${selectedAnnouncementId}`).then((response) => {
      if (response.code !== 200) {
        toast.error("Failed to fetch announcement");
        throw new Error("Failed to fetch announcement");
      }
      selectedAnnouncement.value = response.data;
    });
  }
};

onMounted(() => {
  fetchAnnouncement();
});

watch(
  () => selectedAnnouncementId,
  (newId) => {
    if (newId) {
      fetchAnnouncement();
    }
  }
);
</script>
