// Initialize the list of blocked hosts
let blockedHosts = ["https://feedbin.com/", "https://www.feedbin.com/"];
let minimumUnreadEntries = 250;
let username = null;
let password = null;

// Set the default list on installation.
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        minimumUnreadEntries,
    });
});

// Get the stored settings
chrome.storage.local.get((data) => {
    if (data.minimumUnreadEntries) {
        minimumUnreadEntries = data.minimumUnreadEntries;
    }
    if (data.username) {
        username = data.username;
    }
    if (data.password) {
        password = data.password;
    }
});

// Listen for changes in the number of entries
chrome.storage.onChanged.addListener((changeData) => {
    if (changeData?.minimumUnreadEntries?.newValue) {
        minimumUnreadEntries = changeData.minimumUnreadEntries.newValue;
    }
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
        if (username && password) {
            return getNumberOfUnreadEntries(username, password).then((current) => {
                if (current < minimumUnreadEntries) {
                    chrome.tabs.update(requestDetails.tabId, {
                        url: "/splash/index.html",
                    });
                }
            });
        } else {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "../icons/block.svg",
                title: "Feedbin Blocker",
                message: "You need to add your Feedbin credentials in the options, in order to block Feedbin.",
            });
        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(logURL, { urls: ["*://feedbin.com/*", "*://www.feedbin.com/*"] }, [
    "blocking",
]);
