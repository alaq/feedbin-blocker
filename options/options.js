const minimumUnreadEntries = document.querySelector("#unread-entries");
const usernameField = document.querySelector("#username");
const passwordField = document.querySelector("#password");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
    chrome.storage.local.set({
        minimumUnreadEntries: minimumUnreadEntries.value,
        username: username.value,
        password: password.value,
    });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
    minimumUnreadEntries.value = +restoredSettings.minimumUnreadEntries;
    username.value = restoredSettings.username || "";
    password.value = restoredSettings.password || "";
}

function onError(e) {
    console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
chrome.storage.local.get(null, updateUI);

// Whenever the contents of the fields changes, save the new values
minimumUnreadEntries.addEventListener("change", storeSettings);
usernameField.addEventListener("change", storeSettings);
passwordField.addEventListener("change", storeSettings);
