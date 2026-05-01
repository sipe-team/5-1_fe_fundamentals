import type { Level, Member, ProblemTypeChip, Proficiency } from '@/types';

async function fetchOrThrow<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API 요청 실패 (${response.status})`);
  }
  return response.json();
}

export function fetchMembers(): Promise<Member[]> {
  return fetchOrThrow('/api/members');
}

export function fetchLevels(): Promise<Level[]> {
  return fetchOrThrow('/api/levels');
}

export function fetchProblemTypes(
  levelKey: string,
): Promise<ProblemTypeChip[]> {
  return fetchOrThrow(`/api/problem-types?levelKey=${levelKey}`);
}

export function fetchProficiency(
  memberId: number,
  levelKey: string,
): Promise<Proficiency[]> {
  return fetchOrThrow(
    `/api/proficiency?memberId=${memberId}&levelKey=${levelKey}`,
  );
}
