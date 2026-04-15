import { css } from "@emotion/react";
import { Link, NavLink } from "react-router";

import { routes } from "@/shared/routes";

export default function GlobalHeader() {
  return (
    <header css={headerStyle}>
      <div css={innerStyle}>
        <Link css={brandStyle} to={routes.home}>
          커피 주문 앱
        </Link>
        <nav>
          <ul css={navListStyle}>
            <li>
              <NavItem to={routes.cart}>장바구니</NavItem>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      css={navLinkStyle}
      to={to}
      style={({ isActive }) => (isActive ? activeNavLinkStyle : undefined)}
    >
      {children}
    </NavLink>
  );
}

const headerStyle = css({
  position: "sticky",
  top: 0,
  zIndex: 10,
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
});

const innerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",
  maxWidth: "1080px",
  margin: "0 auto",
  padding: "16px 24px",
});

const brandStyle = css({
  color: "#111827",
  fontSize: "1.125rem",
  fontWeight: 700,
  textDecoration: "none",
});

const navListStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

const navLinkStyle = css({
  display: "inline-flex",
  alignItems: "center",
  height: "36px",
  padding: "0 12px",
  borderRadius: "8px",
  fontWeight: "600",
  color: "#4b5563",
  textDecoration: "none",
});

const activeNavLinkStyle = {
  backgroundColor: "#fff7ed",
  color: "#c2410c",
  fontWeight: 600,
};
