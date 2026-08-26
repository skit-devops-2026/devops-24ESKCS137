# Rental 360
## Business Requirements Document (BRD) & Development Roadmap

### Project Information

**Project Name:** Rental 360

**Project Type:** Full Stack Development (FSD) Project

**Developed By:** Govind Kumar

**Technology Stack:**
- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MySQL
- Authentication: JWT

---

# 1. Project Overview

Rental 360 is a Rental Property Management System designed to manage rooms, tenants, rent collection, electricity billing, and occupancy records for small rental businesses.

The system aims to replace manual record keeping with a centralized digital platform that allows property owners to manage rooms, tenants, payments, and utility charges efficiently.

---

# 2. Problem Statement

Rental property owners often manage tenant records, rent collection, electricity bills, and occupancy details manually using notebooks or spreadsheets.

This creates several challenges:

- Difficulty tracking payments
- Errors in rent calculations
- Poor tenant record management
- Lack of payment history
- No centralized dashboard
- Time-consuming monthly billing process

Rental 360 solves these issues by providing a complete web-based management solution.

---

# 3. Business Objectives

### Primary Objectives

- Digitize rental management operations
- Track tenants efficiently
- Automate rent calculations
- Manage electricity billing
- Maintain payment history
- Generate business insights

### Secondary Objectives

- Reduce manual effort
- Improve record accuracy
- Provide analytics and reports
- Enable future scalability

---

# 4. Scope of Project

## Included Features

### User Authentication

- Login
- Logout
- JWT Authentication
- Protected Routes

### Room Management

- Add Room
- Edit Room
- Delete Room
- View Room Details
- Room Status Tracking

### Tenant Management

- Add Tenant
- Edit Tenant
- Delete Tenant
- View Tenant Information

### Occupancy Management

- Assign Tenant to Room
- Vacate Room
- View Occupancy Status

### Electricity Management

- Enter Meter Readings
- Calculate Units Consumed
- Calculate Electricity Charges

### Payment Management

- Rent Payments
- Electricity Payments
- Water Charges
- Advance Payments
- Miscellaneous Charges

### Dashboard

- Total Rooms
- Occupied Rooms
- Vacant Rooms
- Revenue Summary
- Pending Payments

### Reports

- Monthly Revenue
- Tenant Reports
- Occupancy Reports

---

## Out of Scope (Version 1)

- Mobile Application
- Online Payment Gateway
- Multi-property Management
- SMS Gateway
- AI-based Predictions

---

# 5. Functional Requirements

## Module 1: Authentication

### FR-1

User should be able to login using:

- Email
- Password

### FR-2

System should validate credentials.

### FR-3

Unauthorized users should not access protected pages.

---

## Module 2: Room Management

### FR-4

Owner can create rooms.

Room Information:

- Room Number
- Floor
- Base Rent
- Bathroom Availability
- Maximum Occupancy
- Status

### FR-5

Owner can update room information.

### FR-6

Owner can delete room records.

---

## Module 3: Tenant Management

### FR-7

Owner can register tenants.

Tenant Information:

- Name
- Mobile Number
- Aadhaar Number
- Address
- Emergency Contact
- Joining Date

### FR-8

Owner can edit tenant details.

### FR-9

Owner can remove tenant records.

---

## Module 4: Occupancy Management

### FR-10

Owner can assign tenants to rooms.

### FR-11

System should update room occupancy count.

### FR-12

System should mark room status automatically.

---

## Module 5: Rent Calculation

### Business Rule

Each room has its own base rent.

Every additional occupant increases rent by ₹500.

### Example

Base Rent = ₹3000

Occupants = 3

Final Rent

₹3000 + (2 × ₹500)

= ₹4000

---

## Module 6: Electricity Management

### FR-13

Owner can enter:

- Previous Reading
- Current Reading
- Unit Rate

### FR-14

System calculates:

Units Consumed

Current Reading - Previous Reading

