---
name: External citation validation
description: How to validate LEGACY source links after a domain or routing change.
---

Validate LEGACY citations against the rendered author and work rather than treating HTTP 200 as proof that the destination is correct.

**Why:** During link migration, a stale Kant record URL returned HTTP 200 but showed only a loading screen. Valid record pages displayed the intended work. Text extraction sometimes captured only the initial loading screen even for working pages.

**How to apply:** Check deep links in a browser and compare the displayed title with the citation. Use public Library destinations for source citations; contribution routes can redirect unsigned visitors to sign-in.
