import React, { useRef } from "react";
import {
  Avatar,
  Badge,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Skeleton,
  SwipeableDrawer,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useLocation, useNavigate } from "react-router-dom";
import pages from "../data/pages";
import useControls from "../hooks/useControls";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const Sidebar = ({
  width,
  name,
  role,
  organization,
  avatar,
  onLogout = () => {},
  onChangeAvatar,
  onClose,
  onOpen,
  permanent,
  open,
  permissions,
  isNamePending = false,
  isRolePending = false,
  isOrganizationPending = false,
  isTabsPending = false,
  isAvatarPending = false,
}) => {
  //----states----
  const [{ controls }, { setControl }] = useControls(
    pages
      .filter((page) => page && Boolean(page?.hasOwnProperty("subtabs")))
      .map((page) => ({
        control: page.name,
        value: false,
        isRequired: false,
      }))
  );

  //----hooks----
  const pictureFileInput = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  //----functions----
  const handleClose = () => {
    onClose();
  };

  return (
    <SwipeableDrawer
      variant={permanent ? "permanent" : "temporary"}
      open={open}
      onOpen={onOpen}
      anchor="right"
      sx={{
        width: width,
        "& .MuiDrawer-paper": {
          width: width,
          bgcolor: "#233975",
          color: "white",
          border: "none",
          borderRadius: !permanent ? "0 50px 50px 0" : 0,
          boxShadow: "2px -1px 10px -1px rgb(35 57 117)",
          right: "none",
          left: 0,
        },
        "& .MuiBackdrop-root": {
          bgcolor: "rgb(255 255 255 / 50%)",
        },
      }}
      onClose={handleClose}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        {Boolean(onChangeAvatar) ? (
          <Badge
            overlap="circular"
            badgeContent={
              <IconButton
                sx={{
                  bgcolor: "white",
                  color: "black",
                  boxShadow: "0 0 10px #fff",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
                size="small"
                disabled={isAvatarPending}
                onClick={() => {
                  pictureFileInput.current.click();
                }}
              >
                <AddAPhotoIcon color="primary" fontSize="small" />
              </IconButton>
            }
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  onChangeAvatar(e.target.files[0]);
                }}
                ref={pictureFileInput}
              />

              {isAvatarPending ? (
                <Skeleton variant="circle" width={60} height={60} />
              ) : (
                <Avatar sx={{ width: 60, height: 60 }} src={avatar} />
              )}
            </Box>
          </Badge>
        ) : (
          <Box
            sx={{
              position: "relative",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            {isAvatarPending ? (
              <Skeleton variant="circle" width={60} height={60} />
            ) : (
              <Avatar sx={{ width: 60, height: 60 }} src={avatar} />
            )}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "10px",
          }}
        >
          {isNamePending ? (
            <Skeleton variant="text" width={120} height={25} />
          ) : (
            <Typography>{name}</Typography>
          )}
          {isRolePending ? (
            <Skeleton variant="text" width={80} height={25} />
          ) : (
            <Typography variant="caption">{role}</Typography>
          )}
          {isOrganizationPending ? (
            <Skeleton variant="text" width={90} height={25} />
          ) : (
            <Typography variant="caption">{organization}</Typography>
          )}
        </Box>
      </Box>
      <List>
        {isTabsPending ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              WebkitMaskImage:
                "linear-gradient(0deg, rgba(9,9,121,0) 0%, rgba(255,255,255,1) 100%)",
              maxHeight: 600,
            }}
          >
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={40} />
          </Box>
        ) : (
          <>
            {pages.map((page, pageIndex) => {
              if (!Boolean(page))
                return (
                  <Divider
                    sx={{ borderColor: "rgb(255 255 255 / 8%)" }}
                    key={`divider ${pageIndex}`}
                  />
                );

              switch (page.hasOwnProperty("subtabs")) {
                case true:
                  if (
                    !Boolean(
                      page.subtabs.every((subtab) =>
                        subtab.permitted.some((perm) =>
                          permissions.includes(perm)
                        )
                      )
                    )
                  )
                    return;

                  return (
                    <React.Fragment key={`page ${pageIndex}`}>
                      <ListItemButton
                        onClick={() =>
                          setControl(`${page.name}`, (old) => !old)
                        }
                      >
                        <ListItemIcon sx={{ minWidth: "34px" }}>
                          {React.cloneElement(page.icon, {
                            sx: { color: "white" },
                          })}
                        </ListItemIcon>
                        <ListItemText primary={page.name} />
                        {controls[page.name] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>

                      <Collapse
                        in={Boolean(controls[page.name])}
                        timeout="auto"
                        unmountOnExit
                      >
                        {page.subtabs.map((subtab, subTabIndex) => {
                          if (
                            !Boolean(
                              subtab.permitted.every((perm) =>
                                permissions.includes(perm)
                              )
                            )
                          )
                            return;

                          return (
                            <ListItemButton
                              key={`subtab ${subTabIndex}`}
                              sx={{
                                pl: 7,
                                bgcolor:
                                  location.pathname === page.path + subtab.path
                                    ? "#f4f4f4"
                                    : "initial",
                                "& *": {
                                  color:
                                    location.pathname ===
                                    page.path + subtab.path
                                      ? "primary.main"
                                      : "white",
                                },
                                "&:hover": {
                                  bgcolor:
                                    location.pathname ===
                                    page.path + subtab.path
                                      ? "#f4f4f4"
                                      : "initial",
                                },
                                "&:hover *": {
                                  color:
                                    location.pathname ===
                                    page.path + subtab.path
                                      ? "primary.main"
                                      : "white",
                                },
                              }}
                              onClick={() => navigate(page.path + subtab.path)}
                            >
                              <ListItemText
                                primary={subtab.name}
                                sx={{
                                  "& .MuiListItemText-primary": {
                                    fontSize: ".80rem",
                                  },
                                }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </Collapse>
                    </React.Fragment>
                  );
                case false:
                  if (
                    !Boolean(
                      page.permitted.some((perm) => permissions.includes(perm))
                    )
                  )
                    return;

                  return (
                    <ListItemButton
                      key={pageIndex}
                      sx={{
                        bgcolor:
                          location.pathname === page.path
                            ? "#f4f4f4"
                            : "initial",
                        "& *": {
                          color:
                            location.pathname === page.path
                              ? "primary.main"
                              : "white",
                        },
                        "&:hover": {
                          bgcolor:
                            location.pathname === page.path
                              ? "#f4f4f4"
                              : "initial",
                        },
                        "&:hover *": {
                          color:
                            location.pathname === page.path
                              ? "primary.main"
                              : "white",
                        },
                      }}
                      onClick={() => navigate(page.path)}
                    >
                      <ListItemIcon sx={{ minWidth: "34px" }}>
                        {React.cloneElement(page.icon, {
                          sx: { color: "white" },
                        })}
                      </ListItemIcon>
                      <ListItemText primary={page.name} />
                    </ListItemButton>
                  );
                default:
                  return;
              }
            })}
            <ListItemButton
              sx={{
                bgcolor: "primary.main",
                "& *": {
                  color: "white",
                },
                "&:hover": {
                  bgcolor: "primary.main",
                },
                "&:hover *": {
                  color: "white",
                },
              }}
              onClick={onLogout}
            >
              <ListItemIcon sx={{ minWidth: "34px" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="تسجيل الخروج" />
            </ListItemButton>
          </>
        )}
      </List>
    </SwipeableDrawer>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLogout: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onChangeAvatar: PropTypes.func,
  permanent: PropTypes.bool,
  open: PropTypes.bool,
  isNamePending: PropTypes.bool,
  isRolePending: PropTypes.bool,
  isOrganizationPending: PropTypes.bool,
  isTabsPending: PropTypes.bool,
  isAvatarPending: PropTypes.bool,
};
