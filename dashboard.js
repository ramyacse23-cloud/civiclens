/* =========================================================
   CIVICLENS
   CITIZEN DASHBOARD
   ========================================================= */


/* =========================================================
   STORAGE KEY
   ========================================================= */

const DASHBOARD_STORAGE_KEY = "civicLensComplaints";


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("CivicLens Dashboard Loaded");

    loadDashboard();

});


/* =========================================================
   MAIN DASHBOARD FUNCTION
   ========================================================= */

function loadDashboard() {

    const complaints = getDashboardComplaints();

    console.log(
        "Dashboard complaints:",
        complaints
    );


    updateStatistics(complaints);

    renderCategoryChart(complaints);

    renderStatusChart(complaints);

    renderPriorityChart(complaints);

    renderSmartInsights(complaints);

    renderRecentComplaints(complaints);

}


/* =========================================================
   GET DATA FROM LOCAL STORAGE
   ========================================================= */

function getDashboardComplaints() {

    try {

        const stored =
            localStorage.getItem(
                DASHBOARD_STORAGE_KEY
            );


        if (!stored) {

            return [];

        }


        const data =
            JSON.parse(stored);


        if (!Array.isArray(data)) {

            return [];

        }


        return data;

    }
    catch (error) {

        console.error(
            "Dashboard storage error:",
            error
        );

        return [];

    }

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics(complaints) {

    const total =
        complaints.length;


    const reported =
        countByStatus(
            complaints,
            "Reported"
        );


    const verified =
        countByStatus(
            complaints,
            "Verified"
        );


    const progress =
        countByStatus(
            complaints,
            "In Progress"
        );


    const resolved =
        countByStatus(
            complaints,
            "Resolved"
        );


    const highPriority =
        complaints.filter(
            function (complaint) {

                return normalize(
                    complaint.priority
                ) === "high";

            }
        ).length;


    setText(
        "totalComplaints",
        total
    );


    setText(
        "reportedComplaints",
        reported
    );


    setText(
        "verifiedComplaints",
        verified
    );


    setText(
        "progressComplaints",
        progress
    );


    setText(
        "resolvedComplaints",
        resolved
    );


    setText(
        "highPriorityComplaints",
        highPriority
    );

}


/* =========================================================
   COUNT BY STATUS
   ========================================================= */

function countByStatus(
    complaints,
    status
) {

    return complaints.filter(
        function (complaint) {

            return normalize(
                complaint.status || "Reported"
            ) === normalize(status);

        }
    ).length;

}


/* =========================================================
   NORMALIZE TEXT
   ========================================================= */

function normalize(value) {

    return String(
        value || ""
    )
    .trim()
    .toLowerCase();

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent = value;

    }

}


/* =========================================================
   CATEGORY CHART
   ========================================================= */

function renderCategoryChart(complaints) {

    const container =
        document.getElementById(
            "categoryChart"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (complaints.length === 0) {

        container.innerHTML = createEmptyChart(
            "📊",
            "No category data yet",
            "Submit a civic complaint to see analytics."
        );

        return;

    }


    const categories = {};


    complaints.forEach(
        function (complaint) {

            const category =
                complaint.category ||
                "Other";


            categories[category] =
                (categories[category] || 0) + 1;

        }
    );


    const sorted =
        Object.entries(categories)
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            );


    const maxValue =
        sorted.length > 0
            ? sorted[0][1]
            : 1;


    sorted.forEach(
        function ([category, count]) {

            const percentage =
                (count / maxValue) * 100;


            const row =
                document.createElement("div");


            row.className =
                "category-bar-row";


            row.innerHTML = `

                <div class="category-bar-info">

                    <span>
                        ${escapeDashboardHTML(category)}
                    </span>

                    <strong>
                        ${count}
                    </strong>

                </div>

                <div class="category-bar-track">

                    <div
                        class="category-bar-fill"
                        style="width: ${percentage}%"
                    >
                    </div>

                </div>

            `;


            container.appendChild(row);

        }
    );

}


/* =========================================================
   STATUS DONUT CHART
   ========================================================= */

