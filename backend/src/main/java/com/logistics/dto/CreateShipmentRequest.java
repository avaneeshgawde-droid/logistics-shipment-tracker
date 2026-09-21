package com.logistics.dto;

import com.logistics.model.ShipmentStatus;
import jakarta.validation.constraints.NotBlank;

public class CreateShipmentRequest {

    @NotBlank(message = "Sender name is required")
    private String senderName;

    @NotBlank(message = "Receiver name is required")
    private String receiverName;

    @NotBlank(message = "Origin location is required")
    private String origin;

    @NotBlank(message = "Destination location is required")
    private String destination;

    private ShipmentStatus initialStatus;

    private String remarks;

    public CreateShipmentRequest() {}

    public CreateShipmentRequest(String senderName, String receiverName, String origin, String destination) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.origin = origin;
        this.destination = destination;
    }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public ShipmentStatus getInitialStatus() { return initialStatus; }
    public void setInitialStatus(ShipmentStatus initialStatus) { this.initialStatus = initialStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
