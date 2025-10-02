import {ButtonIcon, Dropdown, IconClose, IconMenu, IconCommunity, IconDashboard, IconGovernance, IconSettings} from 'msw-ui-components';
import React, {useState} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

import NavLink from 'components/navLink';
import {Dashboard, Community, Governance, Settings} from '../../utils/paths';

export const NavlinksDropdown: React.FC = () => {
  const [showCrumbMenu, setShowCrumbMenu] = useState(false);
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
    <StyledDropdown
      open={showCrumbMenu}
      onOpenChange={setShowCrumbMenu}
      align="start"
      trigger={
        <ButtonIcon
          mode="secondary"
          size="large"
          icon={showCrumbMenu ? <IconClose /> : <IconMenu />}
          isActive={showCrumbMenu}
          css={{}}
        />
      }
      sideOffset={8}
      listItems={navLinksData.map(d => ({
        component: <NavLink caller="dropdown" data={d} />,
        // Navlink component already takes care of callback. Eventually we
        // should probably make this optional on the dropdown component.
        callback: () => {},
      }))}
    />
  );
};

const StyledDropdown = styled(Dropdown).attrs({
  className: 'p-1.5 w-30 rounded-xl',
})``;
