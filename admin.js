/* =========================================================
   CIVICLENS ADMIN DASHBOARD
   Phase 7
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let complaints = [];

let selectedComplaintId = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const adminTotal =
    document.getElementById("adminTotal");

const adminReported =
    document.getElementById("adminReported");

const adminProgress =
    document.getElementById("adminProgress");

const adminResolved =
    document.getElementById("adminResolved");

const adminHighPriority =
    document.getElementById("adminHighPriority");

const adminSearch =
    document.getElementById("adminSearch");

const adminCategoryFilter =
    document.getElementById("adminCategoryFilter");

const adminStatusFilter =
    document.getElementById("adminStatusFilter");

const adminPriorityFilter =
    document.getElementById("adminPriorityFilter");

const adminComplaintTable =
    document.getElementById("adminComplaintTable");

const adminEmptyState =
    document.getElementById("adminEmptyState");

const refreshAdminBtn =
    document.getElementById("refreshAdminBtn");

const complaintModal =
    document.getElementById("complaintModal");

const modalCloseBtn =
    document.getElementById("modalCloseBtn");

const updateStatusBtn =
    document.getElementById("updateStatusBtn");

const modalStatusSelect =
    document.getElementById("modalStatusSelect");

const adminToast =
    document.getElementById("adminToast");

const adminToastMessage =
    document.getElementById("adminToastMessage");

const adminToastIcon =
    document.getElementById("adminToastIcon");


/* =========================================================
   LOAD COMPLAINTS
========================================================= */

function loadComplaints() {

    try {

        const storedComplaints =
            localStorage.getItem("civicLensComplaints");

        if (storedComplaints) {

            complaints =
                JSON.parse(storedComplaints);

        } else {

            complaints = [];

        }

    } catch (error) {

        console.error(
            "Error loading complaints:",
            error
        );

        complaints = [];

    }

}


/* =========================================================
   SAVE COMPLAINTS
========================================================= */

function saveComplaints() {

    try {

        localStorage.setItem(
            "civicLensComplaints",
            JSON.stringify(complaints)
        );

    } catch (error) {

        console.error(
            "Error saving complaints:",
            error
        );

        showToast(
            "Unable to save changes.",
            "error"
        );

    }

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        complaints.length;


    const reported =
        complaints.filter(
            complaint =>
                complaint.status === "Reported"
        ).length;


    const inProgress =
        complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length;


    const resolved =
        complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length;


    const highPriority =
        complaints.filter(
            complaint =>
                String(complaint.priority).toLowerCase()
                === "high"
        ).length;


    if (adminTotal) {

        adminTotal.textContent =
            total;

    }


    if (adminReported) {

        adminReported.textContent =
            reported;

    }


    if (adminProgress) {

        adminProgress.textContent =
            inProgress;

    }


    if (adminResolved) {

        adminResolved.textContent =
            resolved;

    }


    if (adminHighPriority) {

        adminHighPriority.textContent =
            highPriority;

    }

}


/* =========================================================
   GET FILTERED COMPLAINTS
========================================================= */

function getFilteredComplaints() {

    const searchText =
        adminSearch.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        adminCategoryFilter.value;


    const selectedStatus =
        adminStatusFilter.value;


    const selectedPriority =
        adminPriorityFilter.value;


    return complaints.filter(
        complaint => {

            const id =
                String(
                    complaint.id ||
                    complaint.complaintId ||
                    ""
                ).toLowerCase();


            const title =
                String(
                    complaint.title ||
                    ""
                ).toLowerCase();


            const location =
                String(
                    complaint.location ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                !searchText ||
                id.includes(searchText) ||
                title.includes(searchText) ||
                location.includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                complaint.category === selectedCategory;


            const matchesStatus =
                selectedStatus === "all" ||
                complaint.status === selectedStatus;


            const matchesPriority =
                selectedPriority === "all" ||
                complaint.priority === selectedPriority;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus &&
                matchesPriority
            );

        }
    );

}


/* =========================================================
   DISPLAY COMPLAINTS
========================================================= */

