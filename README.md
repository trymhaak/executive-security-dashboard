# Executive Security Dashboard

A visual reference implementation of a security metrics dashboard with clear mapping between Kusto queries and UI components.

## Live Demo Links

- **Dashboard**: [View Live Demo](https://trymhaak.github.io/executive-security-dashboard-pages/)
- **Query Mapping**: [View Query Mapping](https://trymhaak.github.io/executive-security-dashboard-pages/query_mapping.html)
- **Query Documentation**: [View Query Documentation](https://trymhaak.github.io/executive-security-dashboard-pages/query_documentation.md)

## Project Overview

This project provides a visual reference for implementing an Executive Security Dashboard that displays security metrics based on Kusto queries. It consists of:

1. **Dashboard Demo** (index.html) - A working prototype with dummy data
2. **Query Mapping** (query_mapping.html) - Visual reference showing which query powers each UI component
3. **Query Documentation** (query_documentation.md) - Detailed documentation of all Kusto queries

## How the Query Mapping Works

The `query_mapping.html` file provides a visual reference that shows:

1. **Numbered Query Badges**: Each UI component has a numbered badge (e.g., "Query #1") that corresponds to a specific Kusto query in the `query_documentation.md` file.

2. **Dashboard Layout**: The visualization shows the exact layout of the dashboard with all components in their proper positions.

3. **Chart Types**: Each chart placeholder indicates which Recharts component should be used for implementation.

## Using the Query Mapping for Implementation

When implementing the production version of the dashboard:

1. **Identify Components**: Navigate through the query mapping visualization to see all the components that need to be implemented.

2. **Find Corresponding Queries**: For each component, note the query number on its badge.

3. **Look Up Query Details**: Go to the `query_documentation.md` file and find the section for that query number.

4. **Implement the Component**: Use the specified Recharts component and the Kusto query to implement the UI component.

## Example Workflow

1. In the query mapping, you see a chart with "Query #5" badge labeled "Incidents by Severity"
2. In the query documentation, you find Query #5:
   ```kusto
   SecurityIncident
   | where TimeGenerated > ago(30d)
   | summarize count() by Severity
   | order by count_ desc
   ```
3. You implement this using the Recharts PieChart component as specified in the documentation

## Implementation Guide

For the production implementation:

1. Use React.js with Recharts for the frontend
2. Implement each UI component shown in the query mapping
3. Use the corresponding Kusto query from the documentation
4. Connect to Azure Log Analytics to execute the queries
5. Add time range filtering and error handling

## Sharing the Documentation

This project is hosted on GitHub Pages for easy sharing:

- Simply share the links from the "Live Demo Links" section at the top of this README
- No local setup or server required for viewers

For offline reference, you can export the pages as PDFs:
1. Open any of the GitHub Pages links in Chrome
2. Press Ctrl+P (or Cmd+P on Mac)
3. Change destination to "Save as PDF"
4. Click Save

## Project Structure

```
executive-security-dashboard/
├── index.html              # Dashboard demo with dummy data
├── query_mapping.html      # Visual mapping of queries to UI components
├── query_documentation.md  # Detailed Kusto query documentation
├── styles.css              # CSS styling
├── script.js               # JavaScript for the demo
└── README.md               # This file
```
