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
  classroom: Classroom | null;
  prefixId: number;
  genderId: number;
  gradeLevelId: number;
  classrooms: Classroom[];
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
