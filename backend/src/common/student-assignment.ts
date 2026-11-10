export const activeStudentAssignment = `
  SELECT 1 FROM classroom_students AS assigned
  JOIN classrooms AS assignedRoom ON assignedRoom.id = assigned.classroom_id
  WHERE assigned.student_id = student.id
    AND assigned.deleted_at IS NULL AND assignedRoom.deleted_at IS NULL
    AND assigned.academic_year = :assignmentYear
    AND assignedRoom.academic_year = :assignmentYear
`;
