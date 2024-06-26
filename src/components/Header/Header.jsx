import {
  Avatar,
  Button,
  Dropdown,
  Menu,
  Message,
  Space,
  Tooltip,
} from "@arco-design/web-react";
import {
  IconCheck,
  IconDesktop,
  IconEye,
  IconEyeInvisible,
  IconGithub,
  IconMenu,
  IconMoonFill,
  IconPlus,
  IconPoweroff,
  IconSettings,
  IconSunFill,
  IconUser,
} from "@arco-design/web-react/icon";
import React from "react";
import { useNavigate } from "react-router-dom";

import useStore from "../../Store";
import { applyColor } from "../../utils/colors";
import { setConfig } from "../../utils/config";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const setVisible = useStore((state) => state.setVisible);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const toggleCollapsed = useStore((state) => state.toggleCollapsed);
  const showAllFeeds = useStore((state) => state.showAllFeeds);
  const toggleShowAllFeeds = useStore((state) => state.toggleShowAllFeeds);
  const feeds = useStore((state) => state.feeds);
  const hiddenFeedIds = useStore((state) => state.hiddenFeedIds);
  const setUnreadTotal = useStore((state) => state.setUnreadTotal);

  const handleLogout = () => {
    localStorage.clear();
    document.body.removeAttribute("arco-theme");
    applyColor("Blue");
    navigate("/login");
    Message.success("logout");
  };

  let themeIcon;
  switch (theme) {
    case "dark":
      themeIcon = <IconMoonFill />;
      break;
    case "system":
      themeIcon = <IconDesktop />;
      break;
    default:
      themeIcon = <IconSunFill />;
  }

  return (
    <div className="header">
      <div className="brand">
        <Button
          className="trigger"
          onClick={toggleCollapsed}
          shape="circle"
          size="small"
        >
          {<IconMenu />}
        </Button>
      </div>
      <div className="button-group">
        <Space size={16}>
          <Tooltip content="Add a feed" mini>
            <Button
              shape="circle"
              size="small"
              type="primary"
              icon={<IconPlus />}
              onClick={() => setVisible("addFeed", true)}
            />
          </Tooltip>
          <Tooltip
            content={showAllFeeds ? "Hide some feeds" : "Show all feeds"}
            mini
          >
            <Button
              shape="circle"
              size="small"
              icon={showAllFeeds ? <IconEye /> : <IconEyeInvisible />}
              onClick={() => {
                toggleShowAllFeeds();
                setConfig("showAllFeeds", showAllFeeds);
                if (!showAllFeeds && hiddenFeedIds) {
                  const showedFeedsUnreadCount = feeds
                    .filter((feed) => !hiddenFeedIds.includes(feed.id))
                    .reduce((acc, feed) => acc + feed.unreadCount, 0);
                  setUnreadTotal(() => showedFeedsUnreadCount);
                } else {
                  setUnreadTotal(() =>
                    feeds.reduce((acc, feed) => acc + feed.unreadCount, 0),
                  );
                }
              }}
            />
          </Tooltip>
          <Button
            shape="circle"
            size="small"
            icon={<IconGithub />}
            onClick={() =>
              window.open("https://github.com/electh/ReactFlux", "_blank")
            }
          />
          <Dropdown
            droplist={
              <Menu defaultSelectedKeys={[theme]} className="theme-menu">
                {["light", "dark", "system"].map((themeOption) => (
                  <Menu.Item
                    className="theme-menu-item"
                    key={themeOption}
                    onClick={() => {
                      setTheme(themeOption);
                      setConfig("theme", themeOption);
                    }}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                    {theme === themeOption && (
                      <IconCheck style={{ marginLeft: 8 }} />
                    )}
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger="hover"
            position="bottom"
          >
            <Button
              icon={themeIcon}
              shape="circle"
              size="small"
              onClick={() => {
                switch (theme) {
                  case "light":
                    setTheme("dark");
                    setConfig("theme", "dark");
                    break;
                  case "dark":
                    setTheme("light");
                    setConfig("theme", "light");
                    break;
                  default:
                    break;
                }
              }}
            />
          </Dropdown>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="0" onClick={() => setVisible("settings", true)}>
                  <IconSettings className="icon-right" />
                  Settings
                </Menu.Item>
                <Menu.Item key="1" onClick={handleLogout}>
                  <IconPoweroff className="icon-right" />
                  Logout
                </Menu.Item>
              </Menu>
            }
            trigger="click"
            position="br"
          >
            <Avatar size={28} style={{ cursor: "pointer" }}>
              <IconUser />
            </Avatar>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default Header;
