/**
 * API helper — connects to local PocketBase
 */
import pb from './pocketbase';

// ---- Types ----

export interface Member {
  group: number;
  name: string;
  color: string;
  imageUrl?: string;
  groupImageUrl?: string;
}

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

// ---- Members (Google Sheets) ----

export async function getMembers(): Promise<Member[]> {
  try {
    const res = await fetch('/api/members');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[api] getMembers failed:', err);
    return [];
  }
}

export function groupMembers(members: Member[]): Record<number, Member[]> {
  const groups: Record<number, Member[]> = {};
  for (const m of members) {
    const g = m.group || 1;
    if (!groups[g]) groups[g] = [];
    groups[g].push(m);
  }
  return groups;
}

// ---- Students (PocketBase) ----

export async function getStudents(): Promise<Student[]> {
  try {
    const result = await pb.collection('student').getFullList<Student>();
    return result;
  } catch (err) {
    console.error('[api] getStudents failed:', err);
    return [];
  }
}

export function groupStudents(students: Student[]): Record<string, Student[]> {
  const groups: Record<string, Student[]> = {};
  for (const s of students) {
    const g = s.group || '1';
    if (!groups[g]) groups[g] = [];
    groups[g].push(s);
  }
  return groups;
}

export function getStudentName(s: Student): string {
  return s.Name || s.name || '?';
}

// ---- Checkins (PocketBase: signintree) ----

export async function getCheckins(weekend: string): Promise<CheckinRecord[]> {
  try {
    return await pb.collection('signintree').getFullList<CheckinRecord>({
      sort: '-created',
      ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
    });
  } catch (err) {
    console.error('[api] getCheckins failed:', err);
    return [];
  }
}

export async function checkin(name: string, group: string, weekend: string): Promise<CheckinRecord> {
  // Check duplicate
  const existing = await pb.collection('signintree').getFullList<CheckinRecord>({
    filter: `Name = "${name}" && weekend = "${weekend}"`,
  });
  if (existing.length > 0) throw new Error('DUPLICATE');

  return await pb.collection('signintree').create<CheckinRecord>({
    Name: name,
    group,
    weekend,
    checkinstatus: 'Yes',
  });
}

// ---- Moods (PocketBase: emotion_temperature) ----

export async function getMoods(weekend: string): Promise<MoodRecord[]> {
  try {
    return await pb.collection('emotion_temperature').getFullList<MoodRecord>({
      sort: '-created',
      ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
    });
  } catch (err) {
    console.error('[api] getMoods failed:', err);
    return [];
  }
}

export async function voteMood(name: string, group: string, weekend: string, emotional: string): Promise<MoodRecord> {
  // Check duplicate
  const existing = await pb.collection('emotion_temperature').getFullList<MoodRecord>({
    filter: `Name = "${name}" && weekend = "${weekend}"`,
  });
  if (existing.length > 0) throw new Error('DUPLICATE');

  return await pb.collection('emotion_temperature').create<MoodRecord>({
    Name: name,
    group,
    weekend,
    emotional,
  });
}
