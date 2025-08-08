# College Chronicle

*College Chronicle* is a full-stack web application designed to centralize and streamline the communication of academic events, circulars, deadlines, and announcements for students, faculty, and administrators. It serves as a unified platform that simplifies information flow within educational institutions.

## Features

### Role-Based Posting  
Admins, faculty, and coordinators can create and manage posts according to their assigned roles, ensuring structured access and control.

### Search and Filter  
Users can easily locate relevant posts using filters based on title, department, or user role.

### Google Calendar Integration  
Events can be added directly to a user's Google Calendar via OAuth 2.0. Refresh tokens are securely stored in the database for continued access.

### Authentication and Authorization  
Implements a secure email/password-based login system with access restrictions according to user roles.

## Tech Stack

| Layer              | Technologies Used                            |
|--------------------|-----------------------------------------------|
| Frontend           | React.js            |
| Backend            | Node.js, Express.js                           |
| Database           | MongoDB with Mongoose ODM                     |
| Authentication     | Custom email/password logic                   |
| API Integration    | Google Calendar API with OAuth 2.0            |
| Version Control    | Git and GitHub                                |
| Development Tools  | Visual Studio Code, Postman                   |
