# Design Spec: Vertical Glide Page Transitions (SPA-Lite)
**Date:** 2026-06-04
**Topic:** Interactivity / Navigation Improvements
**Status:** Implemented

## Overview
To achieve a "premium" app-like feel, we will implement a "SPA-Lite" (Single Page Application Lite) navigation system. Instead of full browser reloads when clicking nav links, we will intercept the clicks, fetch the target page content via JavaScript, and transition the `<main>` content area using a **Vertical Glide** animation. The navigation bar will remain static and persistent throughout the session.

## Goals
- Eliminate the jarring "white flash" and "hopping" between pages.
- Keep the "Liquid Glass" navigation bar and footer perfectly stable.
- Implement the **Vertical Glide** motion (fade + slide up) for content entry.
- Maintain full browser history support (Back/Forward buttons).
- Ensure SEO and standard link behavior (Ctrl+Click, right-click) are preserved.

## Architecture & Implementation

### 1. Navigation Hijacking (`site.js`)
We will add a global event listener for all internal link clicks.
- **Intercept:** Check if the link is internal and not a "special" click (e.g., Command/Ctrl held).
- **Fetch:** Use the `fetch()` API to retrieve the HTML of the target page.
- **Parse:** Convert the raw HTML string into a DOM tree to extract the `<main>` content and the `<title>`.

### 2. Transition Sequence
The transition will follow a choreographed multi-phase sequence:
1. **Phase 1 (Exit):** Current `<main>` content fades out and slides up (-20px).
2. **Phase 2 (Swap):** Once the exit animation completes (~250ms), the new content is injected into `<main>`.
3. **Phase 3 (Enter):** New content starts from `opacity: 0` and `translateY(20px)` and glides into its final position.
4. **Cleanup:** Update the `document.title` and sync the navigation indicator.

### 3. CSS Motion (`styles.css`)
We will define keyframes and classes for the transitions:
- `.page-transitioning`: A global class applied to `<body>` during the swap.
- `@keyframes pageExit`: Fade out + slide up.
- `@keyframes pageEnter`: Fade in + slide up from below.

### 4. History Management
- Use `history.pushState()` to update the URL without a reload.
- Listen to the `popstate` event to handle the browser's Back and Forward buttons using the same transition logic.

## Testing & Success Criteria
- Navigation between all 5 pages (Home, Model, Groups, People, Contact) should be fluid.
- The scroll position should reset to the top on every new page load.
- Back and Forward buttons must trigger the transitions correctly.
- If a fetch fails (e.g., offline), the system should fallback to a standard `window.location` change.

## Potential Constraints
- **Script Re-execution:** Any scripts inside the fetched `<main>` content might need manual re-initialization (e.g., the groups switcher logic).
- **External Links:** Must be ignored by the transition system.
