export {};

declare global {
  interface StudentProfile {
    id: number;
    email: string | null;
    fullName: string | null;
    dob: string | null;
    gender: Gender | null;
    phoneNumber: string | null;
    avatarUrl: string | null;

    ethnicity: string | null;
    idCardNumber: string | null;
    idCardPlaceOfIssue: string | null;
    residence: string | null;
    address: string | null;
    religion: string | null;

    motherName: string | null;
    motherYob: number | null;
    motherPhone: string | null;
    motherMail: string | null;
    motherOccupation: string | null;

    fatherName: string | null;
    fatherYob: number | null;
    fatherPhone: string | null;
    fatherMail: string | null;
    fatherOccupation: string | null;
    
  }
  interface BaseProfile{
    id : number;
    email: string | null;
    fullName: string | null;
    dob: number | null;
    gender: Gender | null;
    avatarUrl: string | null;
  }
  type Gender = "MALE" | "FEMALE" | "UNDEFINED";
  type Role = "STUDENT" | "TEACHER" | "ADMIN";
  type Status = "ACTIVE" | "INACTIVE";
  type DiplomaLevel = "HIGH_SCHOOL" | "VOCATIONAL" | "ASSOCIATE" | "DIPLOMA" | "ADVANCED_DIPLOMA" | "BACHELOR" | "POSTGRADUATE_DIPLOMA" | "MASTER" | "DOCTORATE";
  type HomeRoomStatus= "ANTICIPATED" | "EXPELLED" | "GRADUATED";
  type DayOfWeek = "MON" | "TUES" | "WED" | "THUS" | "FRI" | "SAT" | "SUN";

}
