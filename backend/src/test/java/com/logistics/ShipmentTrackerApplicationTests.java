package com.logistics;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.logistics.dto.CreateShipmentRequest;
import com.logistics.dto.LoginRequest;
import com.logistics.dto.RegisterRequest;
import com.logistics.dto.UpdateStatusRequest;
import com.logistics.model.Role;
import com.logistics.model.ShipmentStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ShipmentTrackerApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() throws Exception {
        // Create Admin user & obtain JWT token
        RegisterRequest adminRegister = new RegisterRequest("Test Admin", "testadmin@logistics.com", "adminpass123", Role.ADMIN);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminRegister)));

        LoginRequest adminLogin = new LoginRequest("testadmin@logistics.com", "adminpass123");
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String adminResponse = adminResult.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(adminResponse).get("token").asText();

        // Create Customer user & obtain JWT token
        RegisterRequest customerRegister = new RegisterRequest("Test Customer", "testcustomer@logistics.com", "customerpass123", Role.CUSTOMER);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerRegister)));

        LoginRequest customerLogin = new LoginRequest("testcustomer@logistics.com", "customerpass123");
        MvcResult customerResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customerLogin)))
                .andExpect(status().isOk())
                .andReturn();

        String customerResponse = customerResult.getResponse().getContentAsString();
        customerToken = objectMapper.readTree(customerResponse).get("token").asText();
    }

    @Test
    @DisplayName("Test 1: Health Check Endpoint")
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("Shipment Tracker API"));
    }

    @Test
    @DisplayName("Test 2: Create Shipment, Fetch, Update Status, and Delete")
    void testFullShipmentLifecycle() throws Exception {
        // 1. Create Shipment
        CreateShipmentRequest createReq = new CreateShipmentRequest(
                "Nihar Karkera",
                "Avaneesh Gawde",
                "Mumbai Port",
                "Pune Hub"
        );
        createReq.setInitialStatus(ShipmentStatus.ORDER_PLACED);
        createReq.setRemarks("Express Priority Shipment");

        MvcResult createRes = mockMvc.perform(post("/api/shipments")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.trackingId").exists())
                .andExpect(jsonPath("$.status").value("ORDER_PLACED"))
                .andReturn();

        String trackingId = objectMapper.readTree(createRes.getResponse().getContentAsString()).get("trackingId").asText();

        // 2. Track Shipment Publicly
        mockMvc.perform(get("/api/shipments/" + trackingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackingId").value(trackingId))
                .andExpect(jsonPath("$.senderName").value("Nihar Karkera"));

        // 3. Get Shipment History
        mockMvc.perform(get("/api/shipments/" + trackingId + "/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("ORDER_PLACED"));

        // 4. Update Status as Admin
        UpdateStatusRequest updateReq = new UpdateStatusRequest(
                ShipmentStatus.IN_TRANSIT,
                "Expressway Toll Plaza",
                "Departed Mumbai hub"
        );

        mockMvc.perform(put("/api/shipments/" + trackingId + "/status")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_TRANSIT"));

        // 5. Delete Shipment as Admin
        mockMvc.perform(delete("/api/shipments/" + trackingId)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        // 6. Verify 404 Not Found after deletion
        mockMvc.perform(get("/api/shipments/" + trackingId))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test 3: Authorization Checks - Non-Admin update status receives 403 Forbidden")
    void testCustomerForbiddenStatusUpdate() throws Exception {
        UpdateStatusRequest updateReq = new UpdateStatusRequest(ShipmentStatus.DELIVERED, "Location", "Delivered");

        mockMvc.perform(put("/api/shipments/TRK-NONEXISTENT/status")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Test 4: Invalid Request Payload Validation (400 Bad Request)")
    void testInvalidCreateShipmentPayload() throws Exception {
        CreateShipmentRequest invalidReq = new CreateShipmentRequest("", "", "", "");

        mockMvc.perform(post("/api/shipments")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }
}
