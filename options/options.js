const minimumUnreadEntries = document.querySelector("#unread-entries");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
  browser.storage.local.set({
    minimumUnreadEntries: minimumUnreadEntries.value
  });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
  minimumUnreadEntries.value = restoredSettings.minimumUnreadEntries;
}

function onError(e) {
  console.log("error")
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError).catch(console.error);

// Whenever the contents of the textarea changes, save the new values
minimumUnreadEntries.addEventListener("change", storeSettings);
