package com.logistics.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment_status_history")
public class ShipmentStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    @JsonIgnore
    private Shipment shipment;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status;

    private String location;

    private String remarks;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public ShipmentStatusHistory() {}

    public ShipmentStatusHistory(Shipment shipment, ShipmentStatus status, String location, String remarks) {
        this.shipment = shipment;
        this.status = status;
        this.location = location;
        this.remarks = remarks;
    }

    public ShipmentStatusHistory(Shipment shipment, ShipmentStatus status, String location, String remarks, LocalDateTime timestamp) {
        this.shipment = shipment;
        this.status = status;
        this.location = location;
        this.remarks = remarks;
        this.timestamp = timestamp;
    }

    @PrePersist
    public void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }

    public Shipment getShipment() { return shipment; }
    public void setShipment(Shipment shipment) { this.shipment = shipment; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
