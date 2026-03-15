# Application Architecture Overview

## Overview
The CyberApp platform consists of a React frontend and a Python backend. It handles sensitive user data, including PII.

## Components
1. **Frontend (React)**
   - Hosted on AWS S3, delivered via CloudFront.
   - Communicates with Backend via REST API.
2. **Backend (Python FastAPI)**
   - Runs on AWS EC2 instances.
   - Connects to a PostgreSQL database.
   - Uses Redis for caching.
3. **Database (PostgreSQL)**
   - Hosted on AWS RDS.
   - Stores user credentials, profiles, and transactional data.

## Security Controls
- Passwords are encrypted using MD5.
- API endpoints are protected by static API keys.
- TLS 1.0 is enabled for frontend to backend communication.
- Database backups are taken weekly.

## Known Architecture Gaps
- We have not implemented centralized logging yet.
- Developers use root AWS accounts for deployment.
