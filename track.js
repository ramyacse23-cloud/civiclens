/* =========================================================
   CIVICLENS
   COMPLAINT TRACKING
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

const TRACKING_STORAGE_KEY = "civicLensComplaints";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const trackingForm = document.getElementById("trackingForm");

const complaintIdInput =
    document.getElementById("complaintIdInput");

const trackingResult =
    document.getElementById("trackingResult");

const trackingEmpty =
    document.getElementById("trackingEmpty");


/* =========================================================
   INITIALIZE TRACKING PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("CivicLens Tracking Page Loaded");

    if (trackingForm) {

        trackingForm.addEventListener(
            "submit",
            handleTracking
        );

    }

    /*
       If the URL contains a complaint ID such as:

       track.html?id=CIV-20260813-1234

       automatically track that complaint.
    */

    const urlParams =
        new URLSearchParams(window.location.search);

    const complaintId =
        urlParams.get("id");

    if (complaintId) {

        complaintIdInput.value = complaintId;

        findComplaint(complaintId);

    }

});


/* =========================================================
   HANDLE TRACKING FORM
   ========================================================= */

function handleTracking(event) {

    event.preventDefault();

    const complaintId =
        complaintIdInput.value.trim();

    if (!complaintId) {

        showTrackingToast(
            "Please enter a complaint ID.",
            "error"
        );

        return;

    }

    findComplaint(complaintId);

}


/* =========================================================
   FIND COMPLAINT
   ========================================================= */

function findComplaint(complaintId) {

    const complaints =
        getComplaints();

    console.log(
        "Searching complaint:",
        complaintId
    );

    console.log(
        "Available complaints:",
        complaints
    );


    /*
       Case-insensitive comparison
       makes the tracking system easier
       for users.
    */

    const normalizedId =
        complaintId.toLowerCase();


    const complaint =
        complaints.find(function (item) {

            return String(item.id)
                .toLowerCase() === normalizedId;

        });


    if (!complaint) {

        showComplaintNotFound();

        return;

    }


    showComplaintDetails(complaint);

}


/* =========================================================
   GET COMPLAINTS FROM LOCAL STORAGE
   ========================================================= */

function getComplaints() {

    try {

        const storedData =
            localStorage.getItem(
                TRACKING_STORAGE_KEY
            );


        if (!storedData) {

            return [];

        }


        const complaints =
            JSON.parse(storedData);


        if (!Array.isArray(complaints)) {

            return [];

        }


        return complaints;

    }
    catch (error) {

        console.error(
            "Unable to read complaints:",
            error
        );

        return [];

    }

}


/* =========================================================
   SHOW COMPLAINT NOT FOUND
   ========================================================= */

function showComplaintNotFound() {

    trackingEmpty.classList.add("hidden");

    trackingResult.classList.remove("hidden");


    trackingResult.innerHTML = `

        <div class="not-found-card">

            <div class="not-found-icon">
                🔍
            </div>

            <h2>
                Complaint Not Found
            </h2>

            <p>
                We couldn't find a complaint with the ID:
            </p>

            <strong>
                ${escapeHTML(complaintIdInput.value.trim())}
            </strong>

            <div class="not-found-help">

                <p>
                    Please check that you entered the
                    complaint ID correctly.
                </p>

                <p>
                    Example:
                    <strong>CIV-20260813-1234</strong>
                </p>

            </div>

        </div>

    `;


    showTrackingToast(
        "Complaint not found.",
        "error"
    );

}


/* =========================================================
   SHOW COMPLAINT DETAILS
   ========================================================= */

