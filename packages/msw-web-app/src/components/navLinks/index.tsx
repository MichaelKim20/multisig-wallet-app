import React from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

import NavLink from 'components/navLink';
import {
  IconCommunity,
  IconDashboard,
  IconGovernance,
  IconSettings,
} from 'msw-ui-components';
import {Dashboard, Community, Governance, Settings} from '../../utils/paths';

type NavLinksProps = {
  onItemClick?: () => void;
};

const NavLinks: React.FC<NavLinksProps> = ({onItemClick}) => {
  const {t} = useTranslation();
  
  const navLinksData = [
    {
      label: t('navLinks.dashboard'),
      path: Dashboard,
      icon: IconDashboard,
    },
    {
      label: t('navLinks.governance'),
      path: Governance,
      icon: IconGovernance,
    },
    {
      label: t('navLinks.community'),
      path: Community,
      icon: IconCommunity,
    },
    {
      label: t('navLinks.settings'),
      path: Settings,
      icon: IconSettings,
    },
  ];

  return (
    <div>
      <StyledNavList data-testid="navLinks">
        {navLinksData.map(d => (
          <li key={d.label}>
            <NavLink caller="navlinks" data={d} onItemClick={onItemClick} />
          </li>
        ))}
      </StyledNavList>
    </div>
  );
};

const StyledNavList = styled.ul.attrs({
  className:
    'space-y-1 desktop:space-y-0 desktop:flex desktop:space-x-1.5 desktop:items-center',
})``;

export default NavLinks;
