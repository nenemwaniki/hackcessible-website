# Liquid Smooth Case Study Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement smooth, staggered transitions for the case-study switcher in `groups.html`.

**Architecture:** Use CSS transitions triggered by a JavaScript class toggle. Orchestrate a "fade-out -> update -> fade-in" sequence using `setTimeout` to match CSS duration.

**Tech Stack:** Vanilla JS, CSS3 Transitions.

---

### Task 1: CSS Transitions and Staggered Entry

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add transition states to the case container**
Add the following styles to `styles.css` near the `.case` definition:

```css
.case {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
  will-change: opacity, transform;
}

.case.is-switching {
  opacity: 0;
  transform: translateY(10px);
}
```

- [ ] **Step 2: Add staggered entry for case blocks**
Add the following to `styles.css`:

```css
.case-block {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
}

.is-switching .case-block {
  opacity: 0;
  transform: translateY(15px);
  transition: none; /* Instant reset when switching out */
}

/* Stagger delays */
.case-block:nth-child(1) { transition-delay: 0.05s; }
.case-block:nth-child(2) { transition-delay: 0.1s; }
.case-block:nth-child(3) { transition-delay: 0.15s; }
.case-block:nth-child(4) { transition-delay: 0.2s; }
```

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "style: add transition states and staggered delays for case studies"
```

---

### Task 2: Layout Stability (Min-Height)

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Set min-height to prevent layout jump**
Identify the container height needed (approx 600px based on Sawa content) and apply it to `.case-right`.

```css
.case-right {
  display: grid;
  gap: 14px;
  min-height: 520px; /* Prevents footer jump */
}
```

- [ ] **Step 2: Add prefers-reduced-motion support**
Ensure accessibility standards are met.

```css
@media (prefers-reduced-motion: reduce) {
  .case, .case-block {
    transition: opacity 0.25s ease !important;
    transform: none !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "style: add min-height for stability and reduced-motion support"
```

---

### Task 3: Choreographed JavaScript Switcher

**Files:**
- Modify: `groups.html`

- [ ] **Step 1: Update the render function to support async transitions**
Modify the `render(key)` function inside the script tag in `groups.html`.

```javascript
    var caseContainer = document.querySelector(".case");

    function render(key){
      var c = CASES[key];
      
      // Phase 1: Fade out
      caseContainer.classList.add("is-switching");

      // Phase 2: Update content after fade-out duration (250ms)
      setTimeout(function() {
        left.classList.toggle("ink", c.ink);
        label.textContent = c.label;
        name.textContent = c.name;
        blurb.textContent = c.blurb;

        var html = c.blocks.map(function(b){
          if(b.split){
            return '<article class="case-block split"><div><h4>'+esc(b.h)+'</h4><p>'+esc(b.p)+'</p></div><div class="placeholder">'+esc(b.split)+'</div></article>';
          }
          return '<article class="case-block"><h4>'+esc(b.h)+'</h4><p>'+esc(b.p)+'</p></article>';
        }).join("");
        html += '<article class="case-block"><h4>Build stack</h4><div class="tech">'+
          c.stack.map(function(t){return '<span class="tag">'+esc(t)+'</span>';}).join("")+'</div></article>';
        right.innerHTML = html;

        tabs.forEach(function(t){ t.setAttribute("aria-pressed", String(t.dataset.case===key)); });

        // Phase 3: Fade in
        // Small raf/timeout to ensure DOM is updated and transition can trigger
        requestAnimationFrame(function() {
          caseContainer.classList.remove("is-switching");
        });
      }, 250);
    }
```

- [ ] **Step 2: Manual Verification**
1. Open `groups.html` in the browser.
2. Click between "TimeKeeper" and "Sawa".
3. Observe: Content fades out, swaps, then fades in with a staggered glide.
4. Verify the footer does not jump.

- [ ] **Step 3: Commit**

```bash
git add groups.html
git commit -m "feat: implement choreographed transition logic for case studies"
```
