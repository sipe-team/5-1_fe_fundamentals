import { SuspenseQuery } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { Link } from "react-router";
import { myReservationsQueryOptions } from "@/reservation/api/reservations";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { color, spacing } from "@/styles/tokens";

export function MyReservationsPage() {
  return (
    <div>
      <h1
        css={css`
          margin-bottom: ${spacing.lg};
        `}
      >
        내 예약
      </h1>
      <AsyncBoundary>
        <SuspenseQuery {...myReservationsQueryOptions()}>
          {({ data: { reservations } }) =>
            reservations.length === 0 ? (
              <p
                css={css`
                  color: ${color.textMuted};
                  text-align: center;
                  padding: ${spacing.xxl};
                `}
              >
                예약이 없습니다.
              </p>
            ) : (
              <ul css={listStyle}>
                {reservations.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/reservations/${r.id}`}
                      state={{ from: "/my-reservations" }}
                      css={itemStyle}
                    >
                      <strong>{r.title}</strong>
                      <span
                        css={css`
                          margin-left: ${spacing.md};
                          color: ${color.textSecondary};
                        `}
                      >
                        {r.date} {r.startTime}~{r.endTime}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          }
        </SuspenseQuery>
      </AsyncBoundary>
    </div>
  );
}

const listStyle = css`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const itemStyle = css`
  display: block;
  padding: ${spacing.md} ${spacing.lg};
  border: 1px solid ${color.border};
  border-radius: 4px;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: ${color.bgHeader};
  }
`;
