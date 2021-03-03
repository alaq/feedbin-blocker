// Initialize the list of blocked hosts
let blockedHosts = ["https://feedbin.com/", "https://www.feedbin.com/"];
let minimumUnreadEntries = 250;
let username = null;
let password = null;

// Set the default list on installation.
browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({
        minimumUnreadEntries,
    });
});

// Get the stored settings
browser.storage.local.get((data) => {
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
        if (username && password) {
            return getNumberOfUnreadEntries(username, password).then((current) => {
                if (current < minimumUnreadEntries) {
                    console.log(`Only ${current} unread entries, blocking`);
                    return {
                        redirectUrl: "https://duckduckgo.com",
                    };
                }
            });
        } else {
            browser.notifications.create({
                type: "basic",
                title: "Feedbin Blocker",
                message: "You need to add your Feedbin credentials in the options, in order to block Feedbin.",
            });
        }
    }
}

browser.webRequest.onBeforeRequest.addListener(logURL, { urls: ["<all_urls>"] }, ["blocking"]);
