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

export interface Staff {
  id: string;
  account: string;
  password: string;
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

export interface EmotionWeather {
  id: string;
  Name: string;
  weather: string;
  emotion: string;
  time: string;
  group: string;
  weekend: string;
  created: string;
}

export interface TextMessage {
  id: string;
  Name: string;
  group: string;
  text: string;
  object: string;
  created: string;
}

export interface VoiceMessage {
  id: string;
  Name: string;
  group: string;
  voice: string;
  object: string;
  created: string;
  collectionId?: string;
}

export interface WeekendPoster {
  id: string;
  Name: string;
  group: string;
  poster: string[];
  weekend: string;
  created: string;
  updated: string;
  collectionId?: string;
}

// ---- File URL helper ----

export function getPbFileUrl(collectionId: string, recordId: string, filename: string): string {
  const base = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
  return `${base}/api/files/${collectionId}/${recordId}/${filename}`;
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

// ---- Staff (PocketBase) ----

export async function getStaff(): Promise<Staff[]> {
  try {
    return await pb.collection('staff').getFullList<Staff>();
  } catch (err) {
    console.error('[api] getStaff failed:', err);
    return [];
  }
}

export async function loginStaff(account: string, password: string): Promise<Staff | null> {
  try {
    const records = await pb.collection('staff').getFullList<Staff>({
      filter: `account = "${account}" && password = "${password}"`,
    });
    return records.length > 0 ? records[0] : null;
  } catch (err) {
    console.error('[api] loginStaff failed:', err);
    return null;
  }
}

// ---- Students (PocketBase) ----

export async function getStudents(): Promise<Student[]> {
  try {
    return await pb.collection('student').getFullList<Student>();
  } catch (err) {
    console.error('[api] getStudents failed:', err);
    return [];
  }
}

export async function loginStudent(name: string, password: string): Promise<Student | null> {
  try {
    const records = await pb.collection('student').getFullList<Student>({
      filter: `Name = "${name}" && password = "${password}"`,
    });
    return records.length > 0 ? records[0] : null;
  } catch (err) {
    console.error('[api] loginStudent failed:', err);
    return null;
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

export async function deleteCheckin(id: string): Promise<void> {
  await pb.collection('signintree').delete(id);
}

export async function deleteAllCheckins(weekend: string): Promise<number> {
  const records = await pb.collection('signintree').getFullList<CheckinRecord>({
    ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
  });
  for (const r of records) {
    await pb.collection('signintree').delete(r.id);
  }
  return records.length;
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

export async function deleteMood(id: string): Promise<void> {
  await pb.collection('emotion_temperature').delete(id);
}

export async function deleteAllMoods(weekend: string): Promise<number> {
  const records = await pb.collection('emotion_temperature').getFullList<MoodRecord>({
    ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
  });
  for (const r of records) {
    await pb.collection('emotion_temperature').delete(r.id);
  }
  return records.length;
}

// ---- Emotion Weather (PocketBase: emotion_weather) ----

export async function getEmotionWeather(weekend?: string): Promise<EmotionWeather[]> {
  try {
    return await pb.collection('emotion_weather').getFullList<EmotionWeather>({
      sort: '-created',
      ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
    });
  } catch (err) {
    console.error('[api] getEmotionWeather failed:', err);
    return [];
  }
}

export async function createEmotionWeather(
  name: string, group: string, weekend: string, weather: string, emotion: string
): Promise<EmotionWeather> {
  const existing = await pb.collection('emotion_weather').getFullList<EmotionWeather>({
    filter: `Name = "${name}" && weekend = "${weekend}"`,
  });
  if (existing.length > 0) throw new Error('DUPLICATE');

  return await pb.collection('emotion_weather').create<EmotionWeather>({
    Name: name,
    group,
    weekend,
    weather,
    emotion,
    time: new Date().toISOString(),
  });
}

// ---- Text Messages (PocketBase: text_message) ----

export async function getTextMessages(group?: string): Promise<TextMessage[]> {
  try {
    return await pb.collection('text_message').getFullList<TextMessage>({
      sort: '-created',
      ...(group ? { filter: `group = "${group}"` } : {}),
    });
  } catch (err) {
    console.error('[api] getTextMessages failed:', err);
    return [];
  }
}

export async function createTextMessage(
  name: string, group: string, text: string, object?: string
): Promise<TextMessage> {
  return await pb.collection('text_message').create<TextMessage>({
    Name: name,
    group,
    text,
    object: object || '',
  });
}

// ---- Voice Messages (PocketBase: voice_message) ----

export async function getVoiceMessages(group?: string): Promise<VoiceMessage[]> {
  try {
    return await pb.collection('voice_message').getFullList<VoiceMessage>({
      sort: '-created',
      ...(group ? { filter: `group = "${group}"` } : {}),
    });
  } catch (err) {
    console.error('[api] getVoiceMessages failed:', err);
    return [];
  }
}

export async function createVoiceMessage(
  name: string, group: string, voiceFile: File, object?: string
): Promise<VoiceMessage> {
  const formData = new FormData();
  formData.append('Name', name);
  formData.append('group', group);
  formData.append('voice', voiceFile);
  formData.append('object', object || '');

  return await pb.collection('voice_message').create<VoiceMessage>(formData);
}

export function getVoiceUrl(record: VoiceMessage): string {
  if (!record.voice || !record.collectionId) return '';
  return getPbFileUrl(record.collectionId, record.id, record.voice);
}

// ---- Weekend Poster (PocketBase: weekend_poster) ----

export async function getWeekendPosters(weekend?: string): Promise<WeekendPoster[]> {
  try {
    return await pb.collection('weekend_poster').getFullList<WeekendPoster>({
      sort: '-created',
      ...(weekend ? { filter: `weekend = "${weekend}"` } : {}),
    });
  } catch (err) {
    console.error('[api] getWeekendPosters failed:', err);
    return [];
  }
}

export async function createWeekendPoster(
  name: string, group: string, weekend: string, posterFiles: File[]
): Promise<WeekendPoster> {
  const formData = new FormData();
  formData.append('Name', name);
  formData.append('group', group);
  formData.append('weekend', weekend);
  for (const file of posterFiles) {
    formData.append('poster', file);
  }

  return await pb.collection('weekend_poster').create<WeekendPoster>(formData);
}

export function getPosterUrls(record: WeekendPoster): string[] {
  if (!record.poster || !record.collectionId) return [];
  return record.poster.map(filename => getPbFileUrl(record.collectionId!, record.id, filename));
}
