<template>
  <aside class="fixed  top-16 bg-[var(--color-bg-white)] h-[calc(100vh-64px)] md:w-64 w-52  shadow-lg flex flex-col">
    <nav class="flex-grow p-3 space-y-1">
      <RouterLink v-for="item in navItems" :key="item.link" :to="item.link"
        class="flex items-center px-4 py-3 rounded-md text-(--color-text-gray) transition-colors duration-200 hover:bg-gray-100 hover:text-[var(--color-text-red)]"
        exact-active-class="bg-gray-100 text-[var(--color-text-red)] border-l-4 border-[var(--color-text-red)]"
      >
        <component :is="item.icon" class="mr-3 text-lg" />
        <span class="font-medium">{{ item.name }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeOutlined,
  ReadOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons-vue";

const navItems = [
  { link: "/teacher/homeroom", name: "Lớp chủ nhiệm", icon: HomeOutlined },
  { link: "/teacher/schedule", name: "Thời khoá biểu", icon: CalendarOutlined },
  { link: "/teacher/class", name: "Lớp học", icon: ReadOutlined },
  { link: "/teacher/subject", name: "Môn học", icon: ReadOutlined },
  
];
</script>
