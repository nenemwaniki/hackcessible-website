# Harden SPA-Lite Navigation and Fix Page Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the SPA-Lite navigation in `site.js` with guards, improved error handling, and hash support, and move page-specific scripts inside the `<main>` tag to ensure they re-initialize on navigation.

**Architecture:**
- Update `site.js` to include a navigation lock (`isNavigating`), current URL check, and `response.ok` check.
- Modify `groups.html`, `people.html`, and `contact.html` to move their `<script>` blocks inside the `<main>` element.
- Update scroll logic to respect URL hashes.

**Tech Stack:** Vanilla JavaScript, HTML5.

---

### Task 1: Harden site.js Navigation Logic

**Files:**
- Modify: `site.js`

- [ ] **Step 1: Add navigation guards and "is-navigating" lock.**
Add `isNavigating` flag and check at the start of `navigate`.

```javascript
  // --- SPA-Lite Navigation ---
  var main = document.querySelector('main') || document.body;
  var isNavigating = false;

  function navigate(url, addHistory) {
    if (isNavigating || url === location.pathname) return;
    if (addHistory === undefined) addHistory = true;
    
    isNavigating = true;
    // ...
```

- [ ] **Step 2: Add fetch error handling and response check.**
Check `response.ok` and fallback to `window.location.href`.

```javascript
      fetch(url)
        .then(function(response) { 
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text(); 
        })
        // ...
        .catch(function(err) {
          console.error('Navigation failed:', err);
          isNavigating = false;
          window.location.href = url; // Fallback
        });
```

- [ ] **Step 3: Improve scroll logic for hash support.**
Only scroll to top if there is no hash in the URL.

```javascript
          if (addHistory) {
            history.pushState({ url: url }, '', url);
          }

          if (url.indexOf('#') === -1) {
            window.scrollTo(0, 0);
          }

          isNavigating = false;
```

- [ ] **Step 4: Commit site.js changes.**
```bash
git add site.js
git commit -m "feat: harden navigation logic with guards and hash support"
```

### Task 2: Move Page Scripts inside <main>

**Files:**
- Modify: `groups.html`
- Modify: `people.html`
- Modify: `contact.html`

- [ ] **Step 1: Update groups.html.**
Move the script block from the bottom into the end of `<main id="main">`.

- [ ] **Step 2: Update people.html.**
Move the script block from the bottom into the end of `<main id="main">`.

- [ ] **Step 3: Update contact.html.**
Move the script block (including `hkSubmit` function) from the bottom into the end of `<main id="main">`.

- [ ] **Step 4: Commit HTML changes.**
```bash
git add groups.html people.html contact.html
git commit -m "fix: move page-specific scripts inside <main> for SPA re-initialization"
```

### Task 3: Verification

- [ ] **Step 1: Verify navigation between pages.**
Ensure the transition works and the page content updates.
- [ ] **Step 2: Verify page scripts re-initialize.**
Ensure the "Groups" switcher on `groups.html` works after navigating to it from another page.
Ensure the "People" carousel on `people.html` works after navigating to it.
Ensure the "Contact" switcher on `contact.html` works after navigating to it.
- [ ] **Step 3: Verify hash navigation.**
Navigate to `groups.html#sawa` and ensure it scrolls (or handles) the hash correctly.
