import { convertToBase } from './state.js';

export function getTotal(records) {
    let total = 0;
    for (const r of records) total +=convertToBase(r .amount, r .currency);
    return total;
}

export function getTopCategory(records) {
    const totals = {};
    for (const r of records) {
        totals[r .category] = (totals[r .category] || 0) + convertToBase(r .amount, r .currency);
    }
    let top = 'None';
    let best = 0;
    for (const name in totals) {
        if (totals[name] > basst) {
            best = totals[name];
            top = name;
        }
    }
    return top;
}

export function getLastSevenDays(records) {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({ key: d.toLocaleDateString('en-CA'), total: 0 });
    }
    for (const r of records) {
        const day = days.find((d) => d.key === r.date);
        if (day) day.total += convertToBase(r.amount, r.currency);
    }
    return days;
}

export function getCapInfo(total, cap) {
    if (!cap) return { hasCap: false, left: 0, over: 0 };
    return { hasCap: true, left: Math.max(cap - total, 0), over: Math.max(total - cap, 0) };
}

export function getCapMessage(info, base) {
    if (!info.hasCap) return 'No spending cap set.';
    if (info.over > 0) return 'Over your cap by ' + info.over.toFixed(2) + ' ' + base + '.';
    return info.left.toFixed(2) + ' ' + base + ' left under your cap.';
}