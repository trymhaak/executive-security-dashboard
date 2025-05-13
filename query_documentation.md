# Executive Security Dashboard Query Documentation

This document provides detailed explanations of the Kusto queries used in the Executive Security Dashboard and maps them to their corresponding frontend components. This will serve as a guide for implementing the production version with real data.

## Table of Contents

1. [Overview Tab Queries](#overview-tab-queries)
2. [Incident Details Tab Queries](#incident-details-tab-queries)
3. [Trends & Analysis Tab Queries](#trends--analysis-tab-queries)
4. [Trend Indicators for Summary Cards](#trend-indicators-for-summary-cards)
5. [Frontend Component Mapping](#frontend-component-mapping)
6. [Implementation Guide](#implementation-guide)

## Overview Tab Queries

### 1. Total Incidents Card

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| count
```

**Explanation:**
- Retrieves all security incidents from the last 30 days
- Takes the most recent record for each incident (using `arg_max`)
- Counts the total number of unique incidents

**Recharts Component:** Static text display (no chart component needed)

### 2. High Severity Incidents Card

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| where Severity == "High"
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| count
```

**Explanation:**
- Filters security incidents from the last 30 days
- Further filters to only include high severity incidents
- Takes the most recent record for each incident
- Counts the total number of unique high severity incidents

**Recharts Component:** Static text display (no chart component needed)

### 3. Average Response Time Card

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| where isnotempty(FirstModifiedTime)
| summarize arg_max(TimeGenerated, *) by IncidentNumber 
| extend TimeToTriage = (FirstModifiedTime - CreatedTime)/1h
| summarize AvgTimeToTriageHours=round(avg(TimeToTriage), 1)
```

**Explanation:**
- Retrieves incidents from the last 30 days that have been triaged (have a FirstModifiedTime)
- Calculates the time difference between creation and first modification (triage) in hours
- Computes the average triage time across all incidents, rounded to 1 decimal place

**Recharts Component:** Static text display (no chart component needed)

### 4. Average Resolution Time Card

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| where Status == "Closed" and isnotempty(ClosedTime)
| summarize arg_max(TimeGenerated, *) by IncidentNumber 
| extend TimeToClosure = (ClosedTime - CreatedTime)/1h
| summarize AvgTimeToCloseHours=round(avg(TimeToClosure), 1)
```

**Explanation:**
- Filters to closed incidents from the last 30 days
- Calculates the time difference between creation and closure in hours
- Computes the average resolution time across all closed incidents

**Recharts Component:** Static text display (no chart component needed)

### 5. Incidents by Severity Chart

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| summarize arg_max(TimeGenerated, Status, Severity, Owner, AdditionalData) by IncidentNumber
| summarize IncidentCount=dcount(IncidentNumber) by Severity
| extend SeverityOrder = case(Severity == 'Informational', 0, Severity == 'Low', 1, Severity == 'Medium', 2, Severity == 'High', 3, Severity == 'Critical', 4, 5)
| sort by SeverityOrder asc
| project Severity, IncidentCount
```

**Explanation:**
- Retrieves the most recent state of each incident
- Groups incidents by severity and counts them
- Adds a SeverityOrder field to ensure consistent sorting (Informational → Critical)
- Returns the severity and count for each severity level

**Recharts Component:** `<BarChart>` - [Simple Bar Chart](https://recharts.org/en-US/examples/SimpleBarChart)

### 6. Incident Status Chart

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| summarize arg_max(TimeGenerated, Status) by IncidentNumber
| summarize IncidentCount=count() by Status
```

**Explanation:**
- Gets the current status of each incident
- Groups incidents by status and counts them
- Returns the status and count for each status category

**Recharts Component:** `<PieChart>` with `<Pie>` - [Simple Pie Chart](https://recharts.org/en-US/examples/PieChartWithCustomizedLabel)

### 7. Incident Classification Chart

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| where Status == 'Closed'
| extend Classification = strcat(Classification, ": ", ClassificationReason)
| summarize IncidentCount=dcount(IncidentNumber) by Classification
| top 5 by IncidentCount desc
```

**Explanation:**
- Filters to closed incidents from the last 30 days
- Combines the Classification and ClassificationReason fields
- Groups by the combined classification and counts incidents
- Returns the top 5 classifications by incident count

**Recharts Component:** `<PieChart>` with `<Pie>` - [Pie Chart with Padding Angle](https://recharts.org/en-US/examples/PieChartWithPaddingAngle)

### 8. Weekly Security Alert Volume Chart

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(60d)
| summarize Count = count() by Week=bin(TimeGenerated, 7d), ProductName
| order by Week asc
```

**Explanation:**
- Retrieves security alerts from the last 60 days
- Groups alerts by week and product name, counting alerts in each group
- Orders results chronologically
- This provides a time series of alert volumes by detection source

**Recharts Component:** `<LineChart>` - [Multiple Line Chart](https://recharts.org/en-US/examples/BiaxialLineChart)

## Incident Details Tab Queries

### 9. Incident Response Time Metrics Chart

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| where isnotempty(FirstModifiedTime)
| summarize arg_max(TimeGenerated, *) by IncidentNumber 
| extend TimeToTriage = (FirstModifiedTime - CreatedTime)/1h
| summarize 
    AvgTimeToTriageHours=round(avg(TimeToTriage), 1),
    MedianTimeToTriageHours=round(percentile(TimeToTriage, 50), 1),
    FastestResponseHours=round(min(TimeToTriage), 1),
    SlowestResponseHours=round(max(TimeToTriage), 1)
| project 
    Metric = pack_array("Average Time", "Median Time", "Fastest Response", "Slowest Response"),
    Hours = pack_array(AvgTimeToTriageHours, MedianTimeToTriageHours, FastestResponseHours, SlowestResponseHours)
| mv-expand Metric, Hours to typeof(string)
```

**Explanation:**
- Calculates response time metrics for incidents with triage activity
- Computes average, median, minimum, and maximum response times
- Formats the results as pairs of metric names and values
- This structure makes it easy to display in a chart

**Recharts Component:** `<BarChart>` - [Simple Bar Chart](https://recharts.org/en-US/examples/SimpleBarChart)

### 10. Incident Resolution Time Metrics Chart

**Query:**
```kusto
SecurityIncident
| where TimeGenerated > ago(30d)
| where Status == "Closed" and isnotempty(ClosedTime)
| summarize arg_max(TimeGenerated, *) by IncidentNumber 
| extend TimeToClosure = (ClosedTime - CreatedTime)/1h
| summarize 
    AvgTimeToCloseHours=round(avg(TimeToClosure), 1),
    MedianTimeToCloseHours=round(percentile(TimeToClosure, 50), 1),
    FastestResolutionHours=round(min(TimeToClosure), 1),
    SlowestResolutionHours=round(max(TimeToClosure), 1)
| project 
    Metric = pack_array("Average Time", "Median Time", "Fastest Resolution", "Slowest Resolution"),
    Hours = pack_array(AvgTimeToCloseHours, MedianTimeToCloseHours, FastestResolutionHours, SlowestResolutionHours)
| mv-expand Metric, Hours to typeof(string)
```

**Explanation:**
- Similar to the response time query but for resolution times
- Calculates resolution time metrics for closed incidents
- Computes average, median, minimum, and maximum resolution times
- Formats the results for easy charting

**Recharts Component:** `<BarChart>` - [Simple Bar Chart](https://recharts.org/en-US/examples/SimpleBarChart)

### 11. Alert Volume by Product Chart

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(30d)
| summarize AlertCount = count() by Product = ProductName
| top 5 by AlertCount desc
```

**Explanation:**
- Counts alerts from the last 30 days, grouped by product
- Returns the top 5 products by alert count
- Shows which security products are generating the most alerts

**Recharts Component:** `<BarChart>` with horizontal layout - [Horizontal Bar Chart](https://recharts.org/en-US/examples/BarChartHasBackground)

### 12. Alert Severity Distribution Chart

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(30d)
| summarize Count = count() by AlertSeverity, Day=bin(TimeGenerated, 1d)
```

**Explanation:**
- Groups alerts by severity and day
- Counts alerts in each group
- Provides a time series of alert volumes by severity
- Useful for showing severity trends over time

**Recharts Component:** `<LineChart>` - [Line Chart with Multiple Series](https://recharts.org/en-US/examples/CustomizedLabelLineChart)

## Trends & Analysis Tab Queries

### 13. MITRE ATT&CK Coverage Chart

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(30d)
| extend TacticList = split(Tactics, ",")
| mv-expand TacticList
| extend Tactic = tostring(TacticList)
| where isnotempty(Tactic)
| summarize Count = count() by Tactic
| sort by Count desc
```

**Explanation:**
- Extracts MITRE ATT&CK tactics from alerts
- Splits the comma-separated tactics list into individual tactics
- Counts alerts for each tactic
- Shows which MITRE tactics are most commonly detected

**Recharts Component:** `<RadarChart>` - [Simple Radar Chart](https://recharts.org/en-US/examples/SimpleRadarChart)

### 14. Top Attack Techniques Chart

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(30d)
| where isnotempty(Tactics)
| extend TacticsList = split(Tactics, ",")
| mv-expand Tactic = TacticsList
| extend Tactic = tostring(Tactic)
| extend Tactic = replace("^\\s+|\\s+$", "", Tactic) // Remove leading/trailing whitespace
| where isnotempty(Tactic)
| summarize Count = count() by ProductName, Tactic
| top 5 by Count desc
```

**Explanation:**
- Similar to the previous query but includes the product name
- Identifies which products are detecting which tactics
- Returns the top 5 product-tactic combinations
- Helps identify the most common attack techniques and their detection sources

**Recharts Component:** `<BarChart>` with horizontal layout - [Horizontal Bar Chart](https://recharts.org/en-US/examples/BarChartHasBackground)

### 15. Top Targeted Systems Chart

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(30d)
| extend EntitiesObj = todynamic(Entities)
| mv-expand Entity = EntitiesObj
| extend Recipient = tostring(Entity.Recipient)
| where isnotempty(Recipient)
| summarize Count = count() by Recipient, AlertName
| top 5 by Count desc
```

**Explanation:**
- Extracts recipient entities from alerts
- Groups by recipient and alert name
- Counts alerts for each combination
- Shows which systems or users are most frequently targeted and by what types of alerts

**Recharts Component:** `<BarChart>` with horizontal layout - [Horizontal Bar Chart](https://recharts.org/en-US/examples/BarChartHasBackground)

### 16. Email-based Attack Analysis

**Query:**
```kusto
SecurityAlert
| where TimeGenerated > ago(30d)
| where ProductName == "Office 365 Advanced Threat Protection" or AlertType has "email" or AlertType has "phish" or AlertType has "spam"
| extend EntitiesObj = todynamic(Entities)
| mv-expand Entity = EntitiesObj
| extend Subject = tostring(Entity.Subject)
| where isnotempty(Subject)
| summarize Count = count() by Subject
| top 10 by Count desc
```

**Explanation:**
- Filters to email-related alerts
- Extracts email subjects from the entities
- Counts alerts by subject
- Shows the most common email subjects in attacks
- Useful for identifying phishing campaigns

**Recharts Component:** `<BarChart>` with horizontal layout - [Horizontal Bar Chart](https://recharts.org/en-US/examples/BarChartHasBackground)

## Trend Indicators for Summary Cards

### 17. Incident Trend Comparison

**Query:**
```kusto
let currentPeriod = toscalar(SecurityIncident
| where TimeGenerated > ago(30d)
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| count);
let previousPeriod = toscalar(SecurityIncident
| where TimeGenerated > ago(60d) and TimeGenerated <= ago(30d)
| where TimeGenerated > ago(90d) // Ensure we stay within retention period
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| count);
print 
    CurrentCount = currentPeriod,
    PreviousCount = previousPeriod,
    PercentChange = iif(previousPeriod > 0, tolong(round(100.0 * (currentPeriod - previousPeriod) / previousPeriod, 0)), 0)
```

**Explanation:**
- Calculates the total incident count for the current period (last 30 days)
- Calculates the total incident count for the previous period (30-60 days ago)
- Computes the percentage change between the two periods
- Used for trend indicators in the Total Incidents summary card

**Recharts Component:** Static text display (no chart component needed)

### 18. High Severity Incident Trend

**Query:**
```kusto
let currentPeriod = toscalar(SecurityIncident
| where TimeGenerated > ago(30d)
| where Severity == "High"
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| count);
let previousPeriod = toscalar(SecurityIncident
| where TimeGenerated > ago(60d) and TimeGenerated <= ago(30d)
| where TimeGenerated > ago(90d) // Ensure we stay within retention period
| where Severity == "High"
| summarize arg_max(TimeGenerated, *) by IncidentNumber
| count);
print 
    CurrentCount = currentPeriod,
    PreviousCount = previousPeriod,
    Change = currentPeriod - previousPeriod
```

**Explanation:**
- Similar to the previous query but specifically for high severity incidents
- Calculates the absolute change in high severity incidents between periods
- Used for trend indicators in the High Severity Incidents summary card

**Recharts Component:** Static text display (no chart component needed)

