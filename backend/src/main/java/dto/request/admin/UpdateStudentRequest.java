package dto.request.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import model.enums.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStudentRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    // User information
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    private Date dob;
    private Gender gender;
    
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be valid")
    private String phoneNumber;
    
    @Email(message = "Email must be valid")
    private String email;
    private String avatarUrl;
    
    // Student information
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
