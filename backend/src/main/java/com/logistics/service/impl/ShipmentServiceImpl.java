package com.logistics.service.impl;

import com.logistics.dto.CreateShipmentRequest;
import com.logistics.dto.ShipmentResponse;
import com.logistics.dto.ShipmentStatusHistoryResponse;
import com.logistics.dto.UpdateStatusRequest;
import com.logistics.exception.ResourceNotFoundException;
import com.logistics.model.Shipment;
import com.logistics.model.ShipmentStatus;
import com.logistics.model.ShipmentStatusHistory;
import com.logistics.repository.ShipmentRepository;
import com.logistics.repository.ShipmentStatusHistoryRepository;
import com.logistics.service.ShipmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentStatusHistoryRepository historyRepository;

    public ShipmentServiceImpl(ShipmentRepository shipmentRepository,
                               ShipmentStatusHistoryRepository historyRepository) {
        this.shipmentRepository = shipmentRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentResponse> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(ShipmentResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentResponse getShipmentByTrackingId(String trackingId) {
        Shipment shipment = findEntityByTrackingId(trackingId);
        return new ShipmentResponse(shipment);
    }

    @Override
    public ShipmentResponse createShipment(CreateShipmentRequest request) {
        ShipmentStatus status = request.getInitialStatus() != null ? request.getInitialStatus() : ShipmentStatus.ORDER_PLACED;
        
        Shipment shipment = new Shipment(
                request.getSenderName(),
                request.getReceiverName(),
                request.getOrigin(),
                request.getDestination(),
                status
        );

        String trackingId = generateUniqueTrackingId();
        shipment.setTrackingId(trackingId);

        String remarks = (request.getRemarks() != null && !request.getRemarks().isBlank()) 
                ? request.getRemarks() 
                : "Shipment order created.";

        ShipmentStatusHistory initialHistory = new ShipmentStatusHistory(
                shipment,
                status,
                request.getOrigin(),
                remarks
        );
        shipment.addStatusHistory(initialHistory);

        Shipment savedShipment = shipmentRepository.save(shipment);
        return new ShipmentResponse(savedShipment);
    }

    @Override
    public ShipmentResponse updateShipmentStatus(String trackingId, UpdateStatusRequest request) {
        Shipment shipment = findEntityByTrackingId(trackingId);

        shipment.setStatus(request.getStatus());

        String location = (request.getLocation() != null && !request.getLocation().isBlank())
                ? request.getLocation()
                : shipment.getDestination();

        String remarks = (request.getRemarks() != null && !request.getRemarks().isBlank())
                ? request.getRemarks()
                : "Status updated to " + request.getStatus();

        ShipmentStatusHistory newHistory = new ShipmentStatusHistory(
                shipment,
                request.getStatus(),
                location,
                remarks
        );
        shipment.addStatusHistory(newHistory);

        Shipment updatedShipment = shipmentRepository.save(shipment);
        return new ShipmentResponse(updatedShipment);
    }

    @Override
    public void deleteShipment(String trackingId) {
        Shipment shipment = findEntityByTrackingId(trackingId);
        shipmentRepository.delete(shipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShipmentStatusHistoryResponse> getShipmentHistory(String trackingId) {
        // Verify shipment exists first
        findEntityByTrackingId(trackingId);

        return historyRepository.findByShipmentTrackingIdOrderByTimestampAsc(trackingId).stream()
                .map(ShipmentStatusHistoryResponse::new)
                .collect(Collectors.toList());
    }

    private Shipment findEntityByTrackingId(String trackingId) {
        return shipmentRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with tracking ID: " + trackingId));
    }

    private String generateUniqueTrackingId() {
        String trackingId;
        do {
            trackingId = "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (shipmentRepository.findByTrackingId(trackingId).isPresent());
        return trackingId;
    }
}
