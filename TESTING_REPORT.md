## **AVENRIX CRM Capstone Project** 

**Week 9 — Software Testing Report** 

**Project:** Customer Relationship Management (CRM) System **Technology Stack:** React, Vite, Tailwind CSS, Node.js, Express.js, MongoDB Atlas **Testing Phase:** Integration and System Testing **Prepared by:** Safi Ahmad **Date:** 23 October 2026 

## **1. Introduction** 

The purpose of this report is to document the testing of the AVENRIX CRM application. The testing focuses on verifying the functionality of different modules, relationships between records, authentication and authorization, file operations, and overall application behavior. 

## **2. Testing Objectives** 

- Verify that all implemented modules work correctly. 

- Test relationships between clients, projects, tasks, and invoices. 

- Verify login and role-based access control. 

- Test creating, viewing, updating, and deleting records. 

- Check file uploads and downloads. 

- Identify and document bugs. 

- Check the application's layout on desktop and mobile devices. 

## **3. Testing Environment** 

- Frontend: React with Vite and Tailwind CSS 

- Backend: Node.js and Express.js 

- Database: MongoDB Atlas 

- API Testing: Postman 

- Browser: Google Chrome 

##  Operating System: Windows 11 

## **4. Test Cases and Results** 

The detailed test cases and their actual results are recorded in the test-case table. 

## **5. Bugs and Issues** 

Record any bugs discovered during testing, including the steps to reproduce them, their severity, and whether they have been fixed. 

## 6. Test Case Results

Execute each test and record the actual result.
Mark a test Pass or Fail only after verification.

| ID | Feature | Test Performed | Expected Result | Actual Result | 
|---|---|---|---|---|---|
| TC-01 | Login | Log in with valid credentials. | User reaches the dashboard. |  tested
| TC-02 | Authorization |Test Admin and Employee permissions separately.| Each role has correct access.|verified
| TC-03 | Clients | Create and edit a client. | Client is saved and updated correctly. | tested
| TC-04 | Projects | Create a project linked to a client. | Project and client information display correctly. | Previously tested successfully; reconfirm 
| TC-05 | Tasks | Create and update a task. | Task saves and status updates correctly. | tested
| TC-06 | Meetings | Create and delete a meeting. | Meeting operations succeed. | Delete previously tested successfully; reconfirm create
| TC-07 | Files | Upload and download a file. | File uploads and downloads correctly. | tested
| TC-08 | Invoices | Create an invoice and check totals. | Amounts are calculated correctly. | tested
| TC-09 | Invoice Status | Test Draft, Sent, Paid, and Overdue. | Status is displayed and updated correctly. | tested
| TC-10 | Reports | Open reports and verify displayed data. | Reports display appropriate data. | tested
| TC-11 | Search and Filters | Search for records and apply filters. | Matching records appear. | tested
| TC-12 | Responsive Layout | Test desktop and mobile views. | Content remains usable on both screen sizes. | Mobile layout fully complete. 

# 7. **Screenshot** 

The screeshots area given in a separate folder. 

# **8. Conclusion** 

The CRM application is undergoing integration and system testing. The final completion status will be determined after all planned test cases have been executed, identified issues have been addressed, and the results have been documented. 

