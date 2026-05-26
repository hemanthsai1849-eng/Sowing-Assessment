package com.ap.agri.cropmonitoring.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SpatialException extends RuntimeException {
    public SpatialException(String message) {
        super(message);
    }

    public SpatialException(String message, Throwable cause) {
        super(message, cause);
    }
}
