import type { FallbackProps } from 'react-error-boundary';

import { Button } from '@/shared/ui';

export default function ReservationDetailError({
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <section style={errorStyle}>
      <p style={errorTitleStyle}>
        예약 상세 데이터를 불러오는 중 오류가 발생했습니다.
      </p>
      <p style={errorMessageStyle}>
        네트워크 상태를 확인한 뒤 다시 시도해주세요.
      </p>
      <Button type="button" variant="primary" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </section>
  );
}

const errorStyle = {
  display: 'grid',
  gap: '12px',
  marginTop: '24px',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #fecaca',
  backgroundColor: '#fef2f2',
};

const errorTitleStyle = {
  margin: 0,
  fontWeight: 700,
  color: '#b91c1c',
};

const errorMessageStyle = {
  margin: 0,
  color: '#7f1d1d',
  lineHeight: 1.5,
};
