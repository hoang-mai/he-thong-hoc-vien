package dto.response.teacher;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSubjectListResponse {
    
    private Long id;
    private String name;
    private String code;
    private String description;
    private int totalClasses;
    private int teachingClasses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}