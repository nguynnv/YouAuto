// ==UserScript==
// @name         YouTube Auto Skip Button
// @namespace    local.youtube.autoclick
// @version      1.0.0
// @description  Automatically clicks the "Skip Ad" button on YouTube videos when it appears.
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==


(function () {
    'use strict';


    const SKIP_SELECTORS = [
        '.ytp-skip-ad-button',
        '.ytp-ad-skip-button',
        '.ytp-ad-skip-button-modern',
        '.ytp-ad-skip-button-container button',
        '.ytp-ad-skip-button-container .ytp-ad-skip-button',
    ];

    function isVisible(el) {
        if (!el) return false;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
        }
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function trySkip() {
        for (const sel of SKIP_SELECTORS) {
            const btn = document.querySelector(sel);
            if (btn && isVisible(btn) && !btn.disabled) {
                btn.click();
                return true;
            }
        }
        return false;
    }

    let scheduled = false;
    function scheduleCheck() {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
        scheduled = false;
        trySkip();
        }, 150);
    }

    const observer = new MutationObserver(scheduleCheck);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden'],
    });



    setInterval(trySkip, 500);
})();