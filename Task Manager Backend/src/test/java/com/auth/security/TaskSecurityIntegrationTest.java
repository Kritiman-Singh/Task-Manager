package com.auth.security;

import com.auth.authentication.entities.User;
import com.auth.authentication.repositories.UserRepository;
import com.auth.authentication.services.impl.JwtService;
import com.auth.entities.Task;
import com.auth.repositories.TaskRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private User userA;
    private User userB;
    private String tokenA;
    private String tokenB;
    private UUID taskIdB;

    @BeforeEach
    void setUp() {
        userA = userRepository.save(User.builder()
                .email("userA@example.com")
                .name("User A")
                .enable(true)
                .build());
        userB = userRepository.save(User.builder()
                .email("userB@example.com")
                .name("User B")
                .enable(true)
                .build());

        tokenA = jwtService.generateAccessToken(userA);
        tokenB = jwtService.generateAccessToken(userB);

        Task taskB = taskRepository.save(Task.builder()
                .user(userB)
                .title("Task of user B")
                .taskDate(LocalDate.now())
                .build());
        taskIdB = taskB.getId();
    }

    @AfterEach
    void tearDown() {
        taskRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    void testUserCannotAccessOtherUserTask() throws Exception {
        mockMvc.perform(get("/api/v1/tasks/{taskId}", taskIdB)
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUserCannotUpdateOtherUserTask() throws Exception {
        String body = """
                {"title":"Hijacked","taskDate":"2026-08-01"}
                """;
        mockMvc.perform(put("/api/v1/tasks/{taskId}", taskIdB)
                        .header("Authorization", bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUserCannotDeleteOtherUserTask() throws Exception {
        mockMvc.perform(delete("/api/v1/tasks/{taskId}", taskIdB)
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUserCannotCompleteOtherUserTask() throws Exception {
        mockMvc.perform(patch("/api/v1/tasks/{taskId}/complete", taskIdB)
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUnauthenticatedCannotAccessTasks() throws Exception {
        mockMvc.perform(get("/api/v1/tasks/today"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testUserCanAccessOwnTask() throws Exception {
        Task taskA = taskRepository.save(Task.builder()
                .user(userA)
                .title("Task of user A")
                .taskDate(LocalDate.now())
                .build());

        mockMvc.perform(get("/api/v1/tasks/{taskId}", taskA.getId())
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Task of user A"));
    }

    @Test
    void testDashboardOnlyShowsCurrentUserTasks() throws Exception {
        // userB has a task today; userA has none
        taskRepository.save(Task.builder()
                .user(userB)
                .title("Task of user B")
                .taskDate(LocalDate.now())
                .status(com.auth.enums.TaskStatus.COMPLETED)
                .build());

        MvcResult result = mockMvc.perform(get("/api/v1/dashboard")
                        .header("Authorization", bearer(tokenA)))
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        JsonNode data = root.get("data");
        assertEquals(0, data.get("totalTasks").asLong());
        assertEquals(0, data.get("completedTasks").asLong());

        MvcResult resultB = mockMvc.perform(get("/api/v1/dashboard")
                        .header("Authorization", bearer(tokenB)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode dataB = objectMapper.readTree(resultB.getResponse().getContentAsString()).get("data");
        assertEquals(2, dataB.get("totalTasks").asLong());
        assertEquals(1, dataB.get("completedTasks").asLong());
    }

    @Test
    void testCreateTaskBindsToAuthenticatedUser() throws Exception {
        String body = """
                {"title":"New task","taskDate":"2026-08-01","priority":"HIGH"}
                """;
        mockMvc.perform(post("/api/v1/tasks")
                        .header("Authorization", bearer(tokenA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("New task"));
    }
}
