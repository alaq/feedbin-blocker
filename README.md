# feedbin-blocker

## What it does

This Firefox extension uses the proxy API listener `onRequest` to listen for requests to visits to feedbin.com, and blocks it if there is less than a set number of unread entries. This prevents me from going to Feedbin repeateadly while doing other things. Only to find <10 unread entries. The number of entries can be changed through the extension's option page.

To try out this extension:
* install it
* visit `feedbin.com` and see it is blocked
