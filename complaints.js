/* =========================================================
   CIVICLENS - PUBLIC COMPLAINTS
   Shows complaints stored in localStorage
   ========================================================= */


document.addEventListener("DOMContentLoaded", function () {

    const complaintsGrid =
        document.getElementById("complaintsGrid");

    const complaintsEmpty =
        document.getElementById("complaintsEmpty");

    const searchInput =
        document.getElementById("searchComplaints");

    const statusFilter =
        document.getElementById("statusFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");


    /* =====================================================
       GET COMPLAINTS FROM LOCAL STORAGE
       ===================================================== */

    function getComplaints() {

        const storedComplaints =
            localStorage.getItem("civicLensComplaints");

        if (!storedComplaints) {
            return [];
        }

        try {

            const complaints =
                JSON.parse(storedComplaints);

            return Array.isArray(complaints)
                ? complaints
                : [];

        } catch (error) {

            console.error(
                "Unable to read complaints:",
                error
            );

            return [];

        }

    }



    /* =====================================================
       ESCAPE HTML
       Prevents unwanted HTML from appearing in cards
       ===================================================== */

    function escapeHTML(value) {

        if (value === undefined || value === null) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }



    /* =====================================================
       STATUS CLASS
       ===================================================== */

    function getStatusClass(status) {

        const cleanStatus =
            String(status || "")
                .toLowerCase();

        if (cleanStatus === "resolved") {
            return "status-resolved";
        }

        if (
            cleanStatus === "in progress" ||
            cleanStatus === "inprogress"
        ) {
            return "status-progress";
        }

        if (cleanStatus === "verified") {
            return "status-verified";
        }

        return "status-reported";

    }



    /* =====================================================
       DISPLAY COMPLAINTS
       ===================================================== */

    function displayComplaints() {

        const complaints =
            getComplaints();

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        const selectedStatus =
            statusFilter.value;

        const selectedCategory =
            categoryFilter.value;


        const filteredComplaints =
            complaints.filter(function (complaint) {

                const title =
                    String(
                        complaint.issueTitle ||
                        complaint.title ||
                        ""
                    ).toLowerCase();

                const description =
                    String(
                        complaint.issueDescription ||
                        complaint.description ||
                        ""
                    ).toLowerCase();

                const category =
                    String(
                        complaint.issueCategory ||
                        complaint.category ||
                        ""
                    );

                const location =
                    String(
                        complaint.issueLocation ||
                        complaint.location ||
                        ""
                    ).toLowerCase();

                const status =
                    String(
                        complaint.status ||
                        "Reported"
                    );


                const matchesSearch =
                    !searchText ||
                    title.includes(searchText) ||
                    description.includes(searchText) ||
                    category.toLowerCase()
                        .includes(searchText) ||
                    location.includes(searchText);


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                const matchesCategory =
                    selectedCategory === "all" ||
                    category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCategory
                );

            });


        complaintsGrid.innerHTML = "";


        /* No complaints */

        if (filteredComplaints.length === 0) {

            complaintsEmpty.style.display =
                "block";

            return;

        }


        complaintsEmpty.style.display =
            "none";



        /* =================================================
           CREATE CARDS
           ================================================= */

        filteredComplaints.forEach(function (complaint) {

            const complaintId =
                complaint.complaintId ||
                complaint.id ||
                "CL-000000";


            const title =
                complaint.issueTitle ||
                complaint.title ||
                "Civic Issue";


            const description =
                complaint.issueDescription ||
                complaint.description ||
                "No description provided.";


            const category =
                complaint.issueCategory ||
                complaint.category ||
                "Other";


            const priority =
                complaint.issuePriority ||
                complaint.priority ||
                "Medium";


            const status =
                complaint.status ||
                "Reported";


            const location =
                complaint.issueLocation ||
                complaint.location ||
                "Location not provided";


            const latitude =
                complaint.latitude ||
                "Not available";


            const longitude =
                complaint.longitude ||
                "Not available";


            const date =
                complaint.createdAt ||
                complaint.date ||
                "Recently";


            const card =
                document.createElement("article");

            card.className =
                "public-complaint-card";


            card.innerHTML = `

                <div class="complaint-card-top">

                    <div>

                        <div class="complaint-id">
                            ${escapeHTML(complaintId)}
                        </div>

                        <h3>
                            ${escapeHTML(title)}
                        </h3>

                    </div>

                    <span class="complaint-status ${getStatusClass(status)}">
                        ${escapeHTML(status)}
                    </span>

                </div>


                <p class="complaint-description">
                    ${escapeHTML(description)}
                </p>


                <div class="complaint-details">

                    <div class="detail-box">

                        <span>
                            Category
                        </span>

                        <strong>
                            ${escapeHTML(category)}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            Priority
                        </span>

                        <strong>
                            ${escapeHTML(priority)}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            Latitude
                        </span>

                        <strong>
                            ${escapeHTML(latitude)}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            Longitude
                        </span>

                        <strong>
                            ${escapeHTML(longitude)}
                        </strong>

                    </div>

                </div>


                <div class="complaint-location">

                    📍

                    <strong>
                        Location:
                    </strong>

                    ${escapeHTML(location)}

                </div>


                <div class="complaint-date">

                    Reported:
                    ${escapeHTML(date)}

                </div>

            `;


            complaintsGrid.appendChild(card);

        });

    }



    /* =====================================================
       SEARCH
       ===================================================== */

    searchInput.addEventListener(
        "input",
        displayComplaints
    );


    /* =====================================================
       STATUS FILTER
       ===================================================== */

    statusFilter.addEventListener(
        "change",
        displayComplaints
    );


    /* =====================================================
       CATEGORY FILTER
       ===================================================== */

    categoryFilter.addEventListener(
        "change",
        displayComplaints
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    displayComplaints();



    /* =====================================================
       AUTO REFRESH

       If another page submits a complaint,
       this page can display it when refreshed.
       ===================================================== */

    window.addEventListener(
        "storage",
        function () {

            displayComplaints();

        }
    );

});