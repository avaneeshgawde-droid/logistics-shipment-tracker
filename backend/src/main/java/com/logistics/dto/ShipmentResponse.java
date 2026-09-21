package com.logistics.dto;

import com.logistics.model.Shipment;
import com.logistics.model.ShipmentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ShipmentResponse {

    private Long id;
    private String trackingId;
    private String senderName;
    private String receiverName;
    private String origin;
    private String destination;
    private ShipmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ShipmentStatusHistoryResponse> statusHistory;

    public ShipmentResponse() {}

    public ShipmentResponse(Shipment shipment) {
        this.id = shipment.getId();
        this.trackingId = shipment.getTrackingId();
        this.senderName = shipment.getSenderName();
        this.receiverName = shipment.getReceiverName();
        this.origin = shipment.getOrigin();
        this.destination = shipment.getDestination();
        this.status = shipment.getStatus();
        this.createdAt = shipment.getCreatedAt();
        this.updatedAt = shipment.getUpdatedAt();
        if (shipment.getStatusHistory() != null) {
            this.statusHistory = shipment.getStatusHistory().stream()
                    .map(ShipmentStatusHistoryResponse::new)
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ShipmentStatusHistoryResponse> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<ShipmentStatusHistoryResponse> statusHistory) { this.statusHistory = statusHistory; }
}
