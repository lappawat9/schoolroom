SELECT
    s.student_code,
    CONCAT(s.first_name, ' ', s.last_name) AS full_name,
    g.name AS gender,
    TIMESTAMPDIFF(YEAR, s.birth_date, CURDATE()) AS age,
    c.room_no,
    c.room_name,
    c.academic_year
FROM students AS s
JOIN master_gender AS g ON g.id = s.gender_id
LEFT JOIN (
    SELECT membership.student_id, room.room_no, room.room_name, room.academic_year
    FROM classroom_students AS membership
    JOIN classrooms AS room ON room.id = membership.classroom_id
    WHERE membership.deleted_at IS NULL AND room.deleted_at IS NULL
) AS c ON c.student_id = s.id
WHERE s.deleted_at IS NULL
  AND TIMESTAMPDIFF(YEAR, s.birth_date, CURDATE()) BETWEEN 10 AND 12
ORDER BY s.student_code, c.academic_year, c.room_no;
