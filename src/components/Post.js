import React, { useState } from "react";
import format from "../utils/ISOToReadable";
import {
  Typography,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CardActions,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Skeleton,
  CardMedia,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import PropTypes from "prop-types";
import PermissionsGate from "../features/permissions/components/PermissionsGate";

const Post = ({
  name = "",
  picture = "",
  createdAt,
  children,
  images = [],
  onDelete = null,
  onEdit = null,
  onPreventNotifications = null,
}) => {
  //----states----
  const [anchorEl, setAnchorEl] = useState(null);

  //----variables----
  const open = Boolean(anchorEl);

  //----functions----
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        maxWidth: "766px",
      }}
    >
      <CardHeader
        avatar={<Avatar src={picture}>{name ? name[0] : ""}</Avatar>}
        action={
          <div style={{ position: "relative" }}>
            <Tooltip title="settings">
              <IconButton onClick={handleOpenMenu}>
                <MoreHorizIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <PermissionsGate permissions={["change_aqarpost"]}>
                {onEdit && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      onEdit({
                        name,
                        picture,
                        createdAt,
                        images,
                        children,
                      });
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                    <ListItemText>تعديل المنشور</ListItemText>
                  </MenuItem>
                )}
              </PermissionsGate>
              <PermissionsGate permissions={["delete_aqarpost"]}>
                {onDelete && (
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      onDelete();
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>نقل إلى سلة المهملات</ListItemText>
                  </MenuItem>
                )}
              </PermissionsGate>
              {onPreventNotifications && (
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    onPreventNotifications();
                  }}
                >
                  <ListItemIcon>
                    <NotificationsOffIcon />
                  </ListItemIcon>
                  <ListItemText>إيقاف إشعارات المنشور</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </div>
        }
        title={name}
        subheader={format(createdAt)}
        sx={{
          "& .MuiCardHeader-title": { color: "#233975" },
          "& .MuiCardHeader-subheader": {
            color: "#233975",
            fontSize: "12px",
          },
        }}
      />
      <CardContent>
        <Box
          sx={{
            padding: "0 55px",
            direction: /[a-z]/gi.test(children) ? "rtl" : "ltr",
          }}
        >
          <Typography variant="body2" color="primary">
            {children}
          </Typography>
        </Box>
      </CardContent>
      {images[0] && (
        <CardMedia
          component="img"
          image={images[0].media}
          alt="posts image"
          sx={{
            bgcolor: "black",
            objectFit: "contain",
            aspectRatio: "2 / 1",
          }}
        />
      )}
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Tooltip title="likes">
          <Button endIcon={<FavoriteIcon />}>أعجبني</Button>
        </Tooltip>
        <Tooltip title="comments">
          <Button endIcon={<ChatBubbleIcon />}>تعليقات</Button>
        </Tooltip>
      </CardActions>
      <Divider />
      <Box>
        <input
          type="text"
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "none",
            outline: "none",
            padding: "5px 15px",
          }}
          placeholder="اكتب تعليق"
        />
      </Box>
    </Card>
  );
};

export default Post;

Post.propTypes = {
  name: PropTypes.string.isRequired,
  picture: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  children: PropTypes.any,
  images: PropTypes.array,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onPreventNotifications: PropTypes.func,
};

export const PostSkeleton = () => {
  return (
    <Card
      sx={{
        maxWidth: "766px",
      }}
    >
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width={200} />}
        subheader={<Skeleton variant="text" width={100} />}
        sx={{
          "& .MuiCardHeader-title": { color: "#233975" },
          "& .MuiCardHeader-subheader": { color: "#233975", fontSize: "12px" },
        }}
      />
      <CardContent>
        <Box
          sx={{
            padding: "0 55px",
          }}
        >
          <Typography variant="body2" color="primary">
            <Skeleton variant="text" />
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
      </CardActions>
      <Divider />
      <Box>
        <Skeleton variant="rectangular" height={36} />
      </Box>
    </Card>
  );
};
