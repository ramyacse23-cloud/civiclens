/* =========================================================
   CIVICLENS - COMMUNITY REPORTS
   ========================================================= */


document.addEventListener("DOMContentLoaded", function () {


    const reportsContainer =
        document.getElementById("communityReports");

    const emptyState =
        document.getElementById("communityEmpty");

    const searchInput =
        document.getElementById("communitySearch");

    const categoryFilter =
        document.getElementById("communityCategory");

    const statusFilter =
        document.getElementById("communityStatus");


    const totalElement =
        document.getElementById("totalCommunityIssues");

    const activeElement =
        document.getElementById("activeCommunityIssues");

    const resolvedElement =
        document.getElementById("resolvedCommunityIssues");


    /* -----------------------------------------------------
       LOAD REPORTS
    ----------------------------------------------------- */

    function getReports() {

        const reports =
            JSON.parse(
                localStorage.getItem("civicLensComplaints")
            );

        if (!Array.isArray(reports)) {
            return [];
        }

        return reports;
    }


    /* -----------------------------------------------------
       DISPLAY REPORTS
    ----------------------------------------------------- */

    function displayReports() {

        const reports = getReports();

        const searchText =
            searchInput.value.toLowerCase().trim();

        const selectedCategory =
            categoryFilter.value;

        const selectedStatus =
            statusFilter.value;


        const filteredReports =
            reports.filter(function (report) {

                const title =
                    (report.issueTitle || "").toLowerCase();

                const description =
                    (report.issueDescription || "").toLowerCase();

                const category =
                    report.issueCategory || "";

                const status =
                    report.status || "Reported";


                const matchesSearch =
                    title.includes(searchText) ||
                    description.includes(searchText) ||
                    category.toLowerCase().includes(searchText);


                const matchesCategory =
                    selectedCategory === "all" ||
                    category === selectedCategory;


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesStatus
                );

            });


        reportsContainer.innerHTML = "";


        if (filteredReports.length === 0) {

            emptyState.style.display = "block";

            return;

        }


        emptyState.style.display = "none";


        filteredReports.forEach(function (report) {

            const card =
                document.createElement("article");

            card.className =
                "community-report-card";


            const status =
                report.status || "Reported";

            const priority =
                report.issuePriority || "Medium";

            const category =
                report.issueCategory || "Other";

            const title =
                report.issueTitle || "Civic Issue";

            const description =
                report.issueDescription ||
                "No description available.";

            const location =
                report.issueLocation ||
                "Location not provided";

            const complaintId =
                report.complaintId ||
                "N/A";


            card.innerHTML = `

                <div class="community-card-top">

                    <span class="community-category">
                        ${escapeHTML(category)}
                    </span>

                    <span class="community-status status-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}">
                        ${escapeHTML(status)}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(title)}
                </h3>


                <p class="community-description">
                    ${escapeHTML(description)}
                </p>


                <div class="community-location">
                    📍 ${escapeHTML(location)}
                </div>


                <div class="community-card-bottom">

                    <div>

                        <span class="community-label">
                            Complaint ID
                        </span>

                        <strong>
                            ${escapeHTML(complaintId)}
                        </strong>

                    </div>


                    <div>

                        <span class="community-label">
                            Priority
                        </span>

                        <strong class="priority-${priority.toLowerCase()}">
                            ${escapeHTML(priority)}
                        </strong>

                    </div>

                </div>

            `;


            reportsContainer.appendChild(card);

        });


    }


    /* -----------------------------------------------------
       UPDATE SUMMARY
    ----------------------------------------------------- */

    function updateSummary() {

        const reports = getReports();


        const total =
            reports.length;


        const active =
            reports.filter(function (report) {

                return (
                    report.status !== "Resolved"
                );

            }).length;


        const resolved =
            reports.filter(function (report) {

                return (
                    report.status === "Resolved"
                );

            }).length;


        totalElement.textContent = total;

        activeElement.textContent = active;

        resolvedElement.textContent = resolved;

    }


    /* -----------------------------------------------------
       HTML SAFETY
    ----------------------------------------------------- */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* -----------------------------------------------------
       FILTER EVENTS
    ----------------------------------------------------- */

    searchInput.addEventListener(
        "input",
        displayReports
    );


    categoryFilter.addEventListener(
        "change",
        displayReports
    );


    statusFilter.addEventListener(
        "change",
        displayReports
    );


    /* -----------------------------------------------------
       INITIAL LOAD
    ----------------------------------------------------- */

    updateSummary();

    displayReports();


});