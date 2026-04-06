import { css } from "@emotion/react";
import { Link, useLocation } from "wouter";

export default function GlobalHeader() {
  const [_, setLocation] = useLocation();

  function moveToMain() {
    setLocation("/");
  }

  return (
    <header css={headerStyle}>
      <h1 css={titleStyle} onClick={moveToMain}>
        SIPE 회의실 예약
      </h1>
      <ul css={navStyle}>
        <NavLink href="/">타임라인</NavLink>
        <NavLink href="/reservations/new">예약 생성</NavLink>
        <NavLink href="/my-reservations">내 예약</NavLink>
      </ul>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [location] = useLocation();

  const isActive = location === href;
  const linkCss = isActive ? activeStyle : undefined;

  return (
    <li css={linkCss}>
      <Link href={href}>{children}</Link>
    </li>
  );
}

const headerStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  position: "sticky",
});

const titleStyle = css({
  fontSize: "1.5rem",
  fontWeight: 700,
  cursor: "pointer",
});

const navStyle = css({
  display: "flex",
  gap: "2rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
  fontSize: "1rem",
  fontWeight: 600,
});

const activeStyle = css({
  color: "#f97316",
  fontWeight: 700,
});
