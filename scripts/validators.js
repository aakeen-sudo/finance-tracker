export const patterns = {
  noEdgeSpaces: /^\S(?:.*\S)?$/,
  doubleSpaces: / {2,}/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i,
  currency: /^[A-Z]{3}$/
};

export function checkDescription(text) {
  if (text === '') return 'Please enter a description.';
  if (!patterns.noEdgeSpaces.test(text)) return 'Remove the spaces at the start or end.';
  if (patterns.doubleSpaces.test(text)) return 'Use only one space between words.';
  if (patterns.duplicateWord.test(text)) return 'You typed the same word twice in a row.';
  return '';
}

export function checkAmount(text) {
  if (text === '') return 'Please enter an amount.';
  if (!patterns.amount.test(text)) return 'Use a number like 12 or 12.50.';
  return '';
}

export function checkCategory(text) {
  if (text === '') return 'Please enter a category.';
  if (!patterns.category.test(text)) return 'Use letters, spaces and hyphens only.';
  return '';
}

export function checkDate(text) {
  if (text === '') return 'Please enter a date.';
  if (!patterns.date.test(text)) return 'Use the format YYYY-MM-DD.';
  return '';
}

const ratePattern = /^(?!0+(\.0+)?$)\d+(\.\d{1,6})?$/;

export function checkCurrency(text) {
  if (!patterns.currency.test(text)) return 'Use 3 capital letters, like USD.';
  return '';
}

export function checkRate(text) {
  if (!ratePattern.test(text)) return 'Use a number above 0, like 1450 or 0.0007.';
  return '';
}

export function checkCap(text) {
  if (text === '') return '';
  if (!patterns.amount.test(text)) return 'Use a number like 300, or leave it empty.';
  return '';
}

export function checkImport(data) {
  if (!Array.isArray(data)) return 'The file must contain a list of records.';
  for (const item of data) {
    if (!item || typeof item.id !== 'string') return 'Every record needs an id.';
    if (typeof item.amount !== 'number' || item.amount < 0) return 'Record ' + item.id + ' needs an amount of 0 or more.';
    const description = String(item.description ?? '');
    const category = String(item.category ?? '');
    const date = String(item.date ?? '');
    if (checkDescription(description) || checkCategory(category) || checkDate(date)) {
      return 'Record ' + item.id + ' has a wrong description, category or date.';
    }
  }
  return '';
}