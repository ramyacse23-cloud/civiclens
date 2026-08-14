/* =========================================================
   CIVICLENS - MAIN APPLICATION JAVASCRIPT
   Phase 10
   ========================================================= */


/* =========================================================
   CIVICLENS STORAGE KEY
   ========================================================= */

const CIVICLENS_STORAGE_KEY = "civicLensComplaints";


/* =========================================================
   GET ALL COMPLAINTS
   ========================================================= */

function getComplaints() {

    try {

        const data =
            localStorage.getItem(
                CIVICLENS_STORAGE_KEY
            );

        if (!data) {
            return [];
        }

        const complaints =
            JSON.parse(data);

        if (!Array.isArray(complaints)) {
            return [];
        }

        return complaints;

    } catch (error) {

        console.error(
            "Unable to read CivicLens complaints:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE ALL COMPLAINTS
   ========================================================= */

function saveComplaints(complaints) {

    try {

        localStorage.setItem(
            CIVICLENS_STORAGE_KEY,
            JSON.stringify(complaints)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save complaints:",
            error
        );

        showToast(
            "Unable to save complaint data.",
            "error"
        );

        return false;

    }

}


/* =========================================================
   GENERATE COMPLAINT ID
   ========================================================= */

function generateComplaintId() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return (
        "CL-" +
        year +
        "-" +
        randomNumber
    );

}


/* =========================================================
   SHOW TOAST NOTIFICATION
   ========================================================= */

function showToast(
    message,
    type = "info",
    duration = 4000
) {

    let container =
        document.getElementById(
            "toastContainer"
        );


    /* Create toast container if missing */

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "toastContainer";

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast toast-" +
        type;


    let icon = "ℹ️";


    if (type === "success") {
        icon = "✅";
    }

    if (type === "error") {
        icon = "❌";
    }

    if (type === "warning") {
        icon = "⚠️";
    }


    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-message">
            ${escapeHTML(message)}
        </div>

        <button
            class="toast-close"
            aria-label="Close notification"
        >
            ×
        </button>

    `;


    container.appendChild(
        toast
    );


    /* Close button */

    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    closeButton.addEventListener(
        "click",
        function () {

            removeToast(toast);

        }
    );


    /* Small delay for animation */

    requestAnimationFrame(
        function () {

            toast.classList.add(
                "toast-visible"
            );

        }
    );


    /* Auto remove */

    setTimeout(
        function () {

            removeToast(toast);

        },
        duration
    );

}


/* =========================================================
   REMOVE TOAST
   ========================================================= */

function removeToast(toast) {

    if (!toast) {
        return;
    }


    toast.classList.remove(
        "toast-visible"
    );


    toast.classList.add(
        "toast-hiding"
    );


    setTimeout(
        function () {

            if (
                toast &&
                toast.parentElement
            ) {

                toast.remove();

            }

        },
        300
    );

}


/* =========================================================
   ESCAPE HTML
   Prevent HTML injection in notifications/UI
   ========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   SHOW INLINE VALIDATION ERROR
   ========================================================= */

function showFieldError(
    input,
    message
) {

    if (!input) {
        return;
    }


    clearFieldError(input);


    input.classList.add(
        "input-error"
    );


    const errorElement =
        document.createElement(
            "div"
        );


    errorElement.className =
        "field-error";


    errorElement.textContent =
        message;


    const parent =
        input.parentElement;


    if (parent) {

        parent.appendChild(
            errorElement
        );

    }

}


/* =========================================================
   CLEAR FIELD ERROR
   ========================================================= */

function clearFieldError(input) {

    if (!input) {
        return;
    }


    input.classList.remove(
        "input-error"
    );


    const parent =
        input.parentElement;


    if (!parent) {
        return;
    }


    const existingError =
        parent.querySelector(
            ".field-error"
        );


    if (existingError) {

        existingError.remove();

    }

}


/* =========================================================
   CLEAR ALL FORM ERRORS
   ========================================================= */

function clearFormErrors(form) {

    if (!form) {
        return;
    }


    const errorInputs =
        form.querySelectorAll(
            ".input-error"
        );


    errorInputs.forEach(
        function (input) {

            input.classList.remove(
                "input-error"
            );

        }
    );


    const fieldErrors =
        form.querySelectorAll(
            ".field-error"
        );


    fieldErrors.forEach(
        function (error) {

            error.remove();

        }
    );

}


/* =========================================================
   VALIDATE EMAIL
   ========================================================= */

function isValidEmail(email) {

    if (!email) {
        return true;
    }


    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return pattern.test(
        email
    );

}


/* =========================================================
   VALIDATE PHONE
   ========================================================= */

function isValidPhone(phone) {

    if (!phone) {
        return true;
    }


    const cleaned =
        phone.replace(
            /[\s\-+()]/g,
            ""
        );


    return (
        /^\d{10,15}$/.test(
            cleaned
        )
    );

}


/* =========================================================
   VALIDATE IMAGE
   ========================================================= */

function validateImageFile(
    file
) {

    if (!file) {

        return {
            valid: true,
            message: ""
        };

    }


    const allowedTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        return {

            valid: false,

            message:
                "Please select a JPG, PNG or WebP image."

        };

    }


    const maxSize =
        5 * 1024 * 1024;


    if (
        file.size > maxSize
    ) {

        return {

            valid: false,

            message:
                "Image size must be 5 MB or less."

        };

    }


    return {

        valid: true,

        message: ""

    };

}


/* =========================================================
   VALIDATE REPORT FORM
   ========================================================= */

function validateReportForm(
    form
) {

    if (!form) {

        return {
            valid: false,
            errors: []
        };

    }


    clearFormErrors(
        form
    );


    const errors = [];


    const title =
        document.getElementById(
            "issueTitle"
        );


    const description =
        document.getElementById(
            "issueDescription"
        );


    const category =
        document.getElementById(
            "issueCategory"
        );


    const priority =
        document.getElementById(
            "issuePriority"
        );


    const image =
        document.getElementById(
            "issueImage"
        );


    const email =
        document.getElementById(
            "contactEmail"
        );


    const phone =
        document.getElementById(
            "contactPhone"
        );


    /* TITLE */

    if (title) {

        const value =
            title.value.trim();


        if (!value) {

            showFieldError(
                title,
                "Please enter an issue title."
            );

            errors.push(
                "Issue title is required."
            );

        } else if (
            value.length < 5
        ) {

            showFieldError(
                title,
                "Title should contain at least 5 characters."
            );

            errors.push(
                "Issue title is too short."
            );

        } else if (
            value.length > 100
        ) {

            showFieldError(
                title,
                "Title should not exceed 100 characters."
            );

            errors.push(
                "Issue title is too long."
            );

        }

    }


    /* DESCRIPTION */

    if (description) {

        const value =
            description.value.trim();


        if (!value) {

            showFieldError(
                description,
                "Please describe the civic issue."
            );

            errors.push(
                "Description is required."
            );

        } else if (
            value.length < 15
        ) {

            showFieldError(
                description,
                "Please provide a little more detail."
            );

            errors.push(
                "Description is too short."
            );

        } else if (
            value.length > 1000
        ) {

            showFieldError(
                description,
                "Description should not exceed 1000 characters."
            );

            errors.push(
                "Description is too long."
            );

        }

    }


    /* CATEGORY */

    if (category) {

        if (
            !category.value.trim()
        ) {

            showFieldError(
                category,
                "Please select an issue category."
            );

            errors.push(
                "Category is required."
            );

        }

    }


    /* PRIORITY */

    if (priority) {

        if (
            !priority.value.trim()
        ) {

            showFieldError(
                priority,
                "Please select a priority."
            );

            errors.push(
                "Priority is required."
            );

        }

    }


    /* IMAGE */

    if (
        image &&
        image.files &&
        image.files.length > 0
    ) {

        const result =
            validateImageFile(
                image.files[0]
            );


        if (!result.valid) {

            showFieldError(
                image,
                result.message
            );

            errors.push(
                result.message
            );

        }

    }


    /* EMAIL */

    if (email) {

        const value =
            email.value.trim();


        if (
            value &&
            !isValidEmail(value)
        ) {

            showFieldError(
                email,
                "Please enter a valid email address."
            );

            errors.push(
                "Invalid email address."
            );

        }

    }


    /* PHONE */

    if (phone) {

        const value =
            phone.value.trim();


        if (
            value &&
            !isValidPhone(value)
        ) {

            showFieldError(
                phone,
                "Please enter a valid phone number."
            );

            errors.push(
                "Invalid phone number."
            );

        }

    }


    /* SHOW GENERAL ERROR */

    if (errors.length > 0) {

        showToast(
            "Please correct the highlighted fields.",
            "error"
        );


        return {

            valid: false,

            errors: errors

        };

    }


    return {

        valid: true,

        errors: []

    };

}


/* =========================================================
   SET BUTTON LOADING STATE
   ========================================================= */

function setButtonLoading(
    button,
    loading,
    loadingText = "Processing..."
) {

    if (!button) {
        return;
    }


    if (loading) {

        if (
            !button.dataset.originalText
        ) {

            button.dataset.originalText =
                button.innerHTML;

        }


        button.disabled = true;


        button.innerHTML = `

            <span class="button-spinner"></span>

            ${escapeHTML(
                loadingText
            )}

        `;

        button.classList.add(
            "button-loading"
        );

    } else {

        button.disabled = false;


        if (
            button.dataset.originalText
        ) {

            button.innerHTML =
                button.dataset.originalText;

        }


        button.classList.remove(
            "button-loading"
        );

    }

}


/* =========================================================
   CHECK DUPLICATE COMPLAINT
   ========================================================= */

function findPossibleDuplicate(
    title,
    category,
    latitude,
    longitude
) {

    const complaints =
        getComplaints();


    if (
        complaints.length === 0
    ) {

        return null;

    }


    const normalizedTitle =
        title
            .toLowerCase()
            .trim()
            .replace(
                /\s+/g,
                " "
            );


    for (
        let i = 0;
        i < complaints.length;
        i++
    ) {

        const complaint =
            complaints[i];


        const existingTitle =
            String(
                complaint.title ||
                complaint.issueTitle ||
                ""
            )
            .toLowerCase()
            .trim()
            .replace(
                /\s+/g,
                " "
            );


        const existingCategory =
            String(
                complaint.category ||
                ""
            )
            .toLowerCase();


        const currentCategory =
            String(
                category ||
                ""
            )
            .toLowerCase();


        if (
            normalizedTitle &&
            existingTitle ===
                normalizedTitle &&
            existingCategory ===
                currentCategory
        ) {

            return complaint;

        }


        /* Location based duplicate check */

        if (
            latitude &&
            longitude &&
            complaint.latitude &&
            complaint.longitude
        ) {

            const latDifference =
                Math.abs(
                    Number(latitude) -
                    Number(complaint.latitude)
                );


            const lngDifference =
                Math.abs(
                    Number(longitude) -
                    Number(complaint.longitude)
                );


            if (
                latDifference < 0.0005 &&
                lngDifference < 0.0005 &&
                existingCategory ===
                    currentCategory
            ) {

                return complaint;

            }

        }

    }


    return null;

}


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

function setupCharacterCounter(
    input,
    counter,
    maxLength
) {

    if (
        !input ||
        !counter
    ) {

        return;

    }


    function updateCounter() {

        const length =
            input.value.length;


        counter.textContent =
            length +
            " / " +
            maxLength;


        if (
            length >
            maxLength * 0.9
        ) {

            counter.classList.add(
                "counter-warning"
            );

        } else {

            counter.classList.remove(
                "counter-warning"
            );

        }

    }


    input.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();

}


/* =========================================================
   INPUT EVENT VALIDATION
   ========================================================= */

function setupLiveValidation() {

    const inputs =
        document.querySelectorAll(
            "input, textarea, select"
        );


    inputs.forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    clearFieldError(
                        input
                    );

                }
            );


            input.addEventListener(
                "change",
                function () {

                    clearFieldError(
                        input
                    );

                }
            );

        }
    );

}


/* =========================================================
   IMAGE VALIDATION ON SELECTION
   ========================================================= */

function setupImageValidation() {

    const imageInput =
        document.getElementById(
            "issueImage"
        );


    if (!imageInput) {
        return;
    }


    imageInput.addEventListener(
        "change",
        function () {

            clearFieldError(
                imageInput
            );


            if (
                !imageInput.files ||
                imageInput.files.length === 0
            ) {

                return;

            }


            const file =
                imageInput.files[0];


            const result =
                validateImageFile(
                    file
                );


            if (!result.valid) {

                showFieldError(
                    imageInput,
                    result.message
                );


                imageInput.value =
                    "";


                showToast(
                    result.message,
                    "error"
                );


                return;

            }


            showToast(
                "Image selected successfully.",
                "success",
                2500
            );

        }
    );

}


/* =========================================================
   GLOBAL KEYBOARD ACCESSIBILITY
   ========================================================= */

function setupKeyboardAccessibility() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                const toasts =
                    document.querySelectorAll(
                        ".toast"
                    );


                toasts.forEach(
                    function (toast) {

                        removeToast(
                            toast
                        );

                    }
                );

            }

        }
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupLiveValidation();

        setupImageValidation();

        setupKeyboardAccessibility();


        const description =
            document.getElementById(
                "issueDescription"
            );


        const descriptionCounter =
            document.getElementById(
                "descriptionCounter"
            );


        if (
            description &&
            descriptionCounter
        ) {

            setupCharacterCounter(
                description,
                descriptionCounter,
                1000
            );

        }

    }
);