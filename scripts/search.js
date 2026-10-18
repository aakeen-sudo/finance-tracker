export function compileRegex(input, caseSensitive) {
    if (input === ') return null;
        try {
            return new RegExp(input, caseSensitive ? ' : 'i');
            } catch {
                return null;
            }
        }

        export function escapeHTML(text) {
            return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        export function highlight(text, re) {
            const safe = escapeHTML(text);
            if (!re) return safe;
            const allMatches = new RegExp(re.source, re.flags + 'g');
            return safe.replace(allMatches, (match) => '<mark>' + match + '</mark>');
        }

        export function filterRecords(records, re) {
            if (!re) return records;
            return records.filter((r) =>
                re.test(r.description) || re.test(r.category) || re.test(r.date) || re.test(String(r.amount))
        );
    }

    export function sortRecords(records, sortBy) {
        const list = [...records];
        if (sortBy === 'date-asc') list.sort((a, b) => a.date.localeCompare(b.date));
        if (sortBy === 'date-desc') list.sort((a, b) => b.date.localeCompare(a.date));
        if (sortBy === 'desc-asc') list.sort((a, b) => a.description.localeCompare(b.description));
        if (sortBy === 'desc-desc') list.sort((a, b) => b.description.localeCompare(a.description));
        if (sortBy === 'amount-asc') list.sort((a, b) => a.amount - b.amount);
        if (sortBy === 'amount-desc') list.sort((a, b) => b.amount - a.amount);
        return list;
    }