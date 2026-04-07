/**
 * API helper - connects to Express API on Render (proxies to PocketBase)
 */

const RENDER_URL = 'https://intergenapp.onrender.com';
const IS_SERVER = typeof window === 'undefined';
const API_BASE = IS_SERVER ? RENDER_URL : (
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? '' : RENDER_URL
);
const PB_PROXY = `${RENDER_URL}/api/pb`;

export interface Student {
  id: string;
  Name: string;
  name?: string;
  group: string;
  password: string;
  photo?: string;
  collectionId?: string;
  collectionName?: string;
}

export interface CheckinRecord {
  id: string;
  Name: string;
  group: string;
  weekend: string;
  checkinstatus: string;
  created: string;
}

export interface MoodRecord {
  id: string;
  Name: string;
  group: string;
  weekend: string;
  emotional: string;
  created: string;
}

// ---- Students ----

export async function getStudents(): Promise<Student[] | null> {
  try {
    const res = await fetch(`${RENDER_URL}/api/students`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[api] getStudents failed:', err);
    return null;
  }
}

export function groupStudents(students: Student[]): Record<string, Student[]> {
  const groups: Record<string, Student[]> = {};
  students.forEach(s => {
    const g = s.group || '1';
    if (!groups[g]) groups[g] = [];
    groups[g].push(s);
  });
  return groups;
}

export function getStudentName(s: Student): string {
  return s.Name || s.name || '?';
}

// ---- PocketBase Generic CRUD ----

async function getRecords<T = Record<string, unknown>>(collection: string, params: Record<string, string> = {}): Promise<T[]> {
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
}

async function createRecord<T = Record<string, unknown>>(collection: string, body: Record<string, unknown>): Promise<T> {
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
}

// ---- Checkin ----

export async function getCheckins(weekend: string): Promise<CheckinRecord[]> {
  return getRecords<CheckinRecord>('signintree', {
    sort: '-created',
    ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
  });
}

export async function checkin(name: string, group: string, weekend: string): Promise<CheckinRecord> {
  const existing = await getRecords<CheckinRecord>('signintree', {
    filter: `Name = "${name}" && weekend = "${weekend}"`,
  });
  if (existing.length > 0) throw new Error('DUPLICATE');
  return createRecord<CheckinRecord>('signintree', {
    Name: name, group, weekend, checkinstatus: 'Yes',
  });
}

// ---- Mood ----

export async function getMoods(weekend: string): Promise<MoodRecord[]> {
  return getRecords<MoodRecord>('emotion_temperature', {
    sort: '-created',
    ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
  });
}

export async function voteMood(name: string, group: string, weekend: string, emotional: string): Promise<MoodRecord> {
  const existing = await getRecords<MoodRecord>('emotion_temperature', {
    filter: `Name = "${name}" && weekend = "${weekend}"`,
  });
  if (existing.length > 0) throw new Error('DUPLICATE');
  return createRecord<MoodRecord>('emotion_temperature', {
    Name: name, group, weekend, emotional,
  });
}

// ---- File URL ----

export function fileUrl(collectionId: string, recordId: string, filename: string): string {
  return `${RENDER_URL}/api/files/${collectionId}/${recordId}/${filename}`;
}
