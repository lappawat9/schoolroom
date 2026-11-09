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
LEFT JOIN classroom_students AS cs ON cs.id = (
    SELECT history.id
    FROM classroom_students AS history
    JOIN classrooms AS room ON room.id = history.classroom_id
    WHERE history.student_id = s.id
      AND history.deleted_at IS NULL
      AND room.deleted_at IS NULL
    ORDER BY history.academic_year DESC, history.id DESC
    LIMIT 1
)
LEFT JOIN classrooms AS c ON c.id = cs.classroom_id AND c.deleted_at IS NULL
WHERE s.deleted_at IS NULL
  AND TIMESTAMPDIFF(YEAR, s.birth_date, CURDATE()) BETWEEN 10 AND 12
ORDER BY s.student_code;