function displayComplaints() {

    if (!adminComplaintTable) {
        return;
    }


    const filteredComplaints =
        getFilteredComplaints();


    adminComplaintTable.innerHTML = "";


    if (filteredComplaints.length === 0) {

        adminEmptyState.style.display =
            "block";

        return;

    }


    adminEmptyState.style.display =
        "none";


    filteredComplaints.forEach(
        complaint => {

            const row =
                document.createElement("tr");


            const complaintId =
                complaint.id ||
                complaint.complaintId ||
                "N/A";


            const title =
                complaint.title ||
                "Untitled Issue";


            const category =
                complaint.category ||
                "Other";


            const priority =
                complaint.priority ||
                "Medium";


            const status =
                complaint.status ||
                "Reported";


            const date =
                formatDate(
                    complaint.date ||
                    complaint.createdAt
                );


            row.innerHTML = `

                <td>

                    <span class="complaint-id">
                        ${escapeHTML(complaintId)}
                    </span>

                </td>


                <td>

                    <div class="issue-table-title">

                        <strong>
                            ${escapeHTML(title)}
                        </strong>

                    </div>

                </td>


                <td>

                    <span class="category-badge">
                        ${escapeHTML(category)}
                    </span>

                </td>


                <td>

                    <span class="
                        priority-badge
                        ${getPriorityClass(priority)}
                    ">

                        ${escapeHTML(priority)}

                    </span>

                </td>


                <td>
                    ${escapeHTML(date)}
                </td>


                <td>

                    <span class="
                        status-badge
                        ${getStatusClass(status)}
                    ">

                        ${escapeHTML(status)}

                    </span>

                </td>


                <td>

                    <button
                        class="view-complaint-btn"
                        onclick="openComplaintModal('${escapeAttribute(complaintId)}')">

                        View

                    </button>

                </td>

            `;


            adminComplaintTable.appendChild(row);

        }
    );

}


/* =========================================================
   OPEN COMPLAINT MODAL
========================================================= */

