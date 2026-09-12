# CampusPrint — Project Context & Changelog

## 1. Executive Summary
**CampusPrint** is a modern, full-stack digital print ordering and queue management system designed for university campuses. It eliminates physical queues at campus printing and stationery shops by enabling students to upload documents, configure print settings, make mock payments, and track the physical printing hardware simulation in real time. Staff manage print queues, update order states, and fulfill jobs through an administrative dashboard.

---

## 2. Design System: Golden Twilight Pixel UI

The application was redesigned with the **Golden Twilight** 5-color Neo-Brutalist & Pixel-Art design system:

### Palette Specification (Coolors "Golden Twilight")
| Color Token | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Twilight Deep** | `#000814` | High-contrast black replacement, crisp `2px` borders (`border-2 border-[#000814]`), hard drop shadows (`4px 4px 0px 0px #000814`), dark badges, heavy headings. |
| **Twilight Dark** | `#001D3D` | Dark navy structural containers: desktop sidebar background, table header rows, left column login hero background. |
| **Twilight Blue** | `#003566` | Tech blue accent cards (`READY FOR PICKUP`), interactive hover states for inactive sidebar nav items, status pill fills. |
| **Twilight Gold** | `#FFC300` | Primary interactive CTAs (`NEW PRINT ORDER`, `CHOOSE A FILE`, `LOG IN ->`), active role toggles, avatar badges. |
| **Twilight Bright** | `#FFD60A` | Bright arcade yellow for active navigation indicators, active stat highlight numbers, button hover states, sparkle accents. |
| **Canvas Cream** | `#FBF8F1` | Warm retro parchment background for dashboard canvas and modal surfaces. |
| **Card White** | `#FFFFFF` | Primary content containers, table bodies, input surfaces. |

### Typography
- **Pixel / 8-Bit Accents**: `'Press Start 2P'`, `'Silkscreen'`
- **Headings & Badges**: `'Space Grotesk'` (Weights 700, 800, 900)
- **Body & Controls**: `'Plus Jakarta Sans'` (Weights 500, 600, 700)

### Tactile Component Styling
- **Borders**: Uniform `2px solid #000814` (or `2px dashed #000814` for dropzones and receipt perimeters).
- **Pixel Shadows**: Hard-edge drop shadows (`3px 3px 0px 0px #000814`, `4px 4px 0px 0px #000814`, `5px 5px 0px 0px #000814`).
- **Corner Radii**: Pixel-friendly rounded rectangular corners (`rounded-xl`, `rounded-2xl`).

---

## 3. Pixel-Art SVG Graphics Suite (`frontend/src/components/PixelArt.jsx`)
Custom-crafted 128x128 pixel-grid vector graphics embedded natively in the application:
1. **`PixelPrinterGraphic`**: Multi-tiered office printer with yellow paper tray, LED status lights, control keypad, and printed sheet emerging from the slot.
2. **`PixelUploadDoc`**: Document sheet with folded corner, pixel text lines, and upload arrow with sparkle accents.
3. **`PixelTicketGraphic`**: Golden queue ticket with punch-hole notches, token number display, barcode pattern, and star accent.
4. **`PixelSpeedWatch`**: Mechanical stopwatch with wind crown, side pusher, second ticks, and speed motion trailing lines.
5. **`PixelLogo` & `PixelSparkles`**: Animated brand icon and four-point sparkle decorations.

---

## 4. Key Frontend Modules & Pages

### A. Desktop Sidebar & App Shell (`frontend/src/components/AppLayout.jsx`)
- **Left Desktop Sidebar**: Persistent 240px wide Dark Navy container (`#001D3D`) with `2px solid #000814` right border.
- **Brand Header**: Yellow pixel printer icon (`#FFD60A`) + uppercase `CAMPUSPRINT` with yellow accent dot.
- **Navigation Items**:
  - Inactive: Transparent with white text, hovering to Tech Blue (`#003566`) with Bright Yellow text (`#FFD60A`).
  - Active: Filled Bright Yellow (`#FFD60A`) with `#000814` text, `2px solid #000814` border, and `3px 3px 0px 0px #000814` shadow.
- **Bottom User Capsule**: Container in `#000814` with `#003566` border, `#FFC300` user avatar, and logout action.
- **Top Utility Strip**: Canvas Cream (`#FBF8F1`) with bottom border, breadcrumbs, notification bell, and user pill chip.
- **Retro Navy Footer**: Deepest Navy (`#000814`) with Golden Twilight typography and brand tagline.

