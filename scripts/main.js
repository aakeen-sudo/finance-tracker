import { state, addRecord, updateRecord, deleteRecord, replaceRecords, updateSettings } from './state.js';
import { compileRegex, filterRecords, sortRecords } from './search.js';
import { checkDescription, checkAmount, checkCategory, checkDate, checkCurrency, checkRate, checkCap, checkImport } from './validators.js';
import { $, renderRecords, renderStats, fillCurrencySelect, showError } from './ui.js';

const checks = {
  description: checkDescription,
  amount: checkAmount,
  category: checkCategory,
  date: checkDate
};

function refresh() {
  const pattern = $('search-input').value;
  const re = compileRegex(pattern, $('case-toggle').checked);
  $('search-error').textContent = pattern !== '' && re === null ? 'That pattern is not valid regex.' : '';
  const list = sortRecords(filterRecords(state.records, re), $('sort-select').value);
  renderRecords(list, re);
  renderStats();
}

function resetForm() {
  $('record-form').reset();
  $('record-id').value = '';
  $('form-title').textContent = 'Add a record';
  for (const field in checks) showError(field, '');
}
function resetForm() {


  $(field).addEventListener('input', () => showError(field, checks[field]($(field).value)));
}

$('record-form').addEventListener('submit', (event) => {
  event.preventDefault();
  let ok = true;
  for (const field in checks) {
    const message = checks[field]($(field).value);
    showError(field, message);
    if (message) ok = false;
  }
  if (!ok) {
    $('form-status').textContent = 'Please fix the errors above.';
    return;
  }
  const fields = {
    description: $('description').value,
    amount: Number($('amount').value),
    currency: $('currency').value,
    category: $('category').value,
    date: $('date').value
  };
  const id = $('record-id').value;
  if (id) updateRecord(id, fields);
  else addRecord(fields);
  resetForm();
  $('form-status').textContent = id ? 'Record updated.' : 'Record saved.';
  refresh();
});

$('cancel-button').addEventListener('click', () => {
  resetForm();
  $('form-status').textContent = '';
});


$('records-body').addEventListener('click', (event) => {
  const row = event.target.closest('tr');
  if (!row) return;
  const record = state.records.find((r) => r.id === row.dataset.id);
  if (!record) return;
  if (event.target.classList.contains('delete')) {
    // ask before deleting
    if (confirm('Delete "' + record.description + '"?')) {
      deleteRecord(record.id);
      refresh();
    }
  }
  if (event.target.classList.contains('edit')) {

    $('record-id').value = record.id;
    $('description').value = record.description;
    $('amount').value = record.amount;
    $('currency').value = record.currency || state.settings.base;
    $('category').value = record.category;
    $('date').value = record.date;
    $('form-title').textContent = 'Edit record';
    location.hash = 'view-form';
    $('description').focus();
  }
});


for (const id of ['search-input', 'case-toggle', 'sort-select']) {
  $(id).addEventListener('input', refresh);
}

function fillSettingsForm() {
  const s = state.settings;
  $('base-code').value = s.base;
  $('other1-code').value = s.others[0].code;
  $('other1-rate').value = s.others[0].rate;
  $('other2-code').value = s.others[1].code;
  $('other2-rate').value = s.others[1].rate;
  $('cap').value = s.cap || '';
}

const code = (id) => $(id).value.trim().toUpperCase();


$('settings-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const errors = {
    base: checkCurrency(code('base-code')),
    other1: checkCurrency(code('other1-code')) || checkRate($('other1-rate').value),
    other2: checkCurrency(code('other2-code')) || checkRate($('other2-rate').value),
    cap: checkCap($('cap').value)
  };
  let ok = true;
  for (const field in errors) {
    showError(field, errors[field]);
    if (errors[field]) ok = false;
  }
  if (!ok) return;
  updateSettings({
    base: code('base-code'),
    others: [
      { code: code('other1-code'), rate: Number($('other1-rate').value) },
      { code: code('other2-code'), rate: Number($('other2-rate').value) }
    ],
    cap: Number($('cap').value) || 0
  });
  fillCurrencySelect();
  $('settings-status').textContent = 'Settings saved.';
  refresh();
});

function loadData(data) {
  const problem = checkImport(data);
  if (problem) {
    $('data-status').textContent = 'Import failed: ' + problem;
    return;
  }
  replaceRecords(data);
  $('data-status').textContent = 'Loaded ' + data.length + ' records.';
  refresh();
}


$('export-button').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state.records, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'finance-records.json';
  link.click();
  $('data-status').textContent = 'Records exported.';
});


$('import-file').addEventListener('change', async () => {
  const file = $('import-file').files[0];
  if (!file) return;
  try {
    loadData(JSON.parse(await file.text()));
  } catch {
    $('data-status').textContent = 'Import failed: the file is not valid JSON.';
  }
  $('import-file').value = '';
});


$('seed-button').addEventListener('click', async () => {
  try {
    const response = await fetch('seed.json');
    loadData(await response.json());
  } catch {
    $('data-status').textContent = 'Could not load the sample data.';
  }
});


fillCurrencySelect();
fillSettingsForm();
refresh();