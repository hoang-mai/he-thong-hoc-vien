import { createWebHistory, createRouter } from "vue-router";

import Login from "@/views/Login.vue";
import { default as AdminLayout } from "@/views/admin/Layout.vue";
import { default as Layout } from "@/views/Layout.vue";
import { default as StudentLayout } from "@/views/student/Layout.vue";
import { default as TeacherLayout } from "@/views/teacher/Layout.vue";
import { default as StudentProfile } from "@/views/student/profile/Profile.vue";
import { default as StudentHome } from "@/views/student/Home.vue";
import { default as Account } from "@/views/admin/account/Account.vue";
import { default as UserLayout } from "@/views/admin/user/Layout.vue";
import { default as AdminSubjectLayout } from "@/views/admin/subject/Layout.vue";
import { default as AdminDetailSubject } from "@/views/admin/subject/DetailSubject.vue";
import Announcement from "@/views/admin/announcement/Announcement.vue";
import { default as AdminSubject } from "@/views/admin/subject/Subject.vue";
import { default as StudentSubjectLayout } from "@/views/student/subject/Layout.vue";
import { default as StudentSubject } from "@/views/student/subject/Subject.vue";
import { default as StudentDetailSubject } from "@/views/student/subject/DetailSubject.vue";
import User from "@/views/admin/user/User.vue";
import Student from "@/views/admin/user/student/Student.vue";
import Admin from "@/views/admin/user/admin/Admin.vue";
import Teacher from "@/views/admin/user/teacher/Teacher.vue";
import { default as TeacherSubjectLayout } from "@/views/teacher/subject/Layout.vue";
import { default as TeacherSubject } from "@/views/teacher/subject/Subject.vue";
import { default as TeacherDetailSubject } from "@/views/teacher/subject/DetailSubject.vue";
import { default as TeacherProfile } from "@/views/teacher/profile/Profile.vue";
import { default as AdminHomeRoomLayout } from "@/views/admin/homeroom/Layout.vue";
import { default as AdminHomeRoom } from "@/views/admin/homeroom/HomeRoom.vue";
import { default as AdminDetailHomeRoom } from "@/views/admin/homeroom/DetailHomeRoom.vue";
import { default as TeacherHomeRoom } from "@/views/teacher/homeroom/HomeRoom.vue";
import { default as StudentHomeRoom } from "@/views/student/homeroom/HomeRoom.vue";
import { default as AdminClass } from "@/views/admin/class/Class.vue";
import { default as AdminDetailClass } from "@/views/admin/class/DetailClass.vue";
import { default as AdminClassLayout } from "@/views/admin/class/Layout.vue";
import { default as TeacherClassLayout } from "@/views/teacher/class/Layout.vue";
import { default as TeacherClass } from "@/views/teacher/class/Class.vue";
import { default as TeacherDetailClass } from "@/views/teacher/class/DetailClass.vue";
import { default as StudentClassLayout } from "@/views/student/class/Layout.vue";
import { default as StudentClass } from "@/views/student/class/Class.vue";
import { default as StudentDetailClass } from "@/views/student/class/DetailClass.vue";
import { default as TeacherSchedule } from "@/views/teacher/Schedule.vue";
import { default as StudentSchedule } from "@/views/student/Schedule.vue";
import { default as TuitionLayout } from "@/views/admin/tuition/Layout.vue";
import Tuition from "@/views/student/Tuition.vue";
import { default as AdminScheduleExam } from "@/views/admin/ScheduleExam.vue";
import { default as StudentScheduleExam } from "@/views/student/ScheduleExam.vue";
const routes = [
  { path: "/login", component: Login },

  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: StudentLayout,
        children: [
          { path: "", component: StudentHome },
          { path: "profile", component: StudentProfile },
          { path: "schedule", component: StudentSchedule },
          { path: "homeroom", component: StudentHomeRoom },
          { path :"schedule-exam", component: StudentScheduleExam },
          {
            path: "tuition",
            component: Tuition,
          },
          {
            path: "subject",
            component: StudentSubjectLayout,
            children: [
              { path: "", component: StudentSubject },
              {
                path: ":subjectId",
                component: StudentDetailSubject,
                name: "studentSubject",
              },
            ],
          },
          {
            path: "class",
            component: StudentClassLayout,
            children: [
              { path: "", component: StudentClass },
              {
                path: ":classId",
                component: StudentDetailClass,
                name: "studentClass",
              },
            ],
          },
          {
            path: "schedule",
            component: StudentSchedule,
          },
        ],
      },
      {
        path: "teacher",
        component: TeacherLayout,
        children: [
          { path: "profile", component: TeacherProfile },
          {
            path: "subject",
            component: TeacherSubjectLayout,
            children: [
              { path: "", component: TeacherSubject },
              {
                path: ":subjectId",
                component: TeacherDetailSubject,
                name: "teacherSubject",
              },
            ],
          },
          { path: "homeroom", component: TeacherHomeRoom },
          { path: "class", component: TeacherClassLayout,
            children: [
              { path: "", component: TeacherClass },
              {
                path: ":classId",
                component: TeacherDetailClass,
                name: "teacherClass",
              },
            ],
          },
          { path: "schedule", component: TeacherSchedule },
        ],
      },
      {
        path: "admin",
        component: AdminLayout,
        children: [
          {
            path: "class",
            component: AdminClassLayout,
            children: [
              { path: "", component: AdminClass },
              {
                path: ":classId",
                component: AdminDetailClass,
                name: "adminClass",
              },
            ],
          },
          { path: "account", component: Account },
          { path: "announcement", component: Announcement },
          { path: "schedule-exam", component: AdminScheduleExam },
          {
            path: "homeroom",
            component: AdminHomeRoomLayout,
            children: [
              { path: "", component: AdminHomeRoom },
              {
                path: ":homeRoomId",
                component: AdminDetailHomeRoom,
                name: "adminHomeRoom",
              },
            ],
          },
          {
            path: "subject",
            component: AdminSubjectLayout,
            children: [
              { path: "", component: AdminSubject },
              {
                path: ":subjectId",
                component: AdminDetailSubject,
                name: "adminSubject",
              },
            ],
          },
          {
            path: "users",
            component: UserLayout,
            children: [
              { path: "", component: User },
              {
                path: "student/:studentId",
                name: "student",
                component: Student,
              },
              {
                path: "teacher/:teacherId",
                component: Teacher,
                name: "teacher",
              },
              { path: "admin/:adminId", component: Admin, name: "admin" },
            ],
          },
          {
            path: "tuition",
            component: TuitionLayout,
            
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
