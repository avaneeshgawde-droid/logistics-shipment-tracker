package com.logistics.repository;

import com.logistics.model.ShipmentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentStatusHistoryRepository extends JpaRepository<ShipmentStatusHistory, Long> {
    List<ShipmentStatusHistory> findByShipmentIdOrderByTimestampAsc(Long shipmentId);
    List<ShipmentStatusHistory> findByShipmentTrackingIdOrderByTimestampAsc(String trackingId);
}