function renderStatusChart(complaints) {

    const donut =
        document.getElementById(
            "donutChart"
        );


    const legend =
        document.getElementById(
            "statusLegend"
        );


    const percentageElement =
        document.getElementById(
            "resolutionPercentage"
        );


    if (!donut || !legend) {

        return;

    }


    const total =
        complaints.length;


    const reported =
        countByStatus(
            complaints,
            "Reported"
        );


    const verified =
        countByStatus(
            complaints,
            "Verified"
        );


    const progress =
        countByStatus(
            complaints,
            "In Progress"
        );


    const resolved =
        countByStatus(
            complaints,
            "Resolved"
        );


    if (total === 0) {

        donut.style.setProperty(
            "--chart-angle",
            "0deg"
        );


        percentageElement.textContent =
            "0%";


        legend.innerHTML =
            createLegendItem(
                "No complaints",
                0,
                "blue"
            );


        return;

    }


    const resolvedPercentage =
        Math.round(
            (resolved / total) * 100
        );


    percentageElement.textContent =
        resolvedPercentage + "%";


    /*
       We use CSS conic-gradient.

       This creates a donut-style chart
       without needing Chart.js.
    */

    const resolvedAngle =
        (resolved / total) * 360;


    donut.style.background =
        `conic-gradient(
            #10b981 0deg ${resolvedAngle}deg,
            #f59e0b ${resolvedAngle}deg ${
                resolvedAngle +
                ((progress / total) * 360)
            }deg,
            #8b5cf6 ${
                resolvedAngle +
                ((progress / total) * 360)
            }deg ${
                resolvedAngle +
                ((progress / total) * 360) +
                ((verified / total) * 360)
            }deg,
            #3867ff ${
                resolvedAngle +
                ((progress / total) * 360) +
                ((verified / total) * 360)
            }deg 360deg
        )`;


    legend.innerHTML = `

        ${createLegendItem(
            "Reported",
            reported,
            "blue"
        )}

        ${createLegendItem(
            "Verified",
            verified,
            "purple"
        )}

        ${createLegendItem(
            "In Progress",
            progress,
            "yellow"
        )}

        ${createLegendItem(
            "Resolved",
            resolved,
            "green"
        )}

    `;

}


/* =========================================================
   LEGEND ITEM
   ========================================================= */

function createLegendItem(
    label,
    value,
    color
) {

    return `

        <div class="legend-item">

            <div>

                <span
                    class="legend-dot ${color}"
                >
                </span>

                <span>
                    ${label}
                </span>

            </div>

            <strong>
                ${value}
            </strong>

        </div>

    `;

}


/* =========================================================
   PRIORITY CHART
   ========================================================= */

function renderPriorityChart(complaints) {

    const container =
        document.getElementById(
            "priorityBars"
        );


    if (!container) {

        return;

    }


    const priorities = {
        High: 0,
        Medium: 0,
        Low: 0
    };


    complaints.forEach(
        function (complaint) {

            const priority =
                String(
                    complaint.priority ||
                    "Medium"
                )
                .trim()
                .toLowerCase();


            if (priority === "high") {

                priorities.High++;

            }
            else if (priority === "low") {

                priorities.Low++;

            }
            else {

                priorities.Medium++;

            }

        }
    );


    const total =
        complaints.length;


    if (total === 0) {

        container.innerHTML =
            createEmptyChart(
                "⚡",
                "No priority data",
                "Priority statistics will appear here."
            );

        return;

    }


    container.innerHTML = "";


    const priorityData = [
        {
            name: "High",
            value: priorities.High,
            className: "high"
        },

        {
            name: "Medium",
            value: priorities.Medium,
            className: "medium"
        },

        {
            name: "Low",
            value: priorities.Low,
            className: "low"
        }
    ];


    priorityData.forEach(
        function (item) {

            const percentage =
                Math.round(
                    (item.value / total) * 100
                );


            const row =
                document.createElement("div");


            row.className =
                "priority-row";


            row.innerHTML = `

                <div class="priority-row-header">

                    <span>
                        <span
                            class="
                                priority-mini-dot
                                ${item.className}
                            "
                        ></span>

                        ${item.name}
                    </span>

                    <strong>
                        ${item.value}
                    </strong>

                </div>


                <div class="priority-track">

                    <div
                        class="
                            priority-fill
                            ${item.className}
                        "
                        style="width: ${percentage}%"
                    >
                    </div>

                </div>

            `;


            container.appendChild(row);

        }
    );

}


/* =========================================================
   SMART INSIGHTS
   ========================================================= */

