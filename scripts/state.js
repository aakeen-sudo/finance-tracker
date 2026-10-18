import { loadRecords, saveRecords, loadSettings, saveSettings } from './storage.js';

const defaultsettings = {
    base: 'RWF',
    others: [
        { code: 'USD', rate: 1450 },
        { code: 'EUR', rate: 1700 }
    ],
    cap: 0
};

export const state = {
    records: loadRecords(),
    settings: loadSettings() || defaultsettings
};

export function convertToBase(amount, code) {
    const other = state.settings.others.find((c) => c.code === code);
    return other ? amount * other.rate : amount;
}

export function addRecord(fields) {
    const now = new Date().toISOString();
    state.records.push({ id: 'txn_' + Date.now(), ...fields, createdAt: now, updatedAt: now });
        saveRecords(state.records);
 }

 export function updateRecord(id, fields) {
    const record = state.records.find((r) => r.id === id);
    if (!record) return;
    Object.assign(record, fields, {updatedAt: new Date().toISOString() });
    saveRecords(state.records);
 }

 export function deleteRecord(id) {
    state.records = state.records.filter((r) => r.id !== id);
    saveRecords(state.records);
 }

 export function replaceRecords(records) {
    state.records = records;
    saveRecords(state.records);
 }

 export function updateSettings(settings) {
    state.settings = settings;
    saveSettings(settings);
 }
