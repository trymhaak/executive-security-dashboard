// Executive Security Dashboard - Simple JavaScript

// Wait for the DOM to be fully loaded before executing any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    setupTabNavigation();
    
    // Initialize charts with dummy data
    initializeCharts();
    
    // Add security recommendations
    addSecurityRecommendations();
    
    // Set up print functionality
    setupPrintButton();
    
    // Ensure all tabs are initialized with charts
    // This is important because Chart.js may not initialize charts in hidden tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        const tabId = button.getAttribute('data-tab');
        // Temporarily make the tab visible to initialize charts, then hide it again
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent && !tabContent.classList.contains('active')) {
            // Store original display state
            const originalDisplay = tabContent.style.display;
            // Make it visible but off-screen for chart initialization
            tabContent.style.display = 'block';
            tabContent.style.position = 'absolute';
            tabContent.style.left = '-9999px';
            
            // Force chart reflow
            setTimeout(() => {
                // Restore original state
                tabContent.style.display = originalDisplay;
                tabContent.style.position = '';
                tabContent.style.left = '';
            }, 100);
        }
    });
});

// Function to set up tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const targetTab = document.getElementById(`${tabId}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Function to initialize charts with dummy data
function initializeCharts() {
    // Dummy data for all charts
    const dummyData = {
        // Incidents by Severity (Query #5)
        severity: {
            labels: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
            data: [5, 7, 15, 12, 3],
            colors: {
                background: [
                    'rgba(220, 53, 69, 0.2)',   // Critical - Red
                    'rgba(255, 193, 7, 0.2)',   // High - Yellow
                    'rgba(23, 162, 184, 0.2)',  // Medium - Blue
                    'rgba(40, 167, 69, 0.2)',   // Low - Green
                    'rgba(108, 117, 125, 0.2)'  // Informational - Gray
                ],
                border: [
                    'rgba(220, 53, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(40, 167, 69, 1)',
                    'rgba(108, 117, 125, 1)'
                ]
            }
        },
        
        // Incident Status (Query #6)
        status: {
            labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
            data: [8, 12, 15, 7],
            colors: {
                background: [
                    'rgba(220, 53, 69, 0.2)',   // Open - Red
                    'rgba(255, 193, 7, 0.2)',   // In Progress - Yellow
                    'rgba(23, 162, 184, 0.2)',  // Resolved - Blue
                    'rgba(40, 167, 69, 0.2)'    // Closed - Green
                ],
                border: [
                    'rgba(220, 53, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(40, 167, 69, 1)'
                ]
            }
        },
        
        // Incident Classification (Query #7)
        classification: {
            labels: ['Malware: Ransomware', 'Phishing: Credential Theft', 'Unauthorized Access: Brute Force', 'Data Breach: Exfiltration', 'DoS: Application Layer'],
            data: [15, 12, 8, 5, 2],
            colors: {
                background: [
                    'rgba(0, 123, 255, 0.2)',
                    'rgba(111, 66, 193, 0.2)',
                    'rgba(23, 162, 184, 0.2)',
                    'rgba(40, 167, 69, 0.2)',
                    'rgba(255, 193, 7, 0.2)'
                ],
                border: [
                    'rgba(0, 123, 255, 1)',
                    'rgba(111, 66, 193, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)'
                ]
            }
        },
        
        // Weekly Security Alert Volume (Query #8)
        weeklyAlertVolume: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [
                {
                    label: 'Microsoft Defender for Endpoint',
                    data: [45, 52, 38, 41, 35, 29, 33, 39],
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)'
                },
                {
                    label: 'Azure Security Center',
                    data: [32, 28, 35, 27, 31, 29, 25, 30],
                    borderColor: 'rgba(111, 66, 193, 1)',
                    backgroundColor: 'rgba(111, 66, 193, 0.1)'
                },
                {
                    label: 'Office 365 ATP',
                    data: [18, 22, 25, 19, 17, 21, 24, 20],
                    borderColor: 'rgba(23, 162, 184, 1)',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)'
                }
            ]
        },
        
        // Incident Response Time Metrics (Query #9)
        responseTimeMetrics: {
            labels: ['Average Time', 'Median Time', 'Fastest Response', 'Slowest Response'],
            data: [2.5, 1.8, 0.3, 12.7]
        },
        
        // Incident Resolution Time Metrics (Query #10)
        resolutionTimeMetrics: {
            labels: ['Average Time', 'Median Time', 'Fastest Resolution', 'Slowest Resolution'],
            data: [12.4, 8.6, 1.2, 72.5]
        },
        
        // Alert Volume by Product (Query #11)
        alertVolumeByProduct: {
            labels: ['Microsoft Defender for Endpoint', 'Azure Security Center', 'Office 365 ATP', 'Azure AD Identity Protection', 'Azure Firewall'],
            data: [245, 187, 156, 98, 67],
            colors: {
                background: [
                    'rgba(0, 123, 255, 0.2)',
                    'rgba(111, 66, 193, 0.2)',
                    'rgba(23, 162, 184, 0.2)',
                    'rgba(40, 167, 69, 0.2)',
                    'rgba(255, 193, 7, 0.2)'
                ],
                border: [
                    'rgba(0, 123, 255, 1)',
                    'rgba(111, 66, 193, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)'
                ]
            }
        },
        
        // Alert Severity Distribution (Query #12)
        alertSeverityDistribution: {
            labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            datasets: [
                {
                    label: 'Critical',
                    data: [3, 5, 2, 7, 4, 6, 3],
                    borderColor: 'rgba(220, 53, 69, 1)',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)'
                },
                {
                    label: 'High',
                    data: [8, 12, 10, 12, 9, 11, 7],
                    borderColor: 'rgba(255, 193, 7, 1)',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)'
                },
                {
                    label: 'Medium',
                    data: [15, 10, 12, 15, 14, 13, 16],
                    borderColor: 'rgba(23, 162, 184, 1)',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)'
                },
                {
                    label: 'Low',
                    data: [20, 18, 15, 8, 12, 14, 17],
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)'
                }
            ]
        },
        
        // Alert Severity Trends (similar to Query #12 but over weeks)
        alertSeverityTrends: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Critical',
                    data: [18, 22, 15, 25],
                    borderColor: 'rgba(220, 53, 69, 1)',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)'
                },
                {
                    label: 'High',
                    data: [45, 52, 48, 55],
                    borderColor: 'rgba(255, 193, 7, 1)',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)'
                },
                {
                    label: 'Medium',
                    data: [78, 65, 72, 68],
                    borderColor: 'rgba(23, 162, 184, 1)',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)'
                },
                {
                    label: 'Low',
                    data: [95, 88, 82, 75],
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)'
                }
            ]
        },
        
        // MITRE ATT&CK Tactics Coverage (Query #13)
        tacticsCoverage: {
            labels: [
                'Initial Access', 'Execution', 'Persistence', 'Privilege Escalation',
                'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement',
                'Collection', 'Command & Control', 'Exfiltration', 'Impact'
            ],
            data: [85, 75, 60, 70, 65, 80, 75, 55, 60, 70, 50, 65]
        },
        
        // Top Attack Techniques (Query #14)
        topAttackTechniques: {
            labels: ['Microsoft Defender: Initial Access', 'Office 365 ATP: Phishing', 'Azure Security Center: Credential Access', 'Microsoft Defender: Lateral Movement', 'Azure AD IP: Defense Evasion'],
            data: [32, 28, 22, 18, 15]
        },
        
        // Top Targeted Systems (Query #15)
        topTargetedSystems: {
            labels: ['user1@company.com', 'user2@company.com', 'server1.company.com', 'admin@company.com', 'fileserver.company.com'],
            data: [24, 18, 15, 12, 10]
        },
        
        // Email Attack Analysis (Query #16)
        emailAttackAnalysis: {
            labels: ['Urgent: Password Reset', 'Invoice Payment Due', 'Account Verification', 'Document Shared', 'Security Alert', 'Package Delivery', 'HR Announcement', 'IT Support', 'Meeting Invitation', 'Payroll Update'],
            data: [28, 22, 18, 15, 12, 10, 8, 7, 6, 5]
        }
    };
    
    // Create Overview Tab Charts
    createSeverityChart(dummyData.severity);
    createStatusChart(dummyData.status);
    createClassificationChart(dummyData.classification);
    createWeeklyAlertVolumeChart(dummyData.weeklyAlertVolume);
    
    // Create Incident Details Tab Charts
    createResponseTimeMetricsChart(dummyData.responseTimeMetrics);
    createResolutionTimeMetricsChart(dummyData.resolutionTimeMetrics);
    createAlertVolumeByProductChart(dummyData.alertVolumeByProduct);
    createAlertSeverityDistributionChart(dummyData.alertSeverityDistribution);
    
    // Create Trends & Analysis Tab Charts
    createAlertSeverityTrendsChart(dummyData.alertSeverityTrends);
    createTacticsCoverageChart(dummyData.tacticsCoverage);
    createTopAttackTechniquesChart(dummyData.topAttackTechniques);
    createTopTargetedSystemsChart(dummyData.topTargetedSystems);
    createEmailAttackAnalysisChart(dummyData.emailAttackAnalysis);
}

