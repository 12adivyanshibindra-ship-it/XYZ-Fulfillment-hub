# XYZ Fulfillment Hub - Warehouse Flow

This repository contains the application prototype designed to streamline the operations and fulfillment processes for XYZ. The system acts as a highly visual, single-tap Kanban tracking workflow optimized for teams with low technical literacy.

## Core Operational Features
- **Smart Priority Sorting:** Urgent shipments float directly to the top of the fulfillment queue automatically.
- **Automated SLA Alerts:** Orders flash red visually if they exceed processing time thresholds.
- **Variant Validation:** Large item imagery with simple tap-to-match buttons to prevent wrong shipments.
- **Instant Error Logging:** Simple lane movement to isolate inventory mismatches without verbal fragmentation.

## Instructions to Run the Tool Locally

To run and preview this dashboard on your local machine, follow these steps:

1. **Clone or Download the Repository:**
   - Click the green **Code** button at the top of this GitHub page and select **Download ZIP**.
   - Extract the contents of the ZIP folder to your desktop.

2. **Open via Local Web Server (Recommended):**
   - Open your computer's terminal or command prompt.
   - Navigate to the project directory using:
     ```bash
     cd path/to/xyz-fulfillment-hub
     ```
   - Start a simple local server using Python:
     ```bash
     python -m http.server 8080
     ```
   - Open your web browser and go directly to: `http://localhost:8080`

3. **Alternative Direct Open:**
   - Alternatively, double-click the `index.html` file inside the folder to open it directly inside any standard web browser (Chrome, Edge, or Safari).
