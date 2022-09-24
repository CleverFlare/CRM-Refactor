import React, { useState, useRef } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Menu,
  TextField,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import PropTypes from "prop-types";

const Publisher = ({
  name,
  picture,
  value,
  onChange,
  error,
  onEmoji,
  onPickPicture,
  onSubmit,
  isPending = false,
}) => {
  //----states----
  const [emojisAnchorEl, setEmojisAnchorEl] = useState(null);
  const [picturesLength, setPicturesLength] = useState(0);

  //----hooks----
  const textInputRef = useRef(null);
  const fileInputRef = useRef();

  //----variables-----
  const openEmojisList = Boolean(emojisAnchorEl);

  //----functions----
  const handleSubmit = () => {
    onSubmit();
  };

  const handlePickPicture = (e) => {
    setPicturesLength(Object.keys(e.target.files).length);
    onPickPicture(e);
  };

  return (
    <Card sx={{ maxWidth: "766px" }}>
      <CardHeader
        avatar={
          <Avatar src={picture ? picture : null}>
            {name ? name[0].toUpperCase() : ""}
          </Avatar>
        }
        title={
          <TextField
            variant="standard"
            sx={{
              width: "100%",
              "& .MuiInput-root": {
                border: "none",
                outline: "none",
              },
            }}
            placeholder={`مالذي يدور في بالك، ${name.split(" ")[0]}؟`}
            value={value}
            onChange={onChange}
            error={error}
            inputRef={textInputRef}
          />
        }
      />
      <CardActions
        sx={{ justifyContent: "space-between", paddingInline: "55px" }}
      >
        <Box sx={{ minWidth: "max-content" }}>
          <Tooltip title="add picture">
            <Badge
              overlap="circular"
              badgeContent={picturesLength}
              color="info"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <IconButton onClick={() => fileInputRef.current.click()}>
                <AddAPhotoIcon
                  color="primary"
                  style={{ transform: "scaleX(-1)" }}
                />
              </IconButton>
            </Badge>
          </Tooltip>
          <div style={{ display: "inline-block" }}>
            <IconButton onClick={(e) => setEmojisAnchorEl(e.currentTarget)}>
              <AddReactionIcon color="primary" />
            </IconButton>
            <Menu
              anchorEl={emojisAnchorEl}
              open={openEmojisList}
              onClose={(e) => setEmojisAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{
                direction: "rtl",
              }}
            >
              <Picker
                onEmojiClick={(e, selected) =>
                  onEmoji(
                    e,
                    textInputRef.current.selectionStart,
                    textInputRef.current.selectionEnd,
                    selected
                  )
                }
                disableAutoFocus={true}
                skinTone={SKIN_TONE_MEDIUM_DARK}
                groupNames={{ smileys_people: "PEOPLE" }}
              />
            </Menu>
          </div>
        </Box>
        <Button
          variant="contained"
          sx={{ minWidth: "min-content", width: 200 }}
          disableElevation
          onClick={handleSubmit}
          disabled={isPending}
        >
          إضافة
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handlePickPicture}
        />
      </CardActions>
    </Card>
  );
};

export default Publisher;

Publisher.propTypes = {
  name: PropTypes.string.isRequired,
  picture: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  onEmoji: PropTypes.func,
  onPickPicture: PropTypes.func,
  onSubmit: PropTypes.func,
};
