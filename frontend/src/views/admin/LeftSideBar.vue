<template>
  <aside
    class="fixed top-16 bg-[var(--color-bg-white)] h-[calc(100vh-64px)] md:w-64 w-52 shadow-lg flex flex-col"
  >
    <nav class="flex-grow p-3 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.link"
        :to="item.link"
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
  TeamOutlined,
  ReadOutlined,
  CalendarOutlined,
  UserOutlined,
  UserAddOutlined,
  NotificationOutlined,
  WalletOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons-vue";

const navItems = [
  { link: "/admin/class", name: "Lớp học", icon: HomeOutlined },
  { link: "/admin/schedule-exam", name: "Lịch thi", icon: FileTextOutlined },
  { link: "/admin/homeroom", name: "Lớp chủ nhiệm", icon: TeamOutlined },
  { link: "/admin/users", name: "Người dùng", icon: TeamOutlined },
  { link: "/admin/subject", name: "Môn học", icon: ReadOutlined },
  { link: "/admin/tuition", name: "Học phí", icon: DollarOutlined },
    {
    link: "/admin/announcement",
    name: "Thông báo",
    icon: NotificationOutlined,
  },
  { link: "/admin/account", name: "Tài khoản", icon: UserAddOutlined },
];
</script>
