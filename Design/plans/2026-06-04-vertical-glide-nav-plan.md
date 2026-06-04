# Vertical Glide Page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a SPA-Lite navigation system with Vertical Glide transitions.

**Architecture:** Intercept link clicks in `site.js`, fetch content via `fetch()`, and choreograph a "Slide Out -> Swap -> Slide In" sequence using CSS classes and `history.pushState`.

**Tech Stack:** Vanilla JS, CSS3 Transitions, Fetch API.

---

### Task 1: Transition Styles and Base State

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add transition classes for page content**
Add the following to `styles.css` to handle the content exit and entry states.

```css
/* Page Transition Classes */
main {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

/* Exit State: Slide up and fade out */
.page-exit {
  opacity: 0;
  transform: translateY(-20px);
}

/* Enter State: Start from below and transparent */
.page-enter-start {
  opacity: 0;
  transform: translateY(20px);
}
```

- [ ] **Step 2: Commit base styles**

```bash
git add styles.css
git commit -m "style: add page transition classes and keyframes"
```

---

### Task 2: SPA-Lite Navigation Hijacking

**Files:**
- Modify: `site.js`

- [ ] **Step 1: Implement the `navigate` function**
Add a robust `navigate` function to `site.js` that handles fetching, transition choreography, and history updates.

```javascript
  // --- SPA-Lite Navigation ---
  function navigate(url, addHistory = true) {
    var main = document.querySelector('main');
    if (!main) return;

    // Phase 1: Exit current content
    main.classList.add('page-exit');

    // Wait for exit transition (300ms)
    setTimeout(function() {
      fetch(url)
        .then(function(response) { return response.text(); })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var newMain = doc.querySelector('main');
          var newTitle = doc.querySelector('title');

          if (newMain) {
            // Update Title
            if (newTitle) document.title = newTitle.textContent;
            
            // Swap Content
            main.innerHTML = newMain.innerHTML;
            
            // Update History
            if (addHistory) history.pushState({ url: url }, '', url);

            // Phase 2: Prepare entry state
            main.classList.remove('page-exit');
            main.classList.add('page-enter-start');
            
            // Scroll to top
            window.scrollTo(0, 0);

            // Phase 3: Trigger entry transition
            requestAnimationFrame(function() {
              main.classList.remove('page-enter-start');
              
              // RE-INITIALIZE PAGE SCRIPTS
              // This is crucial for pages like groups.html which have their own scripts
              var scripts = newMain.querySelectorAll('script');
              scripts.forEach(function(oldScript) {
                var newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(function(attr) {
                  newScript.setAttribute(attr.name, attr.value);
                });
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
              });
              
              // Refresh Nav Indicator (from site.js closure)
              if (typeof updateNavIndicator === 'function') updateNavIndicator(url);
            });
          }
        })
        .catch(function() {
          // Fallback to standard navigation on error
          window.location.href = url;
        });
    }, 300);
  }
```

- [ ] **Step 2: Intercept link clicks**
Update the event listener in `site.js` to catch all internal navigation.

```javascript
  // Handle Link Interception
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var url = link.getAttribute('href');
    
    // Only intercept internal links that don't have target="_blank"
    // and aren't special clicks (cmd/ctrl)
    if (url && 
        !url.startsWith('http') && 
        !url.startsWith('#') && 
        link.target !== '_blank' &&
        !e.metaKey && !e.ctrlKey) {
      
      e.preventDefault();
      navigate(url);
    }
  });

  // Handle Back/Forward buttons
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.url) {
      navigate(e.state.url, false);
    } else {
      // Fallback for initial load
      navigate(location.pathname, false);
    }
  });
```

- [ ] **Step 3: Refactor nav indicator to be reusable**
Ensure `updateNavIndicator` is accessible to the `navigate` function.

- [ ] **Step 4: Commit navigation logic**

```bash
git add site.js
git commit -m "feat: implement SPA-Lite navigation with vertical glide"
```

---

### Task 3: Manual Verification and Edge Cases

- [ ] **Step 1: Verify Groups page re-initialization**
Navigate from Home to Groups. Ensure the case-study switcher still works.

- [ ] **Step 2: Verify Back/Forward buttons**
Click around, then use browser back/forward buttons. Ensure transitions trigger and content updates.

- [ ] **Step 3: Verify scroll reset**
Scroll down on one page, navigate to another. Ensure the new page starts at the top.
