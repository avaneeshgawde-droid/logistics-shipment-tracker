package com.logistics.dto;

import com.logistics.model.ShipmentStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private ShipmentStatus status;

    private String location;

    private String remarks;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(ShipmentStatus status, String location, String remarks) {
        this.status = status;
        this.location = location;
        this.remarks = remarks;
    }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
