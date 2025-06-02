package dto.request.admin;

import java.util.List;

import lombok.Getter;

@Getter
public class AddStudentToClassRequest {
    private List<Long> studentIds;
}
