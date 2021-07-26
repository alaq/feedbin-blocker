# feedbin-blocker

## What it does

This Firefox extension API listener `onBeforeRequest` to listen for requests to feedbin.com, and blocks it if there is less than a set number of unread entries. This prevents me from going to Feedbin repeateadly while doing other things. Only to find <10 unread entries. The default number of entries is 250 and can be changed through the extension's option page.

## Install

-   [Chrome Web Store](https://chrome.google.com/webstore/detail/feedbin-blocker/ijofeglkmagknhkanacjbdegkopabcjm)
-   [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/feedbin-blocker/)

## Install from source

-   Clone or download this repository
-   Go to about:debugging
-   Click on `This Firefox`
-   Click on `Load Temporary Add-on...`
-   Load the extension's preferences and input your login and password
-   Try to visit `feedbin.com`
