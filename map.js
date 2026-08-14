document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("map");

    if (!mapElement) {
        console.error("Map container not found.");
        return;
    }

    // Default location
    // Chennai
    const defaultLatitude = 13.0827;
    const defaultLongitude = 80.2707;

    const map = L.map("map").setView(
        [defaultLatitude, defaultLongitude],
        12
    );

    // OpenStreetMap
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // ---------------------------------------------------------
    // MARKER GROUP
    // ---------------------------------------------------------

    const markerGroup = L.layerGroup().addTo(map);


    // ---------------------------------------------------------
    // DEFAULT CIVIC ISSUE MARKERS
    // ---------------------------------------------------------

    const issues = [

        {
            lat: 13.0827,
            lng: 80.2707,
            title: "Road Damage",
            category: "Road Damage",
            status: "Reported"
        },

        {
            lat: 13.0569,
            lng: 80.2425,
            title: "Garbage Accumulation",
            category: "Garbage",
            status: "In Progress"
        },

        {
            lat: 13.0475,
            lng: 80.2824,
            title: "Streetlight Problem",
            category: "Streetlight",
            status: "Resolved"
        },

        {
            lat: 13.1067,
            lng: 80.2206,
            title: "Water Leakage",
            category: "Water Leakage",
            status: "Reported"
        }

    ];


    // ---------------------------------------------------------
    // ADD ISSUE MARKERS
    // ---------------------------------------------------------

    issues.forEach(function (issue) {

        const marker = L.marker([
            issue.lat,
            issue.lng
        ]).addTo(markerGroup);

        marker.bindPopup(`
            <div style="min-width:180px;">
                <h3 style="margin:0 0 8px;">
                    ${issue.title}
                </h3>

                <p style="margin:4px 0;">
                    <strong>Category:</strong>
                    ${issue.category}
                </p>

                <p style="margin:4px 0;">
                    <strong>Status:</strong>
                    ${issue.status}
                </p>

                <p style="margin:4px 0;">
                    <strong>Location:</strong>
                    ${issue.lat.toFixed(4)},
                    ${issue.lng.toFixed(4)}
                </p>
            </div>
        `);

    });


    // ---------------------------------------------------------
    // USER LOCATION BUTTON
    // ---------------------------------------------------------

    const locationButton =
        document.getElementById("useMyLocation");

    const locationStatus =
        document.getElementById("locationStatus");


    if (locationButton) {

        locationButton.addEventListener(
            "click",
            function () {

                if (!navigator.geolocation) {

                    showLocationMessage(
                        "Geolocation is not supported by this browser.",
                        "error"
                    );

                    return;
                }


                // Button loading state

                locationButton.disabled = true;

                locationButton.innerHTML =
                    "📍 Detecting Location...";


                showLocationMessage(
                    "Requesting your location...",
                    "loading"
                );


                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;


                        // Move map to user

                        map.setView(
                            [latitude, longitude],
                            16
                        );


                        // Remove previous user marker

                        if (window.userLocationMarker) {

                            map.removeLayer(
                                window.userLocationMarker
                            );

                        }


                        // Create user marker

                        window.userLocationMarker =
                            L.marker(
                                [latitude, longitude]
                            ).addTo(map);


                        window.userLocationMarker
                            .bindPopup(`
                                <div style="text-align:center;">
                                    <strong>📍 Your Location</strong>
                                    <br><br>
                                    Latitude:
                                    ${latitude.toFixed(6)}
                                    <br>
                                    Longitude:
                                    ${longitude.toFixed(6)}
                                </div>
                            `)
                            .openPopup();


                        // Accuracy circle

                        if (window.userAccuracyCircle) {

                            map.removeLayer(
                                window.userAccuracyCircle
                            );

                        }


                        window.userAccuracyCircle =
                            L.circle(
                                [latitude, longitude],
                                {
                                    radius:
                                        position.coords.accuracy,
                                    color: "#2563eb",
                                    fillColor: "#2563eb",
                                    fillOpacity: 0.12,
                                    weight: 2
                                }
                            ).addTo(map);


                        showLocationMessage(
                            "✓ Your location detected successfully.",
                            "success"
                        );


                        locationButton.disabled = false;

                        locationButton.innerHTML =
                            "📍 Use My Location Again";


                    },

                    function (error) {

                        locationButton.disabled = false;

                        locationButton.innerHTML =
                            "📍 Use My Location";


                        let message =
                            "Unable to detect your location.";


                        switch (error.code) {

                            case error.PERMISSION_DENIED:

                                message =
                                    "Location permission was denied. Please allow location access in your browser.";

                                break;


                            case error.POSITION_UNAVAILABLE:

                                message =
                                    "Your location is currently unavailable.";

                                break;


                            case error.TIMEOUT:

                                message =
                                    "Location request timed out. Please try again.";

                                break;

                        }


                        showLocationMessage(
                            "⚠ " + message,
                            "error"
                        );

                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    }

                );

            }

        );

    }


    // ---------------------------------------------------------
    // LOCATION MESSAGE
    // ---------------------------------------------------------

    function showLocationMessage(
        message,
        type
    ) {

        if (!locationStatus) {
            return;
        }


        locationStatus.textContent =
            message;


        locationStatus.className =
            "location-status";


        if (type === "success") {

            locationStatus.classList.add(
                "location-success"
            );

        }

        else if (type === "error") {

            locationStatus.classList.add(
                "location-error"
            );

        }

        else {

            locationStatus.classList.add(
                "location-loading"
            );

        }

    }


    // ---------------------------------------------------------
    // MAP RESIZE FIX
    // ---------------------------------------------------------

    setTimeout(function () {

        map.invalidateSize();

    }, 300);


});
// =========================================================
// SUBMIT LOCATION
// =========================================================

const submitLocationBtn =
    document.getElementById("submitLocationBtn");

if (submitLocationBtn) {

    submitLocationBtn.addEventListener(
        "click",
        function () {

            if (!window.userLocationMarker) {

                showLocationMessage(
                    "⚠ Please click 'Use My Location' first.",
                    "error"
                );

                return;
            }

            const position =
                window.userLocationMarker.getLatLng();

            const latitude =
                position.lat;

            const longitude =
                position.lng;


            // Save location

            const selectedLocation = {
                latitude: latitude,
                longitude: longitude,
                date: new Date().toISOString()
            };


            localStorage.setItem(
                "civicLensSelectedLocation",
                JSON.stringify(selectedLocation)
            );


            showLocationMessage(
                "✓ Location submitted successfully!",
                "success"
            );


            submitLocationBtn.textContent =
                "✓ Location Submitted";


            submitLocationBtn.disabled = true;


            // Show confirmation

            alert(
                "Location submitted successfully!\n\n" +
                "Latitude: " +
                latitude.toFixed(6) +
                "\nLongitude: " +
                longitude.toFixed(6)
            );

        }
    );

}