function openComplaintModal(complaintId) {

    const complaint =
        complaints.find(
            item =>
                String(
                    item.id ||
                    item.complaintId
                ) === String(complaintId)
        );


    if (!complaint) {

        showToast(
            "Complaint not found.",
            "error"
        );

        return;

    }


    selectedComplaintId =
        complaintId;


    const modalTitle =
        document.getElementById("modalTitle");

    const modalComplaintId =
        document.getElementById("modalComplaintId");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalPriority =
        document.getElementById("modalPriority");

    const modalStatus =
        document.getElementById("modalStatus");

    const modalDate =
        document.getElementById("modalDate");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalImageContainer =
        document.getElementById(
            "modalImageContainer"
        );


    modalTitle.textContent =
        complaint.title ||
        "Civic Issue";


    modalComplaintId.textContent =
        complaintId;


    modalCategory.textContent =
        complaint.category ||
        "Other";


    modalPriority.textContent =
        complaint.priority ||
        "Medium";


    modalStatus.textContent =
        complaint.status ||
        "Reported";


    modalDate.textContent =
        formatDate(
            complaint.date ||
            complaint.createdAt
        );


    modalLocation.textContent =
        complaint.location ||
        getLocationText(complaint);


    modalDescription.textContent =
        complaint.description ||
        "No description provided.";


    modalStatusSelect.value =
        complaint.status ||
        "Reported";


    modalImageContainer.innerHTML =
        "";


    if (complaint.image) {

        const image =
            document.createElement("img");


        image.src =
            complaint.image;


        image.alt =
            "Complaint image";


        image.className =
            "complaint-modal-image";


        modalImageContainer.appendChild(
            image
        );

    }


    complaintModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeComplaintModal() {

    complaintModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

    selectedComplaintId =
        null;

}


/* =========================================================
   UPDATE STATUS
========================================================= */

function updateComplaintStatus() {

    if (!selectedComplaintId) {

        return;

    }


    const newStatus =
        modalStatusSelect.value;


    const complaintIndex =
        complaints.findIndex(
            item =>
                String(
                    item.id ||
                    item.complaintId
                ) === String(
                    selectedComplaintId
                )
        );


    if (complaintIndex === -1) {

        showToast(
            "Complaint not found.",
            "error"
        );

        return;

    }


    complaints[complaintIndex].status =
        newStatus;


    /*
       Add/update timeline information
    */

    if (
        !Array.isArray(
            complaints[complaintIndex].timeline
        )
    ) {

        complaints[complaintIndex].timeline =
            [];

    }


    complaints[complaintIndex].timeline.push({

        status:
            newStatus,

        date:
            new Date().toISOString(),

        message:
            `Complaint status updated to ${newStatus}.`

    });


    /*
       Update last modified time
    */

    complaints[complaintIndex].updatedAt =
        new Date().toISOString();


    saveComplaints();


    updateStatistics();


    displayComplaints();


    /*
       Update modal status text
    */

    const modalStatus =
        document.getElementById(
            "modalStatus"
        );


    modalStatus.textContent =
        newStatus;


    showToast(
        `Complaint status updated to ${newStatus}.`,
        "success"
    );

}


/* =========================================================
   PRIORITY CLASS
========================================================= */

function getPriorityClass(priority) {

    switch (
        String(priority).toLowerCase()
    ) {

        case "high":
            return "priority-high";

        case "medium":
            return "priority-medium";

        case "low":
            return "priority-low";

        default:
            return "priority-medium";

    }

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(status) {

    switch (
        String(status).toLowerCase()
    ) {

        case "reported":
            return "status-reported";

        case "verified":
            return "status-verified";

        case "in progress":
            return "status-progress";

        case "resolved":
            return "status-resolved";

        default:
            return "status-reported";

    }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {

        return "N/A";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return String(dateValue);

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
   LOCATION TEXT
========================================================= */

function getLocationText(complaint) {

    if (
        complaint.latitude &&
        complaint.longitude
    ) {

        return `
            ${complaint.latitude},
            ${complaint.longitude}
        `;

    }


    if (
        complaint.lat &&
        complaint.lng
    ) {

        return `
            ${complaint.lat},
            ${complaint.lng}
        `;

    }


    return "Location not available";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

function showToast(
    message,
    type = "success"
) {

    if (!adminToast) {

        return;

    }


    adminToastMessage.textContent =
        message;


    if (type === "error") {

        adminToastIcon.textContent =
            "✕";

        adminToast.classList.add(
            "error"
        );

    } else {

        adminToastIcon.textContent =
            "✓";

        adminToast.classList.remove(
            "error"
        );

    }


    adminToast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            adminToast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */


/*
   Search
*/

if (adminSearch) {

    adminSearch.addEventListener(
        "input",
        displayComplaints
    );

}


/*
   Category filter
*/

if (adminCategoryFilter) {

    adminCategoryFilter.addEventListener(
        "change",
        displayComplaints
    );

}


/*
   Status filter
*/

if (adminStatusFilter) {

    adminStatusFilter.addEventListener(
        "change",
        displayComplaints
    );

}


/*
   Priority filter
*/

if (adminPriorityFilter) {

    adminPriorityFilter.addEventListener(
        "change",
        displayComplaints
    );

}


/*
   Refresh
*/

if (refreshAdminBtn) {

    refreshAdminBtn.addEventListener(
        "click",
        () => {

            loadComplaints();

            updateStatistics();

            displayComplaints();

            showToast(
                "Dashboard refreshed.",
                "success"
            );

        }
    );

}


/*
   Close modal
*/

if (modalCloseBtn) {

    modalCloseBtn.addEventListener(
        "click",
        closeComplaintModal
    );

}


/*
   Update status
*/

if (updateStatusBtn) {

    updateStatusBtn.addEventListener(
        "click",
        updateComplaintStatus
    );

}


/*
   Click outside modal
*/

if (complaintModal) {

    complaintModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                complaintModal
            ) {

                closeComplaintModal();

            }

        }
    );

}


/*
   Escape key
*/

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            complaintModal.classList.contains("show")
        ) {

            closeComplaintModal();

        }

    }
);


/* =========================================================
   INITIALIZE ADMIN DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadComplaints();

        updateStatistics();

        displayComplaints();

    }
);