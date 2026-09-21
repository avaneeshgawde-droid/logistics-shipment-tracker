package com.logistics.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String trackingId;

    @NotBlank(message = "Sender name is required")
    @Column(nullable = false)
    private String senderName;

    @NotBlank(message = "Receiver name is required")
    @Column(nullable = false)
    private String receiverName;

    @NotBlank(message = "Origin location is required")
    @Column(nullable = false)
    private String origin;

    @NotBlank(message = "Destination location is required")
    @Column(nullable = false)
    private String destination;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status = ShipmentStatus.ORDER_PLACED;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("timestamp ASC")
    private List<ShipmentStatusHistory> statusHistory = new ArrayList<>();

    public Shipment() {}

    public Shipment(String senderName, String receiverName, String origin, String destination, ShipmentStatus status) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.origin = origin;
        this.destination = destination;
        if (status != null) {
            this.status = status;
        }
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (trackingId == null || trackingId.isBlank()) {
            trackingId = "TRK-" + System.currentTimeMillis();
        }
        if (statusHistory.isEmpty()) {
            addStatusHistory(new ShipmentStatusHistory(this, this.status, this.origin, "Shipment order registered."));
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addStatusHistory(ShipmentStatusHistory history) {
        history.setShipment(this);
        this.statusHistory.add(history);
    }

    public void removeStatusHistory(ShipmentStatusHistory history) {
        history.setShipment(null);
        this.statusHistory.remove(history);
    }

    public Long getId() { return id; }

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
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<ShipmentStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<ShipmentStatusHistory> statusHistory) {
        this.statusHistory = statusHistory;
    }
}
