import { Button, Message, Popconfirm, Radio } from "@arco-design/web-react";
import { IconCheck, IconRefresh } from "@arco-design/web-react/icon";
import React, { forwardRef, useContext, useEffect } from "react";

import useStore from "../../Store";
import useFilterEntries from "../../hooks/useFilterEntries";
import ContentContext from "./ContentContext";

import "./FooterPanel.css";

const FooterPanel = forwardRef(
  ({ info, refreshArticleList, markAllAsRead }, ref) => {
    const {
      entries,
      filteredEntries,
      filterStatus,
      loading,
      setEntries,
      setFilteredEntries,
      setUnreadCount,
      setUnreadEntries,
      unreadEntries,
    } = useContext(ContentContext);

    const { setFilterStatus } = useFilterEntries(info);

    /*menu 数据初始化函数 */
    const initData = useStore((state) => state.initData);
    const showStatus = useStore((state) => state.showStatus);

    const handleMarkAllAsRead = async () => {
      markAllAsRead()
        .then(() => {
          Message.success("Marked all as read successfully");
          initData();
          setEntries(entries.map((entry) => ({ ...entry, status: "read" })));
          setUnreadEntries([]);
          if (filterStatus === "all") {
            setFilteredEntries(
              filteredEntries.map((entry) => ({ ...entry, status: "read" })),
            );
          } else {
            setFilteredEntries([]);
          }
          setUnreadCount(0);
        })
        .catch(() => {
          Message.error("Failed to mark all as read");
        });
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (info.from !== "history") {
        setFilterStatus(showStatus);
      }
    }, [showStatus]);

    const handleRadioChange = (value) => {
      if (ref.current) {
        ref.current.scrollTo(0, 0);
      }
      setFilterStatus(value);
      if (value === "all") {
        setFilteredEntries(entries);
      } else {
        setFilteredEntries(unreadEntries);
      }
    };

    return (
      <div className="entry-panel">
        {!["starred", "history"].includes(info.from) && (
          <Popconfirm
            focusLock
            title="Mark All As Read?"
            onOk={handleMarkAllAsRead}
          >
            <Button icon={<IconCheck />} shape="circle" />
          </Popconfirm>
        )}
        <Radio.Group
          disabled={info.from === "history"}
          name="lang"
          onChange={(value) => handleRadioChange(value)}
          type="button"
          value={info.from === "history" ? "all" : filterStatus}
        >
          <Radio value="all">ALL</Radio>
          <Radio value="unread">UNREAD</Radio>
        </Radio.Group>

        <Button
          icon={<IconRefresh />}
          loading={loading}
          shape="circle"
          onClick={refreshArticleList}
        />
      </div>
    );
  },
);

export default FooterPanel;
