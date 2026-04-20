import { type CSSProperties, useEffect, useState } from 'react';
import type { ProblemTypeChip } from '@/shared/types';
import {
  clearMockData,
  getMockControls,
  getStoredLevels,
  getStoredMembers,
  getStoredProblemTypes,
  getStoredProficiency,
  seedMockData,
  subscribeMockStorage,
  updateMockControls,
} from './mocks/storage';

interface MockSnapshot {
  memberCount: number;
  levelCount: number;
  problemTypeChipCount: number;
  proficiencyKeyCount: number;
  forceError: boolean;
  forceDelay: boolean;
}

function countProblemTypeChips(map: Record<string, ProblemTypeChip[]>): number {
  return Object.values(map).reduce((sum, chips) => sum + chips.length, 0);
}

function readSnapshot(): MockSnapshot {
  const controls = getMockControls();
  const problemTypes = getStoredProblemTypes();
  const proficiency = getStoredProficiency();

  return {
    memberCount: getStoredMembers().length,
    levelCount: getStoredLevels().length,
    problemTypeChipCount: countProblemTypeChips(problemTypes),
    proficiencyKeyCount: Object.keys(proficiency).length,
    forceError: controls.forceError,
    forceDelay: controls.forceDelay,
  };
}

export function DevToolPanel() {
  const [snapshot, setSnapshot] = useState<MockSnapshot>(() => readSnapshot());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return subscribeMockStorage(() => {
      setSnapshot(readSnapshot());
    });
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? '개발자 패널 닫기' : '개발자 패널 열기'}
        onClick={() => setIsOpen((prev) => !prev)}
        style={floatingButtonStyle}
      >
        Dev
      </button>

      {isOpen ? (
        <aside style={panelStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Mock DevTool Panel
          </div>
          <div style={{ opacity: 0.85, marginBottom: 12 }}>
            members: {snapshot.memberCount} / levels: {snapshot.levelCount} /
            chips: {snapshot.problemTypeChipCount} / proficiency keys:{' '}
            {snapshot.proficiencyKeyCount}
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <button
              type="button"
              onClick={() => clearMockData()}
              style={buttonStyle}
            >
              데이터 초기화
            </button>
            <button
              type="button"
              onClick={() => seedMockData()}
              style={buttonStyle}
            >
              Initial Data 생성
            </button>
            <button
              type="button"
              onClick={() =>
                updateMockControls({
                  forceError: !snapshot.forceError,
                })
              }
              style={{
                ...buttonStyle,
                background: snapshot.forceError ? '#b91c1c' : '#1f2937',
              }}
            >
              API 에러 강제 발생: {snapshot.forceError ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() =>
                updateMockControls({
                  forceDelay: !snapshot.forceDelay,
                })
              }
              style={{
                ...buttonStyle,
                background: snapshot.forceDelay ? '#92400e' : '#1f2937',
              }}
            >
              API 지연 강제 발생: {snapshot.forceDelay ? 'ON' : 'OFF'}
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}

const buttonStyle: CSSProperties = {
  width: '100%',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: 8,
  padding: '8px 10px',
  background: '#1f2937',
  color: '#f9fafb',
  textAlign: 'left',
  cursor: 'pointer',
};

const floatingButtonStyle: CSSProperties = {
  position: 'fixed',
  left: 12,
  bottom: 12,
  zIndex: 2147483647,
  width: 56,
  height: 56,
  border: 0,
  borderRadius: 9999,
  background: '#111827',
  color: '#f9fafb',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
  cursor: 'pointer',
  fontWeight: 700,
};

const panelStyle: CSSProperties = {
  position: 'fixed',
  left: 12,
  bottom: 80,
  zIndex: 2147483647,
  width: 280,
  padding: 12,
  borderRadius: 12,
  background: 'rgba(17, 24, 39, 0.92)',
  color: '#f9fafb',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
  fontFamily:
    'ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
  fontSize: 12,
  lineHeight: 1.5,
};
