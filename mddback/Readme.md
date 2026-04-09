# Monde de Dev - Backend

**Social Network for Developers**

This project is the backend for a social platform dedicated to developers, built with **Spring Boot 4.0.2**, **Java 21**, and featuring security, data management, and REST API capabilities.

---

##  Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## 🔧 Prerequisites

- **Java 21** (or higher)
- **Maven 3.9+**
- **MySQL 8+** (or any other RDBMS compatible with Spring Data JPA)
- **Docker** (optional, for testing with H2 or container deployment)

---

##  Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jprodrigues644/mdd.git
   cd mdd
   ```

2. **Install Maven dependencies**:
   ```bash
   mvn clean install
   ```

---

##  Configuration

1. **Configure the database**:
   Edit the `src/main/resources/application.properties` (or `application.yml`) file to add your MySQL connection details:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/mdd_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

2. **Configure JWT**:
   Add a secret key for JWT token generation in the configuration file:
   ```properties
   jwt.secret=your_jwt_secret_key
   jwt.expiration=86400000 # 24 hours in milliseconds
   ```

---

##  Running the Application

1. **Start the application**:
   ```bash
   mvn spring-boot:run
   ```
   The application will be available at: [http://localhost:8080](http://localhost:8080).

2. **Access API documentation** (if Swagger/OpenAPI is configured):
   [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

##  Testing

1. **Run unit and integration tests**:
   ```bash
   mvn test
   ```

2. **Check code coverage with JaCoCo**:
   ```bash
   mvn verify
   ```
   The coverage report will be generated in `target/site/jacoco/index.html`.

---

##  Project Structure

```
src/
├── main/
│   ├── java/com/orion/mdd/
│   │   ├── config/          # Spring configuration (Security, Web, etc.)
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects (DTO)
│   │   ├── exception/       # Exception handling
│   │   ├── mapper/          # MapStruct mappers
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # Security logic (JWT, Auth)
│   │   └── service/         # Business services
│   └── resources/
│       ├── application.properties # Application configuration
│       └── ...
└── test/                    # Unit and integration tests
```

---

## Technologies Used

| Category          | Technologies                                                                 |
|-------------------|------------------------------------------------------------------------------|
| **Backend**       | Spring Boot 4.0.2, Java 21                                                    |
| **Database**      | MySQL, H2 (for testing)                                                      |
| **Security**      | Spring Security, JWT (JJWT)                                                  |
| **ORM**           | Spring Data JPA                                                              |
| **Mapping**       | MapStruct                                                                    |
| **Testing**       | JUnit 5, Mockito, JaCoCo (code coverage)                                     |
| **Tools**         | Lombok, Maven                                                                |

---
