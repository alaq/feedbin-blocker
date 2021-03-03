// Initialize the list of blocked hosts
let blockedHosts = ["https://feedbin.com/", "https://www.feedbin.com/"];
let minimumUnreadEntries = 250;
let user = "";
let password = "";

// Set the default list on installation.
browser.runtime.onInstalled.addListener((details) => {
    browser.storage.local.set({
        minimumUnreadEntries,
    });
});

// Get the stored list
browser.storage.local.get((data) => {
    if (data.minimumUnreadEntries) {
        minimumUnreadEntries = data.minimumUnreadEntries;
    }
});

// Listen for changes in the number of entries
browser.storage.onChanged.addListener((changeData) => {
    minimumUnreadEntries = changeData.minimumUnreadEntries.newValue;
});

function getNumberOfUnreadEntries(login, password) {
    return fetch("https://api.feedbin.com/v2/unread_entries.json", {
        headers: new Headers({
            Authorization: `Basic ${btoa(`${login}:${password}`)}`,
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then((r) => {
            return r.length;
        })
        .catch(console.error);
}

function logURL(requestDetails) {
    if (blockedHosts.includes(requestDetails.url)) {
        console.log("url", requestDetails.url);
        return getNumberOfUnreadEntries(username, password).then((current) => {
            if (current < minimumUnreadEntries) {
              console.log(`Only ${current} unread entries, blocking`)
              return {
                redirectUrl: "https://duckduckgo.com"
              }
            }
        });
    }
}

browser.webRequest.onBeforeRequest.addListener(logURL, { urls: ["<all_urls>"] }, ["blocking"]);
