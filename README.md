# Executive Security Dashboard

This project contains a simplified implementation of an Executive Security Dashboard for security metrics visualization, along with documentation for implementing the production version.

## Project Components

### Dashboard Implementation
- `index.html` - The main dashboard HTML structure
- `styles.css` - CSS styling for the dashboard
- `script.js` - JavaScript code for dashboard functionality

### Documentation
- `query_documentation.md` - Detailed documentation of all Kusto queries used in the dashboard
- `query_mapping.html` - Visual mapping of queries to UI components

## How to Use

### Running the Dashboard
1. Start a local server in the project directory:
   ```
   python3 -m http.server 7777
   ```
2. Open your browser and navigate to:
   - Dashboard: http://localhost:7777/
   - Query Mapping: http://localhost:7777/query_mapping.html

### Documentation
- The `query_documentation.md` file contains detailed explanations of all Kusto queries used in the dashboard, including:
  - Query syntax
  - Explanation of what each query does
  - Mapping to Recharts components for visualization

- The `query_mapping.html` file provides a visual reference showing which query powers each UI component.

## Presentation Options

### Option 1: Deploy to Netlify
You can deploy this dashboard to Netlify for easy sharing:
1. Create a free Netlify account
2. Drag and drop the entire folder to Netlify's upload area
3. Share the generated URL with your team

### Option 2: Export as PDF
You can export the query mapping as a PDF:
1. Open the query_mapping.html in Chrome
2. Press Ctrl+P (or Cmd+P on Mac)
3. Change destination to "Save as PDF"
4. Click Save

### Option 3: GitHub Repository
Upload the project to a GitHub repository:
1. Create a new repository
2. Push all files to the repository
3. Enable GitHub Pages in the repository settings
4. Share the GitHub Pages URL with your team

## Implementation Notes

The dashboard should be implemented using:
- Frontend Framework: React.js
- Chart Library: Recharts (https://recharts.org/en-US/examples)
- Data Source: Azure Log Analytics (Kusto queries)

## Next Steps

For the production implementation:
1. Set up a React.js project
2. Install Recharts as a dependency
3. Create a data service to execute Kusto queries
4. Implement the UI components using Recharts
5. Add time range filtering and error handling
