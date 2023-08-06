let notificationInterval; // Store the interval ID for the notification timer
let countdownInterval; // Store the interval ID for the countdown timer
let countdownTimeRemaining = 0; // Global variable to store the countdown time in milliseconds

// Check if the browser supports Service Workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('service-worker.js')
            .then((registration) => {
                console.log(
                    'Service Worker registered with scope:',
                    registration.scope
                );
                askNotificationPermission();
                // Check for updates and prompt the user to update the service worker
                if (registration.waiting) {
                    updateServiceWorker(registration.waiting);
                }

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                            updateServiceWorker(newWorker);
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });

        // Listen for the 'message' event from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'show-toast') {
                showAppToast();
            }
        });
    });
}

// Function to update the service worker
function updateServiceWorker(worker) {
    if (
        worker &&
        confirm('A new version of the app is available. Reload to update?')
    ) {
        worker.postMessage({ action: 'skipWaiting' });
        worker.addEventListener('statechange', (event) => {
            if (event.target.state === 'activated') {
                console.log(
                    'New service worker activated. Reloading the page...'
                );
                window.location.reload();
            }
        });
    }
}

// Ask for permission to show notifications
function askNotificationPermission() {
    const askPermissionButton = document.getElementById('askPermissionButton');
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            console.log('Notification permission already granted.');
            askPermissionButton.disabled = true;
            scheduleNotifications();
        } else if (Notification.permission === 'denied') {
            askPermissionButton.disabled = false;
            console.warn('Notification permission denied.');
        } else {
            // Request permission only when the user explicitly interacts with a button or similar action.
            askPermissionButton.disabled = false;
            askPermissionButton.addEventListener('click', () => {
                Notification.requestPermission()
                    .then((permission) => {
                        if (permission === 'granted') {
                            console.log('Notification permission granted.');
                            askPermissionButton.disabled = true;
                            scheduleNotifications();
                        } else {
                            console.warn('Notification permission denied.');
                        }
                    })
                    .catch((error) => {
                        console.error(
                            'Error requesting notification permission:',
                            error
                        );
                    });
            });
        }
    }
}

// Function to show the notification and play the sound
function showNotification() {
    const options = {
        body: 'This is an hourly notification from ChronoChime!',
        icon: 'chrono-chime-icon-192.png', // Replace with the path to your notification icon (192x192 pixels)
        vibrate: [200, 100, 200], // Vibration pattern (optional)
        // Add other notification options here if needed
    };

    // Play the notification sound
    const notificationSound = new Audio('notification.mp3'); // Replace with your notification sound file
    notificationSound.play();

    // Send the notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Hourly Notification', options);
    }
}

// Schedule hourly notifications
function scheduleNotifications() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0); // Set to the next hour, 0th minute, and 0th second

    const timeUntilNextHour = nextHour - now;

    // Clear the previous intervals if they exist
    clearInterval(notificationInterval);
    clearInterval(countdownInterval);

    // Show the initial notification and start the countdown timer
    showNotification();
    resetCountdownTime(timeUntilNextHour);
    updateCountdownTimer();
    countdownInterval = setInterval(updateCountdownTimer, 1000); // Update every second

    setTimeout(() => {
        console.log(
            'Reached Time until next hour %s seconds',
            timeUntilNextHour / 1000
        );

        showNotification();
        resetCountdownTime(60 * 60 * 1000);
        updateCountdownTimer();
        notificationInterval = setInterval(() => {
            console.log(
                'Starting notification interval '
            );
            showNotification();
            resetCountdownTime(60 * 60 * 1000);// Reset the countdown to 1 hour
            updateCountdownTimer();
        }, 60 * 60 * 1000); // Repeat every hour
    }, timeUntilNextHour);
}

// Function to update the countdown timer
function updateCountdownTimer() {
    countdownTimeRemaining -= 1000; // Subtract 1 second (1000 milliseconds) from the remaining time

    if (countdownTimeRemaining <= 0) {
        // Countdown reached zero or became negative, stop the interval
        clearInterval(countdownInterval);

        // Reset the countdown time to 1 hour and update the countdown timer accordingly
        resetCountdownTime(60 * 60 * 1000);
        updateCountdownTimer();
    } else {
        // Calculate the countdown time (in minutes and seconds)
        const minutes = Math.floor(
            (countdownTimeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((countdownTimeRemaining % (1000 * 60)) / 1000);

        // Update the countdown timer on the HTML element with ID 'countdownTimer'
        document.getElementById(
            'countdownTimer'
        ).textContent = `Next notification in ${minutes}m ${seconds}s`;
    }
}

// Function to reset the countdown time
function resetCountdownTime(time) {
    countdownTimeRemaining = time;
}

// Show the offline toast notification
function showOfflineToast() {
    const offlineToast = document.getElementById('offlineToast');
    offlineToast.style.opacity = '1';
    offlineToast.style.visibility = 'visible';
}

// Hide the offline toast notification
function hideOfflineToast() {
    const offlineToast = document.getElementById('offlineToast');
    offlineToast.style.opacity = '0';
    offlineToast.style.visibility = 'hidden';
}

// Check online status and show/hide the toast
function handleOnlineStatus() {
    if (navigator.onLine) {
        hideOfflineToast();
    } else {
        showOfflineToast();
    }
}

// Function to show the toast notification
function showAppToast() {
    const toastNotification = document.getElementById('toastNotification');
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 5000); // Hide the toast after 5 seconds
}

// Listen for online/offline events
window.addEventListener('online', handleOnlineStatus);
window.addEventListener('offline', handleOnlineStatus);

// Initialize the online status when the page loads
handleOnlineStatus();
