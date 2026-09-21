package com.logistics.dto;

import com.logistics.model.ShipmentStatus;
import com.logistics.model.ShipmentStatusHistory;
import java.time.LocalDateTime;

public class ShipmentStatusHistoryResponse {

    private Long id;
    private ShipmentStatus status;
    private String location;
    private String remarks;
    private LocalDateTime timestamp;

    public ShipmentStatusHistoryResponse() {}

    public ShipmentStatusHistoryResponse(ShipmentStatusHistory history) {
        this.id = history.getId();
        this.status = history.getStatus();
        this.location = history.getLocation();
        this.remarks = history.getRemarks();
        this.timestamp = history.getTimestamp();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
