document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       CIVICLENS - REPORT MODULE
       Phase 10
       Notifications + Validation + Smart Analysis
       ========================================================= */


    /* =========================================================
       ELEMENT REFERENCES
       ========================================================= */

    const reportForm = document.getElementById("reportForm");

    const titleInput = document.getElementById("issueTitle");
    const descriptionInput = document.getElementById("issueDescription");

    const categorySelect = document.getElementById("issueCategory");
    const prioritySelect = document.getElementById("issuePriority");

    const imageInput = document.getElementById("issueImage");
    const imagePreview = document.getElementById("imagePreview");

    const previewContainer =
        document.getElementById("imagePreviewContainer");

    const removeImageBtn =
        document.getElementById("removeImageBtn");

    const locationStatus =
        document.getElementById("locationStatus");

    const latitudeInput =
        document.getElementById("latitude");

    const longitudeInput =
        document.getElementById("longitude");

    const getLocationBtn =
        document.getElementById("getLocationBtn");

    const analyzeBtn =
        document.getElementById("analyzeIssueBtn");

    const analysisResult =
        document.getElementById("analysisResult");

    const descriptionCounter =
        document.getElementById("descriptionCounter");

    const successBox =
        document.getElementById("submissionSuccess");

    const generatedComplaintId =
        document.getElementById("generatedComplaintId");

    const successComplaintTitle =
        document.getElementById("successComplaintTitle");

    const copyComplaintIdBtn =
        document.getElementById("copyComplaintIdBtn");

    const newComplaintBtn =
        document.getElementById("newComplaintBtn");


    /* =========================================================
       NOTIFICATION SYSTEM
       ========================================================= */

    function createNotificationContainer() {

        let container =
            document.getElementById("civicLensToastContainer");

        if (container) {
            return container;
        }

        container = document.createElement("div");

        container.id = "civicLensToastContainer";

        container.innerHTML = `
            <div class="civic-toast" id="civicToast">

                <div class="civic-toast-icon" id="civicToastIcon">
                    ✓
                </div>

                <div class="civic-toast-content">

                    <strong id="civicToastTitle">
                        Success
                    </strong>

                    <p id="civicToastMessage">
                        Operation completed successfully.
                    </p>

                </div>

                <button
                    type="button"
                    id="civicToastClose"
                    class="civic-toast-close"
                    aria-label="Close notification"
                >
                    ×
                </button>

            </div>
        `;

        document.body.appendChild(container);

        addNotificationStyles();

        return container;
    }


    /* =========================================================
       NOTIFICATION STYLES
       ========================================================= */

    function addNotificationStyles() {

        if (document.getElementById("civicLensNotificationStyles")) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "civicLensNotificationStyles";

        style.textContent = `

            #civicLensToastContainer {
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 99999;
                pointer-events: none;
            }

            .civic-toast {
                width: min(390px, calc(100vw - 32px));
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
                border-radius: 16px;
                background: #ffffff;
                box-shadow:
                    0 18px 45px rgba(0, 0, 0, 0.16);
                border: 1px solid rgba(0, 0, 0, 0.08);
                transform: translateX(120%);
                opacity: 0;
                transition:
                    transform 0.35s ease,
                    opacity 0.35s ease;
                pointer-events: auto;
            }

            .civic-toast.show {
                transform: translateX(0);
                opacity: 1;
            }

            .civic-toast-icon {
                width: 38px;
                height: 38px;
                min-width: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #dcfce7;
                color: #15803d;
                font-size: 18px;
                font-weight: 800;
            }

            .civic-toast-content {
                flex: 1;
                min-width: 0;
            }

            .civic-toast-content strong {
                display: block;
                font-size: 15px;
                color: #111827;
                margin-bottom: 4px;
            }

            .civic-toast-content p {
                margin: 0;
                font-size: 13px;
                line-height: 1.5;
                color: #6b7280;
            }

            .civic-toast-close {
                border: none;
                background: transparent;
                color: #6b7280;
                font-size: 22px;
                line-height: 1;
                cursor: pointer;
                padding: 2px 4px;
            }

            .civic-toast-close:hover {
                color: #111827;
            }

            .civic-toast.error .civic-toast-icon {
                background: #fee2e2;
                color: #dc2626;
            }

            .civic-toast.warning .civic-toast-icon {
                background: #fef3c7;
                color: #d97706;
            }

            .civic-toast.info .civic-toast-icon {
                background: #dbeafe;
                color: #2563eb;
            }

            @media (max-width: 600px) {

                #civicLensToastContainer {
                    top: 14px;
                    right: 14px;
                    left: 14px;
                }

                .civic-toast {
                    width: 100%;
                }
            }

        `;

        document.head.appendChild(style);
    }


    /* =========================================================
       SHOW NOTIFICATION
       ========================================================= */

    let toastTimer = null;

    function showToast(title, message, type = "success") {

        const container =
            createNotificationContainer();

        const toast =
            document.getElementById("civicToast");

        const icon =
            document.getElementById("civicToastIcon");

        const toastTitle =
            document.getElementById("civicToastTitle");

        const toastMessage =
            document.getElementById("civicToastMessage");

        const closeButton =
            document.getElementById("civicToastClose");


        if (!toast) {
            return;
        }


        clearTimeout(toastTimer);


        toast.classList.remove(
            "error",
            "warning",
            "info"
        );

        toast.classList.add(type);


        if (type === "error") {
            icon.textContent = "!";
        }
        else if (type === "warning") {
            icon.textContent = "⚠";
        }
        else if (type === "info") {
            icon.textContent = "i";
        }
        else {
            icon.textContent = "✓";
        }


        toastTitle.textContent =
            title;

        toastMessage.textContent =
            message;


        toast.classList.add("show");


        closeButton.onclick =
            function () {

                toast.classList.remove("show");

            };


        toastTimer =
            setTimeout(function () {

                toast.classList.remove("show");

            }, 4500);
    }


    /* =========================================================
       SMART ANALYSIS RULES
       ========================================================= */

    const civicRules = {

        pothole: {

            keywords: [
                "pothole",
                "pot hole",
                "hole in road",
                "road hole",
                "road pit"
            ],

            category: "Pothole",

            department: "Road Maintenance Department",

            recommendation:
                "The damaged road surface should be inspected and repaired."
        },


        garbage: {

            keywords: [
                "garbage",
                "trash",
                "waste",
                "litter",
                "rubbish",
                "dump",
                "dirty"
            ],

            category: "Garbage",

            department: "Sanitation Department",

            recommendation:
                "The sanitation team should inspect the location and arrange waste removal."
        },


        streetlight: {

            keywords: [
                "streetlight",
                "street light",
                "lamp",
                "light not working",
                "dark street",
                "dark road"
            ],

            category: "Streetlight",

            department: "Electrical Maintenance Department",

            recommendation:
                "The streetlight should be inspected and repaired or replaced."
        },


        water: {

            keywords: [
                "water leakage",
                "water leak",
                "leaking water",
                "pipe leak",
                "broken pipe",
                "water wastage",
                "water flowing"
            ],

            category: "Water Leakage",

            department: "Water Supply Department",

            recommendation:
                "The water supply team should inspect the pipeline and stop the leakage."
        },


        drainage: {

            keywords: [
                "drain",
                "drainage",
                "blocked drain",
                "overflowing drain",
                "sewage",
                "sewer",
                "dirty water"
            ],

            category: "Drainage",

            department: "Drainage Department",

            recommendation:
                "The drainage system should be inspected and blockage should be cleared."
        },


        road: {

            keywords: [
                "road damage",
                "damaged road",
                "broken road",
                "cracked road",
                "road crack",
                "road surface"
            ],

            category: "Road Damage",

            department: "Road Maintenance Department",

            recommendation:
                "The damaged road should be inspected and repair work should be scheduled."
        },


        traffic: {

            keywords: [
                "traffic",
                "traffic signal",
                "signal",
                "congestion",
                "accident",
                "vehicle",
                "parking",
                "traffic jam"
            ],

            category: "Traffic Issue",

            department: "Traffic Management Department",

            recommendation:
                "The traffic situation should be inspected and appropriate traffic management action should be considered."
        }

    };


    /* =========================================================
       URGENCY KEYWORDS
       ========================================================= */

    const emergencyKeywords = [

        "emergency",
        "urgent",
        "dangerous",
        "danger",
        "accident",
        "injury",
        "injured",
        "life threatening",
        "fire",
        "flood",
        "electric shock",
        "shock",
        "risk",
        "unsafe",
        "children",
        "school",
        "hospital"

    ];


    const highPriorityKeywords = [

        "overflowing",
        "severe",
        "major",
        "large",
        "serious",
        "blocked",
        "continuous",
        "immediate",
        "bad smell",
        "health risk",
        "public safety"

    ];


    /* =========================================================
       NORMALIZE TEXT
       ========================================================= */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .replace(/[^\w\s-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =========================================================
       CATEGORY DETECTION
       ========================================================= */

    function detectCategory(text) {

        const normalizedText =
            normalizeText(text);

        let bestRule = null;

        let highestScore = 0;

        let matchedKeywords = [];


        for (const ruleName in civicRules) {

            const rule =
                civicRules[ruleName];

            let score = 0;

            let matches = [];


            rule.keywords.forEach(
                function (keyword) {

                    const normalizedKeyword =
                        normalizeText(keyword);


                    if (
                        normalizedText.includes(
                            normalizedKeyword
                        )
                    ) {

                        score +=
                            normalizedKeyword.includes(" ")
                                ? 3
                                : 2;

                        matches.push(keyword);

                    }

                }
            );


            if (score > highestScore) {

                highestScore = score;

                bestRule = rule;

                matchedKeywords = matches;

            }

        }


        return {

            rule: bestRule,

            score: highestScore,

            keywords: matchedKeywords

        };

    }


    /* =========================================================
       URGENCY DETECTION
       ========================================================= */

    function detectUrgency(text) {

        const normalizedText =
            normalizeText(text);

        const emergencyMatches = [];

        const highMatches = [];


        emergencyKeywords.forEach(
            function (keyword) {

                if (
                    normalizedText.includes(
                        normalizeText(keyword)
                    )
                ) {

                    emergencyMatches.push(keyword);

                }

            }
        );


        highPriorityKeywords.forEach(
            function (keyword) {

                if (
                    normalizedText.includes(
                        normalizeText(keyword)
                    )
                ) {

                    highMatches.push(keyword);

                }

            }
        );


        if (emergencyMatches.length > 0) {

            return {

                level: "Emergency",

                priority: "High",

                matches: emergencyMatches

            };

        }


        if (highMatches.length >= 2) {

            return {

                level: "High",

                priority: "High",

                matches: highMatches

            };

        }


        if (highMatches.length === 1) {

            return {

                level: "Moderate",

                priority: "Medium",

                matches: highMatches

            };

        }


        return {

            level: "Normal",

            priority: "Low",

            matches: []

        };

    }


    /* =========================================================
       SUMMARY GENERATOR
       ========================================================= */

    function generateSummary(
        title,
        description,
        category,
        urgency
    ) {

        let cleanDescription =
            description.trim();


        if (cleanDescription.length > 180) {

            cleanDescription =
                cleanDescription.substring(0, 177) +
                "...";

        }


        let summary =
            "A " +
            category.toLowerCase() +
            " issue has been reported.";


        if (title.trim() !== "") {

            summary +=
                ' The reported issue is "' +
                title.trim() +
                '".';

        }


        if (cleanDescription !== "") {

            summary +=
                " Description: " +
                cleanDescription;

        }


        if (urgency === "Emergency") {

            summary +=
                " The description contains indicators of an urgent public-safety concern.";

        }


        return summary;

    }


    /* =========================================================
       SMART ANALYSIS
       ========================================================= */

    function performSmartAnalysis() {

        const title =
            titleInput
                ? titleInput.value.trim()
                : "";

        const description =
            descriptionInput
                ? descriptionInput.value.trim()
                : "";

        const selectedCategory =
            categorySelect
                ? categorySelect.value
                : "";

        const selectedPriority =
            prioritySelect
                ? prioritySelect.value
                : "";


        if (
            title === "" &&
            description === ""
        ) {

            showToast(
                "Analysis Required",
                "Please enter an issue title or description first.",
                "warning"
            );

            return null;

        }


        const combinedText =
            title + " " + description;


        const categoryResult =
            detectCategory(combinedText);


        const urgencyResult =
            detectUrgency(combinedText);


        let suggestedCategory =
            "Other";

        let department =
            "General Civic Services Department";

        let recommendation =
            "The issue should be reviewed by the appropriate civic department.";


        if (categoryResult.rule) {

            suggestedCategory =
                categoryResult.rule.category;

            department =
                categoryResult.rule.department;

            recommendation =
                categoryResult.rule.recommendation;

        }


        let finalPriority =
            urgencyResult.priority;


        if (selectedPriority === "High") {

            finalPriority = "High";

        }
        else if (
            selectedPriority === "Medium" &&
            finalPriority === "Low"
        ) {

            finalPriority = "Medium";

        }


        const finalCategory =
            selectedCategory &&
            selectedCategory !== "Other"

                ? selectedCategory

                : suggestedCategory;


        const summary =
            generateSummary(
                title,
                description,
                finalCategory,
                urgencyResult.level
            );


        if (analysisResult) {

            analysisResult.innerHTML = `

                <strong>Smart Analysis Complete</strong>

                <br><br>

                <b>Suggested Category:</b>
                ${finalCategory}

                <br>

                <b>Priority:</b>
                ${finalPriority}

                <br>

                <b>Urgency:</b>
                ${urgencyResult.level}

                <br>

                <b>Department:</b>
                ${department}

                <br><br>

                <b>Summary:</b>
                ${summary}

                <br><br>

                <b>Recommendation:</b>
                ${recommendation}

            `;

            analysisResult.classList.add("show");

        }


        const analysisData = {

            suggestedCategory:
                suggestedCategory,

            selectedCategory:
                selectedCategory,

            finalCategory:
                finalCategory,

            suggestedPriority:
                urgencyResult.priority,

            selectedPriority:
                selectedPriority,

            finalPriority:
                finalPriority,

            urgency:
                urgencyResult.level,

            department:
                department,

            summary:
                summary,

            recommendation:
                recommendation,

            matchedKeywords: [
                ...categoryResult.keywords,
                ...urgencyResult.matches
            ]

        };


        try {

            sessionStorage.setItem(
                "civicLensSmartAnalysis",
                JSON.stringify(analysisData)
            );

        }
        catch (error) {

            console.warn(
                "Session storage unavailable.",
                error
            );

        }


        showToast(
            "Smart Analysis Complete",
            "CivicLens analyzed the issue successfully.",
            "success"
        );


        return analysisData;

    }


    /* =========================================================
       ANALYZE BUTTON
       ========================================================= */

    if (analyzeBtn) {

        analyzeBtn.addEventListener(
            "click",
            function () {

                performSmartAnalysis();

            }
        );

    }


    /* =========================================================
       DESCRIPTION CHARACTER COUNTER
       ========================================================= */

    if (descriptionInput) {

        descriptionInput.addEventListener(
            "input",
            function () {

                const length =
                    descriptionInput.value.length;


                if (descriptionCounter) {

                    descriptionCounter.textContent =
                        length + " / 1000";

                }

            }
        );

    }


    /* =========================================================
       LIVE SMART ANALYSIS
       ========================================================= */

    let analysisTimer = null;


    if (descriptionInput) {

        descriptionInput.addEventListener(
            "input",
            function () {

                clearTimeout(
                    analysisTimer
                );


                analysisTimer =
                    setTimeout(
                        function () {

                            if (
                                descriptionInput.value.trim().length >= 20
                            ) {

                                performSmartAnalysis();

                            }

                        },
                        1000
                    );

            }
        );

    }


    /* =========================================================
       IMAGE PREVIEW
       ========================================================= */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function () {

                const file =
                    imageInput.files[0];


                if (!file) {

                    return;

                }


                const allowedTypes = [

                    "image/jpeg",
                    "image/png",
                    "image/webp"

                ];


                const maxSize =
                    5 * 1024 * 1024;


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    showToast(
                        "Invalid Image",
                        "Please select a JPG, PNG, or WEBP image.",
                        "error"
                    );

                    imageInput.value = "";

                    return;

                }


                if (file.size > maxSize) {

                    showToast(
                        "Image Too Large",
                        "Please select an image smaller than 5 MB.",
                        "error"
                    );

                    imageInput.value = "";

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        if (imagePreview) {

                            imagePreview.src =
                                event.target.result;

                        }


                        if (previewContainer) {

                            previewContainer.classList.add(
                                "show"
                            );

                        }


                        showToast(
                            "Image Added",
                            "Issue image preview is ready.",
                            "success"
                        );

                    };


                reader.onerror =
                    function () {

                        showToast(
                            "Image Error",
                            "The selected image could not be loaded.",
                            "error"
                        );

                    };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =========================================================
       REMOVE IMAGE
       ========================================================= */

    if (removeImageBtn) {

        removeImageBtn.addEventListener(
            "click",
            function () {

                if (imageInput) {

                    imageInput.value = "";

                }


                if (imagePreview) {

                    imagePreview.src = "";

                }


                if (previewContainer) {

                    previewContainer.classList.remove(
                        "show"
                    );

                }


                showToast(
                    "Image Removed",
                    "The selected image has been removed.",
                    "info"
                );

            }
        );

    }


    /* =========================================================
       GEOLOCATION
       ========================================================= */

    if (getLocationBtn) {

        getLocationBtn.addEventListener(
            "click",
            function () {

                if (
                    !navigator.geolocation
                ) {

                    showToast(
                        "Location Not Supported",
                        "Your browser does not support geolocation.",
                        "error"
                    );

                    return;

                }


                locationStatus.textContent =
                    "Detecting your location...";


                locationStatus.className =
                    "location-status loading";


                getLocationBtn.disabled =
                    true;


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;


                        if (latitudeInput) {

                            latitudeInput.value =
                                latitude.toFixed(6);

                        }


                        if (longitudeInput) {

                            longitudeInput.value =
                                longitude.toFixed(6);

                        }


                        locationStatus.textContent =
                            "Location captured successfully";


                        locationStatus.className =
                            "location-status success";


                        getLocationBtn.disabled =
                            false;


                        showToast(
                            "Location Captured",
                            "Your current coordinates have been added.",
                            "success"
                        );

                    },


                    function (error) {

                        getLocationBtn.disabled =
                            false;


                        locationStatus.className =
                            "location-status error";


                        let message =
                            "Unable to detect your location.";


                        if (
                            error.code ===
                            error.PERMISSION_DENIED
                        ) {

                            message =
                                "Location permission was denied.";

                        }
                        else if (
                            error.code ===
                            error.POSITION_UNAVAILABLE
                        ) {

                            message =
                                "Location information is unavailable.";

                        }
                        else if (
                            error.code ===
                            error.TIMEOUT
                        ) {

                            message =
                                "Location request timed out.";

                        }


                        locationStatus.textContent =
                            message;


                        showToast(
                            "Location Error",
                            message,
                            "error"
                        );

                    },

                    {

                        enableHighAccuracy: true,

                        timeout: 10000,

                        maximumAge: 0

                    }

                );

            }
        );

    }


    /* =========================================================
       COMPLAINT ID GENERATOR
       ========================================================= */

    function generateComplaintId() {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const randomNumber =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return (
            "CL-" +
            year +
            month +
            day +
            "-" +
            randomNumber
        );

    }


    /* =========================================================
       GET COMPLAINTS
       ========================================================= */

    function getComplaints() {

        const stored =
            localStorage.getItem(
                "civicLensComplaints"
            );


        if (!stored) {

            return [];

        }


        try {

            const complaints =
                JSON.parse(stored);


            return Array.isArray(
                complaints
            )
                ? complaints
                : [];

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
       SAVE COMPLAINT
       ========================================================= */

    function saveComplaint(
        complaint
    ) {

        const complaints =
            getComplaints();


        complaints.push(
            complaint
        );


        localStorage.setItem(
            "civicLensComplaints",
            JSON.stringify(
                complaints
            )
        );

    }


    /* =========================================================
       FORM VALIDATION
       ========================================================= */

    function validateForm() {

        const title =
            titleInput.value.trim();


        const description =
            descriptionInput.value.trim();


        if (title === "") {

            showToast(
                "Missing Title",
                "Please enter an issue title.",
                "error"
            );

            titleInput.focus();

            return false;

        }


        if (description.length < 10) {

            showToast(
                "Description Too Short",
                "Please provide at least 10 characters describing the issue.",
                "error"
            );

            descriptionInput.focus();

            return false;

        }


        if (!categorySelect.value) {

            showToast(
                "Select Category",
                "Please select an issue category.",
                "error"
            );

            categorySelect.focus();

            return false;

        }


        if (!prioritySelect.value) {

            showToast(
                "Select Priority",
                "Please select the issue priority.",
                "error"
            );

            prioritySelect.focus();

            return false;

        }


        const email =
            document.getElementById(
                "contactEmail"
            );


        if (
            email &&
            email.value.trim() !== ""
        ) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                showToast(
                    "Invalid Email",
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return false;

            }

        }


        const phone =
            document.getElementById(
                "contactPhone"
            );


        if (
            phone &&
            phone.value.trim() !== ""
        ) {

            const cleanPhone =
                phone.value
                    .replace(/\D/g, "");


            if (
                cleanPhone.length !== 10
            ) {

                showToast(
                    "Invalid Phone Number",
                    "Please enter a valid 10 digit mobile number.",
                    "error"
                );

                phone.focus();

                return false;

            }

        }


        return true;

    }


    /* =========================================================
       FORM SUBMISSION
       ========================================================= */

    if (reportForm) {

        reportForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!validateForm()) {

                    return;

                }


                showToast(
                    "Processing",
                    "CivicLens is analyzing and registering your complaint.",
                    "info"
                );


                const analysis =
                    performSmartAnalysis();


                if (!analysis) {

                    return;

                }


                const complaintId =
                    generateComplaintId();


                const currentDate =
                    new Date();


                const imageFile =
                    imageInput &&
                    imageInput.files.length > 0

                        ? imageInput.files[0]

                        : null;


                const locationText =
                    document.getElementById(
                        "issueLocation"
                    );


                const email =
                    document.getElementById(
                        "contactEmail"
                    );


                const phone =
                    document.getElementById(
                        "contactPhone"
                    );


                const complaint = {

                    id:
                        complaintId,

                    title:
                        titleInput.value.trim(),

                    description:
                        descriptionInput.value.trim(),

                    category:
                        analysis.finalCategory,

                    selectedCategory:
                        categorySelect.value,

                    priority:
                        analysis.finalPriority,

                    urgency:
                        analysis.urgency,

                    department:
                        analysis.department,

                    smartSummary:
                        analysis.summary,

                    recommendation:
                        analysis.recommendation,

                    location:
                        locationText
                            ? locationText.value.trim()
                            : "",

                    latitude:
                        latitudeInput
                            ? latitudeInput.value
                            : "",

                    longitude:
                        longitudeInput
                            ? longitudeInput.value
                            : "",

                    locationCaptured:
                        Boolean(
                            latitudeInput &&
                            longitudeInput &&
                            latitudeInput.value &&
                            longitudeInput.value
                        ),

                    email:
                        email
                            ? email.value.trim()
                            : "",

                    phone:
                        phone
                            ? phone.value.trim()
                            : "",

                    status:
                        "Reported",

                    createdAt:
                        currentDate.toISOString(),

                    updatedAt:
                        currentDate.toISOString(),

                    imageName:
                        imageFile
                            ? imageFile.name
                            : "",

                    imageData:
                        "",

                    timeline: [

                        {

                            status:
                                "Reported",

                            date:
                                currentDate.toISOString(),

                            note:
                                "Complaint submitted successfully."

                        }

                    ]

                };


                /* =================================================
                   SAVE WITH IMAGE
                   ================================================= */

                if (imageFile) {

                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            complaint.imageData =
                                event.target.result;


                            saveComplaint(
                                complaint
                            );


                            showSuccess(
                                complaint
                            );

                        };


                    reader.onerror =
                        function () {

                            showToast(
                                "Image Processing Error",
                                "The complaint could not process the selected image.",
                                "error"
                            );

                        };


                    reader.readAsDataURL(
                        imageFile
                    );

                }
                else {

                    saveComplaint(
                        complaint
                    );


                    showSuccess(
                        complaint
                    );

                }

            }
        );

    }


    /* =========================================================
       SUCCESS DISPLAY
       ========================================================= */

    function showSuccess(
        complaint
    ) {

        if (generatedComplaintId) {

            generatedComplaintId.textContent =
                complaint.id;

        }


        if (successComplaintTitle) {

            successComplaintTitle.textContent =
                complaint.title;

        }


        if (successBox) {

            successBox.style.display =
                "block";


            successBox.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }


        if (reportForm) {

            reportForm.reset();

        }


        if (imagePreview) {

            imagePreview.src = "";

        }


        if (previewContainer) {

            previewContainer.classList.remove(
                "show"
            );

        }


        if (descriptionCounter) {

            descriptionCounter.textContent =
                "0 / 1000";

        }


        if (locationStatus) {

            locationStatus.textContent =
                "Location not detected.";

            locationStatus.className =
                "location-status";

        }


        showToast(
            "Complaint Submitted Successfully",
            "Your complaint ID is " + complaint.id,
            "success"
        );

    }


    /* =========================================================
       COPY COMPLAINT ID
       ========================================================= */

    if (copyComplaintIdBtn) {

        copyComplaintIdBtn.addEventListener(
            "click",
            async function () {

                const id =
                    generatedComplaintId
                        ? generatedComplaintId.textContent.trim()
                        : "";


                if (!id) {

                    showToast(
                        "Copy Error",
                        "No complaint ID is available.",
                        "error"
                    );

                    return;

                }


                try {

                    if (
                        navigator.clipboard &&
                        window.isSecureContext
                    ) {

                        await navigator.clipboard.writeText(
                            id
                        );

                    }
                    else {

                        const temporaryInput =
                            document.createElement(
                                "input"
                            );


                        temporaryInput.value =
                            id;


                        document.body.appendChild(
                            temporaryInput
                        );


                        temporaryInput.select();


                        document.execCommand(
                            "copy"
                        );


                        temporaryInput.remove();

                    }


                    showToast(
                        "Copied Successfully",
                        "Complaint ID copied: " + id,
                        "success"
                    );

                }
                catch (error) {

                    showToast(
                        "Copy Failed",
                        "Please manually copy your complaint ID.",
                        "error"
                    );

                }

            }
        );

    }


    /* =========================================================
       REPORT ANOTHER ISSUE
       ========================================================= */

    if (newComplaintBtn) {

        newComplaintBtn.addEventListener(
            "click",
            function () {

                if (successBox) {

                    successBox.style.display =
                        "none";

                }


                if (reportForm) {

                    reportForm.reset();

                }


                if (imagePreview) {

                    imagePreview.src = "";

                }


                if (previewContainer) {

                    previewContainer.classList.remove(
                        "show"
                    );

                }


                if (descriptionCounter) {

                    descriptionCounter.textContent =
                        "0 / 1000";

                }


                if (locationStatus) {

                    locationStatus.textContent =
                        "Location not detected.";

                    locationStatus.className =
                        "location-status";

                }


                if (analysisResult) {

                    analysisResult.textContent =
                        "Smart analysis will appear here.";

                }


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });


                showToast(
                    "Ready",
                    "You can now report another civic issue.",
                    "info"
                );

            }
        );

    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    createNotificationContainer();


    console.log(
        "CivicLens Phase 10 Report Module loaded successfully."
    );

});
const savedLocation =
    localStorage.getItem("civicLensSelectedLocation");

if (savedLocation) {

    const location =
        JSON.parse(savedLocation);

    document.getElementById("latitude").value =
        location.latitude;

    document.getElementById("longitude").value =
        location.longitude;

    document.getElementById("locationStatus").textContent =
        "✓ Location selected from map.";

}