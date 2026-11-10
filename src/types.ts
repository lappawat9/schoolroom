export interface Classroom {
  id: number;
  roomNumber: string;
  name: string;
  academicYear: number;
  teacherName: string;
  studentCount?: number;
  gradeLevelId: number;
  gradeLevel: string;
  homeroomTeacherId: number | null;
}
export interface DashboardSummary {
  academicYear: number;
  academicYears: number[];
  totalStudents: number;
  totalClassrooms: number;
  assignedStudents: number;
  unassignedStudents: number;
}
export type StudentClassroom = Pick<
  Classroom,
  "id" | "roomNumber" | "name" | "academicYear"
>;
export interface Student {
  id: number;
  studentCode: string;
  prefix: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  gradeLevel: string;
  enrollmentYear: number;
  classroomId: number | null;
  classroom: StudentClassroom | null;
  prefixId: number;
  genderId: number;
  gradeLevelId: number;
  classrooms: StudentClassroom[];
}
export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
export interface Lookups {
  prefixes: { id: number; name: string; genderId: number | null }[];
  genders: { id: number; code: string; name: string }[];
  grades: { id: number; name: string }[];
  teachers: { id: number; name: string }[];
}

export interface ClassroomHistory {
  id: number;
  classroomId: number;
  roomNumber: string | null;
  roomName: string | null;
  academicYear: number;
  addedAt: string;
  endedAt: string | null;
  classroomDeleted: boolean;
  isActive: boolean;
}
