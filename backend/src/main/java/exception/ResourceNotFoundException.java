package exception;

/**
 * Exception thrown when a requested resource cannot be found
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s with id %d not found", resource, id));
    }
    
    public ResourceNotFoundException(String resource, String identifier, String value) {
        super(String.format("%s with %s %s not found", resource, identifier, value));
    }
}
