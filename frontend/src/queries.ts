const studentFields = `
  id studentCode prefixId prefix firstName lastName genderId gender birthDate
  gradeLevelId gradeLevel enrollmentYear classroomId
  classroom { id roomNumber name academicYear }
  classrooms { id roomNumber name academicYear }
`;

const classroomFields = `
  id roomNumber name academicYear gradeLevelId gradeLevel
  homeroomTeacherId teacherName studentCount
`;

export const STUDENTS = `
  query Students($filter: StudentFilterInput) {
    result: students(filter: $filter) {
      data { ${studentFields} }
      total page pageSize
    }
  }
`;

export const CLASSROOMS = `
  query Classrooms($filter: ClassroomFilterInput) {
    result: classrooms(filter: $filter) {
      data { ${classroomFields} }
      total page pageSize
    }
  }
`;

export const LOOKUPS = `
  query Lookups {
    result: lookups {
      prefixes { id name genderId }
      genders { id code name }
      grades { id name }
      teachers { id name }
    }
  }
`;

export const CLASSROOM_STUDENTS = `
  query ClassroomStudents($classroomId: Int!, $filter: StudentFilterInput) {
    result: classroomStudents(classroomId: $classroomId, filter: $filter) {
      data { ${studentFields} }
      total page pageSize
    }
  }
`;

export const CREATE_STUDENT = `
  mutation CreateStudent($input: CreateStudentInput!) {
    result: createStudent(input: $input) { id }
  }
`;

export const UPDATE_STUDENT = `
  mutation UpdateStudent($id: Int!, $input: UpdateStudentInput!) {
    result: updateStudent(id: $id, input: $input) { id }
  }
`;

export const DELETE_STUDENT = `
  mutation DeleteStudent($id: Int!) {
    result: deleteStudent(id: $id)
  }
`;

export const CREATE_CLASSROOM = `
  mutation CreateClassroom($input: CreateClassroomInput!) {
    result: createClassroom(input: $input) { id }
  }
`;

export const UPDATE_CLASSROOM = `
  mutation UpdateClassroom($id: Int!, $input: UpdateClassroomInput!) {
    result: updateClassroom(id: $id, input: $input) { id }
  }
`;

export const DELETE_CLASSROOM = `
  mutation DeleteClassroom($id: Int!) {
    result: deleteClassroom(id: $id)
  }
`;

export const ASSIGN_STUDENT = `
  mutation AssignStudent($classroomId: Int!, $studentId: Int!) {
    result: assignStudent(classroomId: $classroomId, studentId: $studentId) { id }
  }
`;

export const REMOVE_STUDENT_FROM_CLASSROOM = `
  mutation RemoveStudentFromClassroom($classroomId: Int!, $studentId: Int!) {
    result: removeStudentFromClassroom(classroomId: $classroomId, studentId: $studentId) { id }
  }
`;
