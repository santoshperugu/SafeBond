# SafeBond Matrimony - Unified Platform

SafeBond is a secure and modern matrimony platform designed to provide a trusted environment for finding life partners. The platform incorporates advanced safety features, including background checks, trust scores, and administrative verification, to ensure user authenticity and safety.

## 🚀 Project Overview

SafeBond streamlines the matrimony process through a secure, step-by-step workflow: from initial onboarding to verified communication between matches.

---

## 🛠 Tech Stack

- **Frontend**: React.js with Vite, TailwindCSS for premium styling.
- **Backend**: Node.js with Express.
- **Database**: MongoDB Atlas (Cloud-hosted).
- **Authentication**: JWT-based secure authentication.
- **File Storage**: Multer/Local uploads for documents and profile pictures.
- **Real-time**: Socket.io for live notifications and communication.

---

## 📖 Step-by-Step Project Flow

### 1. Home & Discovery
Users land on a beautifully designed **Home Page** that highlights the platform's core values: Trust, Safety, and Compatibility.

### 2. Authentication (Register/Login)
- **Registration**: Users can sign up as either a **Bride** or a **Groom**.
- **Login**: Secure access via email and password.
- **Persistent Session**: Uses JWT and local storage to keep the user logged in.

### 3. Onboarding & Profile Creation
After registration, users are guided through a multi-step **Onboarding** process:
- **Personal Details**: Age, height, occupation, religion, and more.
- **Family Information**: Background and values.
- **Documents & Photos**: Uploading profile pictures and verification documents.
- **Initial Status**: Profiles start as "Pending" until verified by an Administrator.

### 4. Background Check & Trust Score
SafeBond prioritizes safety:
- **Police Case Check**: Integrated logic to flag profiles with legal records.
- **Trust Score**: A dynamic score assigned based on the completeness and verification of the profile.
- **Verification Badges**: Verified profiles receive a "Verified Member" badge for higher trust.

### 5. Profile Discovery (Explorer)
- **Groom Explorer**: Brides can browse through verified Groom profiles.
- **Bride Explorer**: Grooms can browse through verified Bride profiles.
- **Advanced Filters**: Filter by age, location, income, and community.

### 6. Profile Details & Interaction
- Clicking a profile reveals detailed information including bio, career, and lifestyle.
- **Trust Indicators**: High-security profiles show detailed trust scores and police clearance status.

### 7. Admin Dashboard (Verification System)
The "Heart" of SafeBond's security:
- **Stats Overview**: Admins see total users, pending verifications, and platform activity.
- **Verification Queue**: Admins review uploaded documents and manually **Approve** or **Reject** profiles.
- **User Management**: Admins can manage the community and handle flags.

### 8. Secure Communication
Once a user is "Verified":
- **Internal Messaging**: Secure chat system between interested parties.
- **Meeting Scheduling**: Integrated tool for scheduling safe, introductory meetings.
- **Consent Management**: Users have full control over who sees their contact information.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js installed.
- Access to the MongoDB Atlas cluster (Connection string already configured in `.env`).

### Setup Instructions

1. **Install Dependencies**:
   ```bash
   # From the root directory
   npm run install-all
   ```

2. **Configure Environment Variables**:
   Ensure `.env` files exist in both `backend/` and `frontend/` directories with the appropriate keys. (The MongoDB URI is already set to Atlas).

3. **Start the Application**:
   ```bash
   # Run both frontend and backend concurrently
   npm start
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend will run on: `http://localhost:5000`

---

## 🔒 Security Features
- **Data Privacy**: Personal documents are only visible to administrators.
- **Anti-Scam Logic**: Trust scores decrease if suspicious patterns are detected.
- **Verified Only Access**: Certain features (like messaging) are restricted to verified members only.
