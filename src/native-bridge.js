/**
 * native-bridge.js
 * 
 * Safely bridges the gap between the standard web browser environment
 * and the Median.co Android APK wrapper for OneSignal Push Notifications.
 */

// Initialize Median push notifications safely
document.addEventListener("DOMContentLoaded", () => {
    // Check if the website is running inside the Median.co Android Wrapper
    if (typeof window.median !== 'undefined') {
        console.log("[NativeBridge] Median wrapper detected! Initializing Push Notifications...");
        
        // Register for push notifications via the Median JS Bridge
        if (window.median.oneSignal && window.median.oneSignal.register) {
            window.median.oneSignal.register();
            
            // Request the player info to trigger welcome push
            setTimeout(() => {
                if (window.median.oneSignal && window.median.oneSignal.info) {
                    window.median.oneSignal.info({'callback': 'medianOneSignalInfoCallback'});
                }
            }, 3000); // give it a few seconds to register
        }
    } else {
        console.log("[NativeBridge] Standard web browser detected. Skipping Median push initialization.");
    }
});

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
}

window.medianOneSignalInfoCallback = function(data) {
    console.log("[NativeBridge] Received OneSignal Info:", data);
    if (data && data.oneSignalUserId) {
        // Trigger Supabase insertion for welcome push
        const playerId = data.oneSignalUserId;
        const greeting = getGreeting();
        
        // Use a global supabase client if it exists, or dispatch a custom event
        window.dispatchEvent(new CustomEvent('medianAppOpened', { 
            detail: { playerId, greeting } 
        }));
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

    if (typeof window.median !== 'undefined' && window.median.oneSignal && window.median.oneSignal.setExternalUserId) {
        console.log(`[NativeBridge] Syncing user ${userId} with OneSignal via Median.`);
        window.median.oneSignal.setExternalUserId({ externalUserId: String(userId) });
    } else {
        console.log(`[NativeBridge] Ignored syncUserWithOneSignal(${userId}) - Not running in Median Wrapper.`);
    }
};
