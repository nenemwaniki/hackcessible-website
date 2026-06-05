# Design Spec: Liquid Smooth Case Study Transitions
**Date:** 2026-06-04
**Topic:** Interactivity Improvements
**Status:** Implemented

## Overview
The goal is to improve the perceived quality and smoothness of the case-study switcher on the `groups.html` page. Currently, the content swaps instantly via `innerHTML`, which feels "rough" and jarring. We will implement a "Liquid Smooth" transition system that uses CSS animations and a choreographed JavaScript sequence to glide content into place.

## Goals
- Eliminate the jarring "jump" when switching case studies.
- Provide clear visual feedback that a state change is occurring.
- Enhance the "premium" feel of the website through subtle micro-interactions (staggered entry).
- Maintain layout stability to prevent the footer from jumping.

## Architecture & Implementation

### 1. Transition Logic (JavaScript)
We will modify the `render(key)` function in `groups.html` to follow a multi-phase sequence:
1.  **Phase 1 (Fade Out):** Add an `.is-switching` class to the `.case` container.
2.  **Wait:** Allow the fade-out/slide-down animation to complete (approx. 150ms).
3.  **Phase 2 (Update):** Update the `innerHTML` and text content while the container is transparent.
4.  **Phase 4 (Fade In):** Remove the `.is-switching` class to trigger the fade-in/slide-up animation.

### 2. CSS Animation (styles.css)
New styles will be added to handle the state transitions:
-   `.case`: Initial state with `opacity: 1` and `transform: translateY(0)`.
-   `.case.is-switching`: Target state with `opacity: 0` and `transform: translateY(10px)`.
-   `transition`: Apply to `opacity` and `transform` with a `cubic-bezier` for smoothness (e.g., `0.4, 0, 0.2, 1`).

### 3. Staggered Entry
To make the content "glide" in, individual `.case-block` elements will have staggered entrance delays:
-   Each `.case-block` will have a `transition` property.
-   CSS nth-child selectors will apply increasing `transition-delay` (50ms, 100ms, 150ms).

### 4. Layout Stability
-   Set a `min-height` on the `.case-right` (or the `.case` container) to match the height of the largest content set (Sawa), preventing the page footer from shifting during the swap.

## Testing & Success Criteria
-   Switching between "TimeKeeper" and "Sawa" should look intentional and smooth.
-   No content should overlap during the transition.
-   The page footer should remain stationary during the switch.
-   `prefers-reduced-motion` should be respected by disabling the `transform` slides if the user prefers no motion.

## Future Considerations
-   Implementing a "Sliding Pill" background for the `.case-tab` buttons (Phase 2).
