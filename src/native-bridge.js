/**
 * native-bridge.js
 * 
 * Safely bridges the gap between the standard web browser environment
 * and the Median.co Android APK wrapper for OneSignal Push Notifications.
 */
alert("[Debug] The new native-bridge.js file successfully downloaded to your phone!");

// Initialize Median push notifications safely
function initializePush() {
    alert("[Debug] typeof median: " + (typeof window.median) + " | typeof gonative: " + (typeof window.gonative));
    // Check if the website is running inside the Median.co Android Wrapper
    if (typeof window.median !== 'undefined' || typeof window.gonative !== 'undefined') {
        alert("[Debug] Median App Wrapper Detected!");
        console.log("[NativeBridge] Median wrapper detected! Initializing Push Notifications...");
        
        // Register for push notifications via the Median JS Bridge
        const os = window.median.onesignal || window.median.oneSignal;
        if (os) {
            if (os.register) os.register();
            
            // Request the player info to trigger welcome push
            setTimeout(() => {
                if (os.info) {
                    os.info({'callback': 'medianOneSignalInfoCallback'});
                }
            }, 3000); // give it a few seconds to register
        }
    } else {
        console.log("[NativeBridge] Standard web browser detected. Initializing Web Push...");
        
        // Add OneSignal Web SDK dynamically for Desktop / Web Users
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
                appId: "ce6b024e-824d-4e13-9d50-58e1f31eac03",
                safari_web_id: "web.onesignal.auto.5694d1e9-fcaa-415d-b1f1-1ef52daca700",
                notifyButton: { enable: true },
            });
        });
        
        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
        script.defer = true;
        document.head.appendChild(script);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializePush);
} else {
    initializePush();
}


function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
}

window.medianOneSignalInfoCallback = function(data) {
    alert("[Debug] Info Callback Fired: " + JSON.stringify(data));
    console.log("[NativeBridge] Received OneSignal Info:", data);
    if (data && data.oneSignalUserId) {
        alert("[Debug] Found Player ID: " + data.oneSignalUserId);
        const playerId = data.oneSignalUserId;
        const greeting = getGreeting();
        
        window.dispatchEvent(new CustomEvent('medianAppOpened', { 
            detail: { playerId, greeting } 
        }));
    } else {
        alert("[Debug] No oneSignalUserId in data!");
    }
};


/**
 * Reusable function to sync a user's ID with OneSignal for targeted push notifications.
 * Can be called from anywhere in your frontend when a user logs in.
 * 
 * @param {string} userId - The unique identifier of the logged-in user.
 */
window.syncUserWithOneSignal = function(userId) {
    if (!userId) {
        console.error("[NativeBridge] syncUserWithOneSignal called without a userId.");
        return;
    }

    const os = window.median.onesignal || window.median.oneSignal;
    if (typeof window.median !== 'undefined' && os && os.setExternalUserId) {
        console.log(`[NativeBridge] Syncing user ${userId} with OneSignal via Median.`);
        os.setExternalUserId({ externalUserId: String(userId) });
    } else {
        console.log(`[NativeBridge] Ignored syncUserWithOneSignal(${userId}) - Not running in Median Wrapper.`);
    }
};
