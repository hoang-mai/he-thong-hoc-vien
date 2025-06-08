package dto.response.teacher;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import model.enums.HomeroomStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherHomeroomStudentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentAvatarUrl;
    private String studentEmail;
    private String studentCode;
    private HomeroomStatus status;
    private String statusName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}