// Function to create Severity Chart
function createSeverityChart(data) {
    const ctx = document.getElementById('severityChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Incidents',
                data: data.data,
                backgroundColor: data.colors.background,
                borderColor: data.colors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create Status Chart
function createStatusChart(data) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors.background,
                borderColor: data.colors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to create Classification Chart
function createClassificationChart(data) {
    const ctx = document.getElementById('classificationChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors.background,
                borderColor: data.colors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to create Response Time Chart
function createResponseTimeChart(data) {
    const ctx = document.getElementById('responseTimeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Average Response Time (hours)',
                data: data.data,
                backgroundColor: 'rgba(23, 162, 184, 0.2)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create Weekly Alert Volume Chart
function createWeeklyAlertVolumeChart(data) {
    const ctx = document.getElementById('weeklyAlertVolumeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Alerts'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week'
                    }
                }
            }
        }
    });
}

// Function to create Response Time Metrics Chart
function createResponseTimeMetricsChart(data) {
    const ctx = document.getElementById('responseTimeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Hours',
                data: data.data,
                backgroundColor: 'rgba(23, 162, 184, 0.2)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                }
            }
        }
    });
}

// Function to create Resolution Time Metrics Chart
function createResolutionTimeMetricsChart(data) {
    const ctx = document.getElementById('resolutionTimeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Hours',
                data: data.data,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                }
            }
        }
    });
}

