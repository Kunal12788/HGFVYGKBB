import median from 'median-js-bridge';

/**
 * native-bridge.js
 * 
 * Safely bridges the gap between the standard web browser environment
 * and the Median.co Android APK wrapper for OneSignal Push Notifications.
 * Now powered by the official median-js-bridge NPM package.
 */

function logDebug(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function initializePush() {
    // Check if the website is running inside the Median.co Android Wrapper
    if (median.isNativeApp()) {
        logDebug('debugNative', 'Native wrapper: YES');
        console.log("[NativeBridge] Median NPM wrapper detected! Initializing Push Notifications...");
        
        // Register for push notifications via the Median JS Bridge
        if (median.onesignal) {
            logDebug('debugOneSignal', 'OneSignal plugin: FOUND');
            if (median.onesignal.register) {
                median.onesignal.register();
                logDebug('debugOneSignal', 'OneSignal plugin: FOUND & REGISTERED');
            } else {
                logDebug('debugOneSignal', 'OneSignal plugin: FOUND but no register method');
            }
        } else {
            logDebug('debugOneSignal', 'OneSignal plugin: NOT FOUND (undefined)');
        }
        
        // Request the player info to trigger welcome push
        setTimeout(() => {
            if (median.onesignal && median.onesignal.onesignalInfo) {
                median.onesignal.onesignalInfo({'callback': 'medianOneSignalInfoCallback'});
            } else {
                logDebug('debugInfo', 'ID: Failed to query onesignalInfo (undefined)');
            }
        }, 3000); // give it a few seconds to register
    } else {
        logDebug('debugNative', 'Native wrapper: NO (Standard browser)');
        logDebug('debugOneSignal', 'Web Push: Initializing...');
        console.log("[NativeBridge] Standard web browser detected. Initializing Web Push...");
        
        // Add OneSignal Web SDK dynamically for Desktop / Web Users
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
                appId: "d925fd54-84e4-4a22-8ce9-09513f73908d",
                safari_web_id: "web.onesignal.auto.5694d1e9-fcaa-415d-b1f1-1ef52daca700",
                notifyButton: { enable: true },
            });
            logDebug('debugOneSignal', 'Web Push: INITIALIZED');
            OneSignal.User.PushSubscription.addEventListener("change", function(state) {
                logDebug('debugInfo', 'Web Sub ID: ' + state.current.id);
            });
        });
        
        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
        script.defer = true;
        document.head.appendChild(script);
    }
}

// Wait for the Median bridge to be ready before initializing
median.onReady(initializePush);

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
}

window.medianOneSignalInfoCallback = function(data) {
    console.log("[NativeBridge] Received OneSignal Info:", data);
    if (data && data.oneSignalUserId) {
        const playerId = data.oneSignalUserId;
        const greeting = getGreeting();
        
        logDebug('debugInfo', 'ID: ' + playerId + ' (Subscribed: ' + data.oneSignalSubscribed + ')');
        
        window.dispatchEvent(new CustomEvent('medianAppOpened', { 
            detail: { playerId, greeting } 
        }));
    } else {
        logDebug('debugInfo', 'ID: Not Subscribed or missing in callback');
        console.warn("[NativeBridge] No oneSignalUserId in data!");
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

    if (median.isNativeApp() && median.onesignal && median.onesignal.setExternalUserId) {
        console.log(`[NativeBridge] Syncing user ${userId} with OneSignal via Median NPM.`);
        median.onesignal.setExternalUserId({ externalUserId: String(userId) });
    } else {
        console.log(`[NativeBridge] Ignored syncUserWithOneSignal(${userId}) - Not running in Median Wrapper.`);
    }
};
