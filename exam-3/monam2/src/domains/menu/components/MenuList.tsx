import { css } from '@emotion/react';
import { useQueryState } from 'nuqs';
import { Link } from 'react-router';
import { useMenus } from '@/domains/menu/hooks';
import { isMenuCategory } from '@/domains/menu/utils';
import { MenuCard } from '@/shared/components';
import { routes } from '@/shared/routes';
import type { MenuView } from '@/shared/types';

export default function MenuList() {
  const [category] = useQueryState('category');
  const [view] = useQueryState('view');

  const selectedCategory = isMenuCategory(category) ? category : undefined;
  const selectedView: MenuView = view === 'list' ? 'list' : 'grid';

  const { data: menus } = useMenus();
  const catalogs = selectedCategory
    ? menus.filter((menu) => menu.category === selectedCategory)
    : menus;

  return (
    <div css={groupStyle}>
      <h2 css={sectionTitleStyle}>메뉴 {catalogs.length}개</h2>
      <div css={selectedView === 'list' ? cardListStyle : cardGridStyle}>
        {catalogs.map((item) => (
          <Link key={item.id} css={menuLinkStyle} to={routes.menuItem(item.id)}>
            <MenuCard item={item} variant={selectedView} />
          </Link>
        ))}
      </div>
    </div>
  );
}

const groupStyle = css({
  display: 'grid',
  gap: '16px',
});

const sectionTitleStyle = css({
  margin: 0,
  fontSize: '1.125rem',
  color: '#111827',
});

const cardGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 260px))',
  justifyContent: 'center',
  gap: '28px',
});

const cardListStyle = css({
  display: 'grid',
  gap: '16px',
});

const menuLinkStyle = css({
  display: 'block',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});
