package dto.request.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHomeroomRequest {
    
    @NotBlank(message = "Homeroom name cannot be empty")
    private String name;
    
    @NotNull(message = "Teacher ID is required")
    private Long teacherId;
}