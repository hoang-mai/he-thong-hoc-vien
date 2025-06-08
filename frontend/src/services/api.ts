export const login = "/api/v1/auth/login";
export const logout = "/api/v1/auth/logout";
export const refresh = "api/v1/auth/refresh";

//admin
export const adminSearchTeacher = "/api/v1/admin/search/teacher";
export const adminSearchStudent = "/api/v1/admin/search/student";
export const adminSearchSubject = "/api/v1/admin/search/subject";
export const adminAccount = "/api/v1/admin/account";
export const adminCreateAccount = "/api/v1/admin/account/create";
export const adminGetAllAccounts = "/api/v1/admin/account/all";
export const adminResetAccountPassword = "/api/v1/admin/account/reset-password";
export const adminChangeAccountPassword =
  "api/v1/admin/account/change-password";
export const adminCreateAnnouncement = "/api/v1/admin/announcement/create";
export const adminGetAllAnnouncements = "/api/v1/admin/announcement/all";
export const adminAnnouncement = "/api/v1/admin/announcement";
export const adminUpdateAnnouncement = "/api/v1/admin/announcement/update";
export const adminGetAllUsers = "/api/v1/admin/users/all";
export const adminGetUserStudent = "/api/v1/admin/users/student";
export const adminUpdateUserStudent = "/api/v1/admin/users/update/student";
export const adminGetUserAdmin = "/api/v1/admin/users/admin";
export const adminUpdateUserAdmin = "/api/v1/admin/users/update/admin";
export const adminGetUserTeacher = "/api/v1/admin/users/teacher";
export const adminUpdateUserTeacher = "/api/v1/admin/users/update/teacher";
export const adminSubject = "/api/v1/admin/subject";
export const adminCreateSubject = "/api/v1/admin/subject/create";
export const adminGetAllSubjects = "/api/v1/admin/subject/all";
export const adminUpdateSubject = "/api/v1/admin/subject/update";
export const adminHomeRoom = "/api/v1/admin/homeroom";
export const adminGetAllHomeRooms = "/api/v1/admin/homeroom/all";
export const adminCreateHomeRoom = "/api/v1/admin/homeroom/create";
export const adminUpdateHomeRoom = "/api/v1/admin/homeroom/update";
export const adminAddStudentToHomeRoom =
  "/api/v1/admin/homeroom/students/batch";
export const adminClass = "/api/v1/admin/class";
export const adminGetAllClasses = "/api/v1/admin/class/all";
export const adminCreateClass = "/api/v1/admin/class/create";
export const adminRemoveStudentFromClass =
  "/api/v1/admin/class/students/remove";

//admin tuition endpoints
export const adminGetAllTuitions = "/api/v1/admin/tuition/all";
export const adminGetNotPaidTuitions = '/api/v1/admin/tuition/not-paid';
export const adminUpdateTuition = "/api/v1/admin/tuition/update-status";

//admin exam
export const adminGetAllExamsByClass = "/api/v1/admin/exam/byClass";
export const adminCreateExam = "/api/v1/admin/exam/create";
export const adminUpdateGrade = "/api/v1/admin/exam/update-grade";
export const adminScheduleExam ='/api/v1/admin/exam/schedule-exam';
export const adminExam= "/api/v1/admin/exam";

//student
export const studentAccount = "/api/v1/student/account";
export const studentChangeAccountPassword =
  "/api/v1/student/account/change-password";
export const studentInformation = "/api/v1/student/information";
export const studentGetAnnouncementCurrentWeek =
  "/api/v1/student/announcement/week";
export const studentAnnouncement = "/api/v1/student/announcement";
export const studentGetAllAnnouncements = "/api/v1/student/announcement/all";
export const studentGetAllSubjects = "/api/v1/student/subject/all";
export const studentSubject = "/api/v1/student/subject";
export const studentHomeRoom = "/api/v1/student/homeroom";
export const studentGetAllClasses = "/api/v1/student/class/all";
export const studentClass = "/api/v1/student/class";
export const studentSchedule = "/api/v1/student/schedule";
export const studentGetAllTuitions = "/api/v1/student/tuition/all";
export const studentScheduleExam = '/api/v1/student/exam/schedule-exam';
export const studentGetAllGrades = "/api/v1/student/grade/all";

//teacher
export const teacherAccount = "/api/v1/teacher/account";
export const teacherChangeAccountPassword =
  "/api/v1/teacher/account/change-password";
export const teacherInformation = "/api/v1/teacher/information";
export const teacherGetAnnouncementCurrentWeek =
  "/api/v1/teacher/announcement/week";
export const teacherAnnouncement = "/api/v1/teacher/announcement";
export const teacherGetAllAnnouncements = "/api/v1/teacher/announcement/all";
export const teacherGetAllSubjects = "/api/v1/teacher/subject/all";
export const teacherSubject = "/api/v1/teacher/subject";
export const teacherHomeRoom = "/api/v1/teacher/homeroom";
export const teacherGetAllClasses = "/api/v1/teacher/class/all";
export const teacherClass = "/api/v1/teacher/class";
export const teacherGetAttendance = "/api/v1/teacher/attendance/byClass";
export const teacherCreateAttendance = "/api/v1/teacher/attendance/create";
export const teacherSchedule = "/api/v1/teacher/schedule";

//search
export const searchUser = "/api/v1/search/user";
export const searchUserView = "/api/v1/search/user/view";