### B. Student Dashboard (`frontend/src/pages/StudentDashboard.jsx`)
- **Hero Banner**: High-contrast heading `"HEY, DEMO. READY TO PRINT?"` paired with `PixelPrinterGraphic` and sparkles.
- **Primary CTA**: Tactile `+ NEW PRINT ORDER` button in `#FFC300` with hard drop shadow.
- **3 Top Metric Cards**:
  1. *Active Orders*: `#FFD60A` Bright Yellow.
  2. *Ready for Pickup*: `#003566` Tech Blue with `#FFD60A` metric count.
  3. *Total Orders*: `#FFFFFF` Card White.
- **Current Active Order Card**: Prominent ticket card with `PixelTicketGraphic`, Tech Blue `#003566` status pill, progress bar (`#FFC300` fill on `#FBF8F1` track), and `PixelSpeedWatch` ETA chip.
- **Recent Orders Table**: Header styled in Dark Navy `#001D3D` with uppercase white text, alternating rows with hover highlight, and `#FFC300` `VIEW ->` action buttons.

### C. New Print Order (`frontend/src/pages/NewOrder.jsx`)
- **Dropzone**: `2px dashed #000814` border with `PixelUploadDoc` illustration and file selection triggers.
- **Print Configuration**: Copies stepper, color mode (B&W / Color), duplex options (Single / Double), paper sizes (A4, Letter, A3), and binding (None, Staple, Spiral).
- **Live Price Calculator**: Dynamic price breakdown responding immediately to option changes.

### D. Order Receipt & Confirmation (`frontend/src/pages/OrderSuccess.jsx`)
- **Parchment Receipt Card**: Dashed border card with `PixelTicketGraphic`, token ID, order breakdown, and direct links to tracking.

### E. My Orders Table (`frontend/src/pages/MyOrders.jsx`)
- Filterable order list with search token input, status pill indicators, price summary, and `VIEW ->` buttons.
- Styled Dark Navy `#001D3D` header with `2px solid #000814` borders and responsive pagination controls.

### F. Order Tracking & 3D Hardware Simulation (`frontend/src/pages/OrderDetail.jsx` & `PrinterDemo.jsx`)
- **Interactive 3D Printer Simulation**: Three.js / Canvas-based 3D model rendering the print bed, print head, moving paper animation, and double-sided document texture mapping.
- **Hardware Status Timeline**: Visual progress steps (`Placed` -> `Accepted` -> `Processing` -> `Ready` -> `Completed`).
- **Student vs. Staff Controls**: Allows students to view live status and queue position, while staff can trigger state changes and inspect physical sheets.

### G. Staff Dashboard (`frontend/src/pages/StaffDashboard.jsx`)
- Queue management interface with live counters, order acceptance/rejection modals, ETA configuration, and manual status overrides.

### H. Authentication Flow (`frontend/src/pages/Login.jsx` & `Signup.jsx`)
- Split-screen layout:
  - Left: Dark Navy `#001D3D` to `#000814` gradient hero with `PixelPrinterGraphic` and value props.
  - Right: Neo-Brutalist form card with Student/Staff role toggle, remember me checkbox, and credential helpers.

---

## 5. Backend Architecture & API Surface

- **Runtime**: Node.js & Express (`backend/src/server.js`)
- **Port**: 4000 (proxied by Vite in local development via `localhost:5173/api`)
- **Authentication**: JWT tokens stored in `localStorage` (`cp_token`) with role verification middleware (`student`, `staff`).
- **Data Store**: Dual adapter architecture:
  - In-memory mock database with seeded records for instant local demoing.
  - AWS DynamoDB table adapter (`CampusPrint_Orders`, `CampusPrint_Users`).
- **Core Endpoints**:
  - `POST /api/auth/login`, `POST /api/auth/signup`, `GET /api/auth/me`
  - `GET /api/orders` (supports user/role filtering and search)
  - `GET /api/orders/:id` (includes dynamic queue position calculation)
  - `POST /api/orders` (creates print order with PDF metadata)
  - `PATCH /api/orders/:id/status` (handles state transitions and logs timeline events)
  - `POST /api/upload` (accepts PDF uploads via Multer, stored locally or uploaded to S3)

---

## 6. Docker & AWS Deployment Footprint

- **`frontend/Dockerfile`**: Multi-stage build producing static assets served via lightweight Nginx on port 80.
- **`backend/Dockerfile`**: Production Node.js Alpine container exposing port 4000.
- **AWS Infrastructure Scripts (`aws/`)**:
  - DynamoDB table provisioning script in `ap-south-1`.
  - Amazon ECR build and push automated script.
  - ECS Fargate Task Definitions for microservice orchestration.

---

## 7. Git Branches & Synchronization Status

- **Main Branch (`origin/main`)**: Contains all Golden Twilight pixel overhaul commits, 3D printer hardware simulations, and clean production builds.
- **Feature Branch (`origin/rithwik`)**: Fully synchronized with `main` at commit `19cb083` via fast-forward push.
- **Latest Commit**: `19cb083` — `feat(ui): complete Golden Twilight 5-color pixel UI design system overhaul`
