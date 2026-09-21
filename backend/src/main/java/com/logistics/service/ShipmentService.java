package com.logistics.service;

import com.logistics.dto.CreateShipmentRequest;
import com.logistics.dto.ShipmentResponse;
import com.logistics.dto.ShipmentStatusHistoryResponse;
import com.logistics.dto.UpdateStatusRequest;

import java.util.List;

public interface ShipmentService {

    List<ShipmentResponse> getAllShipments();

    ShipmentResponse getShipmentByTrackingId(String trackingId);

    ShipmentResponse createShipment(CreateShipmentRequest request);

    ShipmentResponse updateShipmentStatus(String trackingId, UpdateStatusRequest request);

    void deleteShipment(String trackingId);

    List<ShipmentStatusHistoryResponse> getShipmentHistory(String trackingId);
}