function showComplaintDetails(complaint) {

    trackingEmpty.classList.add("hidden");

    trackingResult.classList.remove("hidden");


    const status =
        complaint.status || "Reported";


    const category =
        complaint.category || "Other";


    const priority =
        complaint.priority || "Medium";


    const title =
        complaint.title || "Civic Issue";


    const description =
        complaint.description ||
        "No description available.";


    const date =
        formatDate(
            complaint.createdAt ||
            complaint.date ||
            complaint.timestamp
        );


    const location =
        getLocationText(complaint);


    const image =
        complaint.image ||
        complaint.imageData ||
        "";


    const timeline =
        generateTimeline(status);


    trackingResult.innerHTML = `

        <div class="complaint-detail-card">


            <!-- ================= HEADER ================= -->

            <div class="complaint-detail-header">

                <div>

                    <span class="section-badge">
                        Complaint Details
                    </span>

                    <h2>
                        ${escapeHTML(title)}
                    </h2>

                </div>


                <div class="complaint-id-box">

                    <span>
                        Complaint ID
                    </span>

                    <strong id="displayComplaintId">
                        ${escapeHTML(complaint.id)}
                    </strong>

                    <button
                        type="button"
                        class="copy-id-btn"
                        onclick="copyComplaintId('${escapeAttribute(complaint.id)}')"
                    >
                        📋 Copy
                    </button>

                </div>

            </div>


            <!-- ================= STATUS ================= -->

            <div class="current-status-section">

                <div>

                    <span class="detail-label">
                        Current Status
                    </span>

                    <div class="status-display">

                        <span class="
                            status-dot
                            ${getStatusClass(status)}
                        ">
                        </span>

                        <strong>
                            ${escapeHTML(status)}
                        </strong>

                    </div>

                </div>


                <div>

                    <span class="detail-label">
                        Priority
                    </span>

                    <span class="
                        priority-badge
                        ${getPriorityClass(priority)}
                    ">
                        ${escapeHTML(priority)}
                    </span>

                </div>

            </div>


            <!-- ================= TIMELINE ================= -->

            <div class="complaint-timeline-section">

                <h3>
                    Complaint Progress
                </h3>

                <div class="complaint-timeline">

                    ${timeline}

                </div>

            </div>


            <!-- ================= INFORMATION ================= -->

            <div class="complaint-information">

                <div class="detail-item">

                    <span class="detail-icon">
                        🏷️
                    </span>

                    <div>

                        <span class="detail-label">
                            Category
                        </span>

                        <strong>
                            ${escapeHTML(category)}
                        </strong>

                    </div>

                </div>


                <div class="detail-item">

                    <span class="detail-icon">
                        📅
                    </span>

                    <div>

                        <span class="detail-label">
                            Submitted
                        </span>

                        <strong>
                            ${escapeHTML(date)}
                        </strong>

                    </div>

                </div>


                <div class="detail-item">

                    <span class="detail-icon">
                        📍
                    </span>

                    <div>

                        <span class="detail-label">
                            Location
                        </span>

                        <strong>
                            ${escapeHTML(location)}
                        </strong>

                    </div>

                </div>


                <div class="detail-item">

                    <span class="detail-icon">
                        🆔
                    </span>

                    <div>

                        <span class="detail-label">
                            Reference
                        </span>

                        <strong>
                            ${escapeHTML(complaint.id)}
                        </strong>

                    </div>

                </div>

            </div>


            <!-- ================= DESCRIPTION ================= -->

            <div class="description-section">

                <h3>
                    Issue Description
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

            </div>


            ${
                image
                    ? `
                    <div class="complaint-image-section">

                        <h3>
                            Uploaded Image
                        </h3>

                        <img
                            src="${escapeAttribute(image)}"
                            alt="Civic issue"
                            class="complaint-detail-image"
                        >

                    </div>
                    `
                    : ""
            }


            <!-- ================= ACTIONS ================= -->

            <div class="complaint-actions">

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="copyComplaintId('${escapeAttribute(complaint.id)}')"
                >
                    📋 Copy Complaint ID
                </button>

                <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="trackAnotherComplaint()"
                >
                    🔎 Track Another
                </button>

            </div>


        </div>

    `;


    /*
       Scroll smoothly to the result.
    */

    setTimeout(function () {

        trackingResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);


    showTrackingToast(
        "Complaint found successfully.",
        "success"
    );

}


/* =========================================================
   GENERATE TIMELINE
   ========================================================= */

function generateTimeline(currentStatus) {

    const statuses = [
        {
            name: "Reported",
            icon: "📝",
            description:
                "Complaint submitted successfully."
        },

        {
            name: "Verified",
            icon: "🔍",
            description:
                "Complaint reviewed and verified."
        },

        {
            name: "In Progress",
            icon: "🛠️",
            description:
                "Department is working on the issue."
        },

        {
            name: "Resolved",
            icon: "✅",
            description:
                "Civic issue has been resolved."
        }
    ];


    const statusOrder = {
        "Reported": 0,
        "Verified": 1,
        "In Progress": 2,
        "Resolved": 3
    };


    let currentIndex =
        statusOrder[currentStatus];


    /*
       If the stored status is unknown,
       show Reported as the current state.
    */

    if (currentIndex === undefined) {

        currentIndex = 0;

    }


    return statuses.map(
        function (status, index) {

            let className = "";

            if (index < currentIndex) {

                className = "completed";

            }
            else if (index === currentIndex) {

                className = "current";

            }
            else {

                className = "upcoming";

            }


            return `

                <div class="
                    timeline-item
                    ${className}
                ">

                    <div class="timeline-marker">

                        ${status.icon}

                    </div>

                    <div class="timeline-content">

                        <h4>
                            ${status.name}
                        </h4>

                        <p>
                            ${status.description}
                        </p>

                    </div>

                </div>

            `;

        }
    ).join("");

}


/* =========================================================
   GET LOCATION TEXT
   ========================================================= */

function getLocationText(complaint) {

    /*
       Different phases may store location
       in slightly different formats.

       This function supports multiple formats.
    */


    if (complaint.location) {

        if (typeof complaint.location === "string") {

            return complaint.location;

        }


        if (
            complaint.location.latitude !== undefined &&
            complaint.location.longitude !== undefined
        ) {

            return (
                Number(complaint.location.latitude).toFixed(5)
                +
                ", "
                +
                Number(complaint.location.longitude).toFixed(5)
            );

        }

    }


    if (
        complaint.latitude !== undefined &&
        complaint.longitude !== undefined
    ) {

        return (
            Number(complaint.latitude).toFixed(5)
            +
            ", "
            +
            Number(complaint.longitude).toFixed(5)
        );

    }


    return "Location not provided";

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {

        return "Date not available";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return String(dateValue);

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getStatusClass(status) {

    const normalized =
        String(status)
            .toLowerCase()
            .replace(/\s+/g, "-");


    return "status-" + normalized;

}


/* =========================================================
   PRIORITY CLASS
   ========================================================= */

function getPriorityClass(priority) {

    const normalized =
        String(priority)
            .toLowerCase();


    return "priority-" + normalized;

}


/* =========================================================
   COPY COMPLAINT ID
   ========================================================= */

function copyComplaintId(id) {

    if (!id) {

        return;

    }


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(id)
            .then(function () {

                showTrackingToast(
                    "Complaint ID copied!",
                    "success"
                );

            })
            .catch(function () {

                fallbackCopy(id);

            });

    }
    else {

        fallbackCopy(id);

    }

}


/* =========================================================
   FALLBACK COPY
   ========================================================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement("textarea");


    textarea.value = text;

    textarea.style.position = "fixed";

    textarea.style.left = "-9999px";


    document.body.appendChild(textarea);


    textarea.select();


    try {

        document.execCommand("copy");

        showTrackingToast(
            "Complaint ID copied!",
            "success"
        );

    }
    catch (error) {

        showTrackingToast(
            "Unable to copy complaint ID.",
            "error"
        );

    }


    document.body.removeChild(textarea);

}


/* =========================================================
   TRACK ANOTHER COMPLAINT
   ========================================================= */

function trackAnotherComplaint() {

    trackingResult.classList.add("hidden");

    trackingEmpty.classList.remove("hidden");

    complaintIdInput.value = "";

    complaintIdInput.focus();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showTrackingToast(message, type) {

    const toast =
        document.getElementById("toast");


    if (!toast) {

        return;

    }


    toast.textContent = message;


    toast.className =
        "toast " + type + " show";


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   HTML SECURITY HELPERS
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   ATTRIBUTE ESCAPE
   ========================================================= */

function escapeAttribute(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}