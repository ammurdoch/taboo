import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Layout, Menu, notification, Typography } from 'antd';
import {
  BankOutlined,
  CheckOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  FileOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../shared/auth-context';
import logo from '../assets/logo-white.svg';
import squareLogo from '../assets/square-logo.svg';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Sider } = Layout;
const { Title } = Typography;

function MainNavMenu() {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(undefined);
  const history = useHistory();
  const currentItem = useMemo(() => {
    const path = location.pathname;
    if (path === '/home') {
      return 'home';
    } else if (path === '/checks') {
      return 'checks';
    } else if (path === '/payments') {
      return 'payments';
    } else if (path === '/profile') {
      return 'profile';
    } else if (path === '/bank-accounts') {
      return 'banks';
    } else if (path === '/addresses') {
      return 'addresses';
    }
    return 'home';
  }, [location]);
  const onMenuClick = useCallback(
    ({ item, key, keyPath, domEvent }) => {
      if (key === 'sign-out') {
        authContext.signOut();
        history.push('/');
        notification.open({
          message: 'Success',
          description: `Successfully signed out!`,
        });
      } else if (key === 'home') {
        history.push('/home');
      } else if (key === 'checks') {
        history.push('/checks');
      } else if (key === 'payments') {
        history.push('/payments');
      } else if (key === 'profile') {
        history.push('/profile');
      } else if (key === 'banks') {
        history.push('/banks');
      } else if (key === 'addresses') {
        history.push('/addresses');
      }
    },
    [authContext, history],
  );
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth={80}
      onBreakpoint={(broken) => {
        setCollapsed(collapsed || broken);
      }}
      onCollapse={(_collapsed) => {
        setCollapsed(collapsed === undefined ? true : _collapsed);
      }}
      theme="light"
      width={300}
      collapsible
      collapsed={collapsed}
      className="main-nav-menu-slider"
    >
      <div className="logo" style={{ width: collapsed ? 80 : undefined }}>
        {!collapsed && (
          <img className="logo-img" src={logo} alt="Check Supply Logo" />
        )}
        {collapsed && (
          <img
            className="square-logo-img"
            src={squareLogo}
            alt="Check Supply Logo"
          />
        )}
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[currentItem]}
        onClick={onMenuClick}
        className="main-nav-menu"
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="checks" icon={<CheckOutlined />}>
          Checks
        </Menu.Item>
        <Menu.Item key="payments" icon={<DollarCircleOutlined />}>
          Payments
        </Menu.Item>
        <SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
          <Menu.Item key="profile" icon={<ProfileOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="banks" icon={<BankOutlined />}>
            Bank Accounts
          </Menu.Item>
          <Menu.Item key="addresses" icon={<EnvironmentOutlined />}>
            Addresses
          </Menu.Item>
        </SubMenu>
        <div className="spacer" />
        <Menu.Item
          key="sign-out"
          icon={<LogoutOutlined />}
          style={{ marginTop: 'auto' }}
        >
          Sign Out
        </Menu.Item>
      </Menu>
      <style jsx>{`
        .logo {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #f0f0f0;
        }
        .square-logo-img {
          height: 56px;
          padding: 16px;
        }
        .logo-img {
          height: 56px;
        }
        .spacer {
          margin: auto;
        }
      `}</style>
      <style jsx global>{`
        .main-nav-menu {
          height: calc(100% - 80px);
        }
        .main-nav-menu-slider .ant-layout-sider-trigger {
          border-right: 1px solid #f0f0f0;
        }
      `}</style>
    </Sider>
  );
}

export default MainNavMenu;
