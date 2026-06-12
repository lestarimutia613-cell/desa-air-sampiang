---
Task ID: 1
Agent: main
Task: Update village website with admin credentials, feature pages, Supabase DB, and service applications

Work Log:
- Read and analyzed entire project structure including all page components, API routes, store, middleware, database schemas
- Updated admin seed: changed username from "admin" to "admindesa", password remains "admin123" (SHA-256 hashed)
- Updated both Prisma seed (prisma/seed.ts) and Supabase schema (supabase-schema.sql) with new admin credentials
- Added ServiceApplication model to Prisma schema with fields: serviceType, applicantName, applicantNik, formData (JSON string), status, userId, adminNotes
- Added service_applications table to Supabase schema with JSONB form_data field
- Created new API route: /api/service-applications with GET (list), POST (create), PUT (update status) methods
- Created admin page: /admin/service-applications for managing service applications (view details, approve/reject/process)
- Updated admin layout sidebar to include "Pengajuan Surat" menu item
- Updated LayananPage ServiceRegistrationForm to actually submit data to API instead of simulating
- Added useAppStore import to LayananPage for user context
- Pushed schema changes and re-seeded database
- Build verified successfully with all routes present
- Tested APIs: products, auth (admin-login with admindesa/admin123), service-applications CRUD all working

Stage Summary:
- Admin credentials: username=admindesa, password=admin123
- All feature pages (Kependudukan, Corporate University, Literasi, Console, Berita) already navigate via SPA routing in pageMap
- Service application forms submit real data to /api/service-applications endpoint
- Database uses Prisma (SQLite) with Supabase fallback when configured
- Admin panel at /admin with dedicated sidebar including service applications management
- Build successful, all 29 routes generated correctly