### FR-15

System calculates total electricity bill.

---

## Module 7: Payment Management

### FR-16

Record payment transactions.

Payment Types:

- Rent
- Electricity
- Water
- Advance
- Other

### FR-17

Maintain payment history.

---

## Module 8: Dashboard

### FR-18

Dashboard should display:

- Total Rooms
- Occupied Rooms
- Vacant Rooms
- Monthly Revenue
- Pending Payments

---

# 6. Non-Functional Requirements

### Performance

- Page load time below 3 seconds

### Security

- Password hashing
- JWT Authentication
- Protected APIs

### Reliability

- Proper validation
- Error handling

### Usability

- Mobile Responsive UI
- Easy Navigation

---

# 7. Database Design

## Users

- id
- name
- email
- password

## Rooms

- id
- room_number
- floor
- base_rent
- occupancy_count
- bathroom
- status

## Tenants

- id
- name
- mobile
- aadhaar
- address
- joining_date

## Room_Tenants

- id
- room_id
- tenant_id

## Electricity_Readings

- id
- room_id
- previous_reading
- current_reading
- units_consumed
- bill_amount

## Payments

- id
- tenant_id
- payment_type
- amount
- payment_date
- status

---

# 8. Development Process

## Phase 1 - Planning

Duration: 1 Day

Tasks:

- Finalize Requirements
- Create BRD
- Create Database Design
- Prepare Wireframes

Status Deliverable:

✔ BRD Completed

---

## Phase 2 - Database Development

Duration: 1 Day

Tasks:

- Create Database
- Create Tables
- Create Relationships
- Test Queries

Deliverable:

✔ Database Ready

---

## Phase 3 - Backend Development

Duration: 4 Days

Tasks:

### Day 1

- Express Setup
- MySQL Connection
- Folder Structure

### Day 2

- Authentication APIs

### Day 3

- Room APIs
- Tenant APIs

### Day 4

- Payment APIs
- Electricity APIs

Deliverable:

✔ Complete REST APIs

---

## Phase 4 - Frontend Development

Duration: 5 Days

Tasks:

### Day 1

- React Setup
- Tailwind Setup

### Day 2

- Login Page
- Sidebar
- Navbar

### Day 3

- Room Management UI

### Day 4

- Tenant Management UI

### Day 5

- Payment & Electricity Modules

Deliverable:

✔ Frontend Ready

---

## Phase 5 - Dashboard & Reports

Duration: 2 Days

Tasks:

- Dashboard Cards
- Revenue Charts
- Occupancy Reports

Deliverable:

✔ Analytics Module

---

## Phase 6 - Testing

Duration: 2 Days

Tasks:

- Bug Fixing
- Validation Testing
- API Testing
- UI Testing

Deliverable:

✔ Stable Application

---

## Phase 7 - Documentation

Duration: 1 Day

Tasks:

- Project Report
- ER Diagram
- DFD
- Screenshots
- PPT

Deliverable:

✔ Final Submission Package

---

# 9. Project Timeline

| Phase | Duration |
|---------|---------|
| Planning | 1 Day |
| Database Design | 1 Day |
| Backend Development | 4 Days |
| Frontend Development | 5 Days |
| Dashboard & Reports | 2 Days |
| Testing | 2 Days |
| Documentation | 1 Day |

**Total Estimated Duration: 16 Days**

---

# 10. Future Enhancements

- WhatsApp Rent Reminders
- PDF Receipt Generation
- Excel Export
- Maintenance Tracking
- Complaint Management
- AI Revenue Analytics
- Multi-Building Support
- Mobile Application

---

# 11. Expected Outcome

Rental 360 will provide a complete digital solution for managing rental rooms, tenants, rent collection, electricity billing, and business reporting through a centralized web application.

The project demonstrates practical implementation of Full Stack Development concepts including frontend development, backend APIs, database management, authentication, reporting, and system design.