function renderSmartInsights(complaints) {

    const container =
        document.getElementById(
            "smartInsights"
        );


    if (!container) {

        return;

    }


    if (complaints.length === 0) {

        container.innerHTML = `

            <div class="insight-item">

                <span class="insight-icon">
                    💡
                </span>

                <div>

                    <strong>
                        Start reporting
                    </strong>

                    <p>
                        Your CivicLens insights will
                        appear after you report civic issues.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    const categoryCounts = {};


    complaints.forEach(
        function (complaint) {

            const category =
                complaint.category ||
                "Other";


            categoryCounts[category] =
                (categoryCounts[category] || 0) + 1;

        }
    );


    const topCategory =
        Object.entries(categoryCounts)
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            )[0];


    const highPriority =
        complaints.filter(
            function (complaint) {

                return normalize(
                    complaint.priority
                ) === "high";

            }
        ).length;


    const resolved =
        countByStatus(
            complaints,
            "Resolved"
        );


    const resolutionRate =
        Math.round(
            (resolved / complaints.length) * 100
        );


    container.innerHTML = `

        <div class="insight-item">

            <span class="insight-icon">
                🔎
            </span>

            <div>

                <strong>
                    Most reported category
                </strong>

                <p>
                    ${escapeDashboardHTML(
                        topCategory[0]
                    )}
                    has the highest number of
                    reports (${topCategory[1]}).
                </p>

            </div>

        </div>


        <div class="insight-item">

            <span class="insight-icon">
                🚨
            </span>

            <div>

                <strong>
                    Priority alert
                </strong>

                <p>
                    ${highPriority}
                    high-priority issue(s)
                    currently exist.
                </p>

            </div>

        </div>


        <div class="insight-item">

            <span class="insight-icon">
                ✅
            </span>

            <div>

                <strong>
                    Resolution progress
                </strong>

                <p>
                    ${resolutionRate}%
                    of reported issues have been
                    resolved.
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   RECENT COMPLAINTS
   ========================================================= */

function renderRecentComplaints(complaints) {

    const container =
        document.getElementById(
            "recentComplaints"
        );


    if (!container) {

        return;

    }


    if (complaints.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty-state">

                <div>
                    📋
                </div>

                <h3>
                    No complaints yet
                </h3>

                <p>
                    Your recently reported issues
                    will appear here.
                </p>

                <a
                    href="report.html"
                    class="btn btn-primary"
                >
                    Report Your First Issue
                </a>

            </div>

        `;

        return;

    }


    const recent =
        [...complaints]
            .sort(
                function (a, b) {

                    return getTimeValue(b)
                        - getTimeValue(a);

                }
            )
            .slice(0, 5);


    container.innerHTML = "";


    recent.forEach(
        function (complaint) {

            const item =
                document.createElement("div");


            item.className =
                "recent-complaint-item";


            const status =
                complaint.status ||
                "Reported";


            const priority =
                complaint.priority ||
                "Medium";


            const category =
                complaint.category ||
                "Other";


            const title =
                complaint.title ||
                "Civic Issue";


            const id =
                complaint.id ||
                "No ID";


            const date =
                formatDashboardDate(
                    complaint.createdAt ||
                    complaint.date ||
                    complaint.timestamp
                );


            item.innerHTML = `

                <div class="recent-complaint-main">

                    <div class="recent-complaint-icon">
                        ${getCategoryIcon(category)}
                    </div>

                    <div>

                        <h3>
                            ${escapeDashboardHTML(title)}
                        </h3>

                        <p>
                            ${escapeDashboardHTML(category)}
                            •
                            ${escapeDashboardHTML(id)}
                        </p>

                    </div>

                </div>


                <div class="recent-complaint-meta">

                    <span
                        class="
                            dashboard-status-badge
                            ${getDashboardStatusClass(status)}
                        "
                    >
                        ${escapeDashboardHTML(status)}
                    </span>

                    <span
                        class="
                            dashboard-priority-badge
                            ${getDashboardPriorityClass(priority)}
                        "
                    >
                        ${escapeDashboardHTML(priority)}
                    </span>

                    <span class="recent-date">
                        ${escapeDashboardHTML(date)}
                    </span>

                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    if (complaint.id) {

                        window.location.href =
                            "track.html?id=" +
                            encodeURIComponent(
                                complaint.id
                            );

                    }

                }
            );


            container.appendChild(item);

        }
    );

}


/* =========================================================
   GET CATEGORY ICON
   ========================================================= */

function getCategoryIcon(category) {

    const icons = {

        "Pothole": "🕳️",

        "Garbage": "🗑️",

        "Streetlight": "💡",

        "Water Leakage": "💧",

        "Drainage": "🌊",

        "Road Damage": "🛣️",

        "Traffic Issue": "🚦",

        "Other": "📢"

    };


    return icons[category] || "📢";

}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getDashboardStatusClass(status) {

    return "dashboard-status-" +
        normalize(status)
            .replace(/\s+/g, "-");

}


/* =========================================================
   PRIORITY CLASS
   ========================================================= */

function getDashboardPriorityClass(priority) {

    return "dashboard-priority-" +
        normalize(priority);

}


/* =========================================================
   TIME VALUE
   ========================================================= */

function getTimeValue(complaint) {

    const value =
        complaint.createdAt ||
        complaint.date ||
        complaint.timestamp;


    const time =
        new Date(value).getTime();


    return isNaN(time)
        ? 0
        : time;

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDashboardDate(value) {

    if (!value) {

        return "Date unavailable";

    }


    const date =
        new Date(value);


    if (isNaN(date.getTime())) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   EMPTY CHART
   ========================================================= */

function createEmptyChart(
    icon,
    title,
    message
) {

    return `

        <div class="dashboard-chart-empty">

            <div class="empty-chart-icon">
                ${icon}
            </div>

            <strong>
                ${title}
            </strong>

            <p>
                ${message}
            </p>

        </div>

    `;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeDashboardHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}