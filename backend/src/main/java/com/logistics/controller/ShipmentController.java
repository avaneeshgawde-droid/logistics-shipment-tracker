package com.logistics.controller;

import com.logistics.dto.CreateShipmentRequest;
import com.logistics.dto.ShipmentResponse;
import com.logistics.dto.ShipmentStatusHistoryResponse;
import com.logistics.dto.UpdateStatusRequest;
import com.logistics.model.ShipmentStatus;
import com.logistics.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "http://localhost:5173")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping
    public ResponseEntity<List<ShipmentResponse>> getAllShipments() {
        List<ShipmentResponse> shipments = shipmentService.getAllShipments();
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/{trackingId}")
    public ResponseEntity<ShipmentResponse> getByTrackingId(@PathVariable String trackingId) {
        ShipmentResponse shipment = shipmentService.getShipmentByTrackingId(trackingId);
        return ResponseEntity.ok(shipment);
    }

    @PostMapping
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody CreateShipmentRequest request) {
        ShipmentResponse created = shipmentService.createShipment(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{trackingId}/status")
    public ResponseEntity<ShipmentResponse> updateStatus(
            @PathVariable String trackingId,
            @RequestBody(required = false) UpdateStatusRequest body,
            @RequestParam(required = false) ShipmentStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String remarks) {

        UpdateStatusRequest request;
        if (body != null && body.getStatus() != null) {
            request = body;
        } else if (status != null) {
            request = new UpdateStatusRequest(status, location, remarks);
        } else {
            throw new IllegalArgumentException("Status parameter or body is required.");
        }

        ShipmentResponse updated = shipmentService.updateShipmentStatus(trackingId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{trackingId}")
    public ResponseEntity<Void> deleteShipment(@PathVariable String trackingId) {
        shipmentService.deleteShipment(trackingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{trackingId}/history")
    public ResponseEntity<List<ShipmentStatusHistoryResponse>> getShipmentHistory(@PathVariable String trackingId) {
        List<ShipmentStatusHistoryResponse> history = shipmentService.getShipmentHistory(trackingId);
        return ResponseEntity.ok(history);
    }
}
