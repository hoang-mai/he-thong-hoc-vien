package dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import model.enums.Gender;
import model.enums.Role;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDetailResponse {
    // Base User Information
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private Gender gender;
    private Date dob;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Student-specific information
    private String ethnicity;
    private String idCardNumber;
    private String idCardPlaceOfIssue;
    private String residence;
    private String address;
    private String religion;
    
    // Parent information
    private String motherName;
    private Integer motherYob;
    private String motherPhone;
    private String motherMail;
    private String motherOccupation;
    private String fatherName;
    private Integer fatherYob;
    private String fatherPhone;
    private String fatherMail;
    private String fatherOccupation;
}
