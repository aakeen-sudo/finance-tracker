import { state } from './state.js';
import { highlight, escapeHTML } from './search.js';
import { getTotal, getTopCategory, getLastSevenDays, getCapInfo, getCapMessage } from './stats.js';

export const $ = (id) => document.getElementById(id);

export function renderRecords(list, re) {
    const body = $('records-body');
    body.innerHTML = ';
    $('empty-message').hidden = list.length > 0;
    for (const r of list) {
        const row = document.createElement('tr');
        row.dataset.id = r.id;
        row.innerHTML =
        '<td>' + highlight(r.date, re) + '</td>' +
        '<td>' + highlight(r.description, re) + '</td>' +
        '<td>' + highlight(r.category, re) + '</td>' +
        '<td>' + highlight(r.amount.toFixed(2), re) + ' ' + escapeHTML(r.currency || state.settings.base) + '</td>' +
        '<td><button type="button" class="edit">Edit</button> <button type="button" class="delete">Delete</button></td>';
        row.querySelector('.edit').setAttribute('aria-label', 'Edit ' + r.description);
        row.querySelector('.delete').setAttribute('aria-label', 'Delete ' + r.description);
        body.appendChild(row);
    }
}

export function renderStats() {
    const records = state.records;
    const base = state.settings.base;
    const total = getTotal(records);
    $('stat-count').textContent = records.length;
    $('stat-total').textContent = total.toFixed(2) + ' ' + base;
    $('stat-top').textContent = getTopCategory(records);

    const days = getLastSevenDays(records);
    const max = Math.max(...days.map((d) => d.total), 1);
    const chart = $('chart');
    chart.innerHTML = ';
    for (const day of days) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.title = day.key + ': ' + day.total.toFixed(2);
        bar.style.height = '0';
        chart.appendChild(bar);
        setTimeout(() => { bar.style.height = (day.total / max) * 100 + '%'; }, 50);
    }
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', 'Last 7 days: ' + days.map((d) => d.key + ' ' + d.total.toFixed(2)).join(', '));

    const info = getCapInfo(total, state.settings.cap);
    const message = $('cap-message');
    message.setAttribute('aria-live', info.over > 0 ? 'assertive' : 'polite');
    message.classList.toggle('over', info.over > 0);
    message.textContent = getCapMessage(info, base);
}

export function fillCurrencySelect() {
    const select = $('currency');
    const codes = [state.settings.base, ...state.settings.others.map((c) => c.code)];
    select.innerHTML = ';
    for (const code of codes) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = code;
        select.appendChild(option);
    }
}

export function showError(field, message) {
    $(field + '-error').textContent = message;
}