// Function to create Alert Volume by Product Chart
function createAlertVolumeByProductChart(data) {
    const ctx = document.getElementById('alertVolumeByProductChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Alerts',
                data: data.data,
                backgroundColor: data.colors.background,
                borderColor: data.colors.border,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create Alert Severity Distribution Chart
function createAlertSeverityDistributionChart(data) {
    const ctx = document.getElementById('alertSeverityDistributionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Alerts'
                    }
                }
            }
        }
    });
}

// Function to create Alert Severity Trends Chart
function createAlertSeverityTrendsChart(data) {
    const ctx = document.getElementById('alertSeverityTrendsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Alerts'
                    }
                }
            }
        }
    });
}

// Function to create Tactics Coverage Chart
function createTacticsCoverageChart(data) {
    const ctx = document.getElementById('tacticsCoverageChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Coverage (%)',
                data: data.data,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                pointBackgroundColor: 'rgba(0, 123, 255, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Function to create Top Attack Techniques Chart
function createTopAttackTechniquesChart(data) {
    const ctx = document.getElementById('topAttackTechniquesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Count',
                data: data.data,
                backgroundColor: 'rgba(111, 66, 193, 0.2)',
                borderColor: 'rgba(111, 66, 193, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',  // This makes it a horizontal bar chart in Chart.js v3+
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create Top Targeted Systems Chart
function createTopTargetedSystemsChart(data) {
    const ctx = document.getElementById('topTargetedSystemsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Number of Alerts',
                data: data.data,
                backgroundColor: 'rgba(23, 162, 184, 0.2)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create Email Attack Analysis Chart
function createEmailAttackAnalysisChart(data) {
    const ctx = document.getElementById('emailAttackAnalysisChart');
    if (!ctx) return;
    
    // Limit the number of labels to improve readability
    const maxLabels = 5;
    const limitedLabels = data.labels.slice(0, maxLabels);
    const limitedData = data.data.slice(0, maxLabels);
    
    new Chart(ctx, {
        type: 'bar', // Standard bar chart with horizontal orientation
        data: {
            labels: limitedLabels,
            datasets: [{
                label: 'Number of Alerts',
                data: limitedData,
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to add security recommendations
function addSecurityRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    const recommendations = [
        {
            title: 'Implement Multi-Factor Authentication',
            description: 'Deploy MFA across all remote access points to reduce risk of unauthorized access.'
        },
        {
            title: 'Enhance Endpoint Protection',
            description: 'Upgrade endpoint security solutions to better detect and prevent malware infections.'
        },
        {
            title: 'Improve Security Awareness Training',
            description: 'Conduct regular phishing simulations and security training for all employees.'
        }
    ];
    
    recommendations.forEach(rec => {
        const recommendation = document.createElement('div');
        recommendation.className = 'recommendation';
        recommendation.innerHTML = `
            <div class="recommendation-header">
                <h3>${rec.title}</h3>
            </div>
            <div class="recommendation-content">
                <p>${rec.description}</p>
            </div>
        `;
        container.appendChild(recommendation);
    });
}

// Function to set up print button
function setupPrintButton() {
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
}
