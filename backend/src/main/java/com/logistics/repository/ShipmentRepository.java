package com.logistics.repository;

import com.logistics.model.Shipment;
import com.logistics.model.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByTrackingId(String trackingId);
    List<Shipment> findByStatus(ShipmentStatus status);
}
