import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Badge,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MenuIcon from "@mui/icons-material/Menu";
import format from "../utils/ISOToReadable";
import notificationSfx from "../assets/notification sfx.wav";
import playSoundEffect from "../utils/playSoundEffect";
import pages from "../data/pages";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ onClick, content, time, unread = false }) => {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{ bgcolor: unread ? "rgba(0, 0, 0, 0.04)" : "initial" }}
    >
      <ListItemText primary={content} secondary={time} />
    </ListItemButton>
  );
};

const Topbar = ({
  showBurger,
  onBurgerClick,
  onClear,
  notifications = [],
  onNotificationsOpen,
}) => {
  //----states----
  const [notificationsState, setNotificationsState] = useState([]);
  const unreadNotifCache = useRef(0);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [readNotif, setReadNotif] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  //----effects----
  useEffect(() => {
    setUnreadNotif(() =>
      Math.minimumZero(notifications.length - parseInt(readNotif))
    );
    setNotificationsState(notifications);

    if (Boolean(notifications.length)) {
      playSoundEffect(notificationSfx);
    }
  }, [notifications]);

  useEffect(() => {
    if (!open) return;
    onNotificationsOpen();
    setReadNotif(notifications.length);
    setUnreadNotif(() => {
      unreadNotifCache.current = unreadNotif;
      return 0;
    });
  }, [open]);

  //----functions----
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    unreadNotifCache.current = 0;
    setAnchorEl(null);
  };

  const handleClear = () => {
    unreadNotifCache.current = 0;
    setUnreadNotif(0);
    setReadNotif(0);
    onClear();
  };

  //===Start======= Notification Redirects Logic ============
  const navigate = useNavigate();

  const getPath = (name, isChild = false) => {
    switch (isChild) {
      case false:
        return pages.find((page) => page?.name === name)?.path;
      case true:
        const parent = pages.find(
          (page) =>
            page?.subtabs?.filter((subtab) => subtab?.name === name).length > 0
        );
        return (
          parent.path +
          parent.subtabs.find((subtab) => subtab?.name === name)?.path
        );
    }
  };

  const typesAndPaths = {
    project: getPath("عرض المشاريع", true),
    unit: getPath("عرض الوحدات", true),
    other: "",
  };

  //===End======= Notification Redirects Logic ============

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "0px 3px 10px -1px rgb(35 57 117)",
        zIndex: 1,
      }}
    >
      <Toolbar>
        {showBurger && (
          <IconButton sx={{ color: "white" }} onClick={() => onBurgerClick()}>
            <MenuIcon />
          </IconButton>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: showBurger ? "flex-end" : "space-between",
            maxWidth: "90%",
            width: "90%",
          }}
        >
          <Box>
            <Tooltip title="Notifications">
              <IconButton sx={{ color: "white" }} onClick={handleOpenMenu}>
                <Badge
                  badgeContent={unreadNotif}
                  color="error"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: "white" }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiList-root": {
                  maxWidth: "400px",
                  width: "100vmax",
                },
              }}
            >
              <List sx={{ maxWidth: 500, width: "100%" }}>
                <ListItem>
                  <ListItemText primary="الإشعارات" />
                </ListItem>
                <Divider variant="middle" />
                {notificationsState.length ? (
                  notificationsState.map((notification, index) => (
                    <NotificationItem
                      key={`notification ${index}`}
                      onClick={() => {
                        navigate(typesAndPaths[notification.types]);
                        handleCloseMenu();
                      }}
                      content={notification?.message}
                      time={`${format(
                        notification?.date ?? "sad/asdfa/asdfT435:34534:453"
                      )}`}
                      unread={index < unreadNotifCache.current}
                    />
                  ))
                ) : (
                  <MenuItem disabled>فارغ</MenuItem>
                )}
                <Divider variant="middle" />
                <ListItem>
                  <Button onClick={handleClear} color="error">
                    إزالة
                  </Button>
                </ListItem>
              </List>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;

//----typechecking----

NotificationItem.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

Topbar.propTypes = {
  showBurger: PropTypes.bool,
  onBurgerClick: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.object),
};
