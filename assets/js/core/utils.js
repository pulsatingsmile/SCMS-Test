export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export function getPageName() {
    return document.body.getAttribute('data-page-name') || '';
}