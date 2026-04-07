/**
 * api.js - Shared API helper for redesigned pages
 * Connects to Express API on Render (which proxies to PocketBase)
 */

const RENDER_URL = 'https://intergenapp.onrender.com';
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = IS_LOCAL ? '' : RENDER_URL;
const PB_PROXY = `${API_BASE}/api/pb`;

const api = {

  // ============================================================
  // Students
  // ============================================================

  async getStudents() {
    try {
      const res = await fetch(`${API_BASE}/api/students`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[api] getStudents failed:', err);
      return null;
    }
  },

  // ============================================================
  // PocketBase Generic CRUD via proxy
  // ============================================================

  async getRecords(collection, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${PB_PROXY}/${collection}/records${query ? '?' + query : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.items || data || [];
    } catch (err) {
      console.error(`[api] getRecords(${collection}) failed:`, err);
      return [];
    }
  },

  async createRecord(collection, body) {
    try {
      const res = await fetch(`${PB_PROXY}/${collection}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`[api] createRecord(${collection}) failed:`, err);
      throw err;
    }
  },

  // ============================================================
  // Signintree
  // ============================================================

  async getCheckins(weekend) {
    const params = { sort: '-created' };
    if (weekend) params.filter = `weekend = "${weekend}"`;
    return this.getRecords('signintree', params);
  },

  async checkin(name, group, weekend) {
    // Check duplicate
    const existing = await this.getRecords('signintree', {
      filter: `Name = "${name}" && weekend = "${weekend}"`,
    });
    if (existing.length > 0) {
      throw new Error('DUPLICATE');
    }
    return this.createRecord('signintree', {
      Name: name, group, weekend, checkinstatus: 'Yes',
    });
  },

  // ============================================================
  // Emotion Temperature
  // ============================================================

  async getMoods(weekend) {
    const params = { sort: '-created' };
    if (weekend) params.filter = `weekend = "${weekend}"`;
    return this.getRecords('emotion_temperature', params);
  },

  async voteMood(name, group, weekend, emotional) {
    const existing = await this.getRecords('emotion_temperature', {
      filter: `Name = "${name}" && weekend = "${weekend}"`,
    });
    if (existing.length > 0) {
      throw new Error('DUPLICATE');
    }
    return this.createRecord('emotion_temperature', {
      Name: name, group, weekend, emotional,
    });
  },

  // ============================================================
  // File URL helper
  // ============================================================

  fileUrl(collectionId, recordId, filename) {
    if (!filename) return null;
    return `${API_BASE}/api/files/${collectionId}/${recordId}/${filename}`;
  },

  // ============================================================
  // Utility
  // ============================================================

  /** Group students by their group number */
  groupStudents(students) {
    const groups = {};
    students.forEach(s => {
      const g = s.group || s.Group || '1';
      if (!groups[g]) groups[g] = [];
      groups[g].push(s);
    });
    return groups;
  },
};

// ============================================================
// Toast helper
// ============================================================

function showToast(message, type = 'success', duration = 2000) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
  }

  const iconMap = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };

  toast.querySelector('.toast-icon').innerHTML = iconMap[type] || iconMap.success;
  toast.querySelector('.toast-msg').textContent = message;
  toast.className = `toast toast-${type} show`;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}
