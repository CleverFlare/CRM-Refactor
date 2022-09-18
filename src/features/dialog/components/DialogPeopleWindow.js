import React from "react";
import {
  Avatar,
  Box,
  DialogContent,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PendingBackdrop from "../../../components/PendingBackdrop";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
import EmptyBox from "../../../svg/EmptyBox";

const DialogPeopleWindow = ({
  searchValue,
  onSearch,
  isPending = false,
  hideSearch = false,
  children,
  sx = {},
  ...props
}) => {
  return (
    <DialogContent>
      <Stack
        sx={{
          border: "1px solid #ffffff6e",
          borderRadius: 2,
          p: 2,
          boxShadow: "0 0 20px #ffffff6e",
          overflow: "hidden",
          position: "relative",
          ...sx,
        }}
        spacing={2}
        {...props}
      >
        {hideSearch && (
          <TextField
            variant="standard"
            className="DialogPeopleWindow__searchInput"
            sx={{
              width: "100%",
              "& .MuiInputBase-root": { bgcolor: "white" },
            }}
            placeholder="بحث"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ paddingInline: "5px" }}>
                  <SearchIcon sx={{ opacity: ".5" }} />
                </InputAdornment>
              ),
            }}
            value={searchValue}
            onChange={onSearch}
          />
        )}
        {isPending && <PendingBackdrop />}
        <List
          className="DialogPeopleWindow__listWrapper"
          sx={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          {Object.keys(children).length ? (
            children
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmptyBox sx={{ opacity: 0.2, width: 200, height: 200 }} />
            </Box>
          )}
        </List>
      </Stack>
    </DialogContent>
  );
};

export default DialogPeopleWindow;

export const DialogSelectItem = ({
  selected,
  picture,
  title,
  body,
  subtitle,
  onClick = null,
  sx = {},
}) => {
  const content = (
    <>
      {picture && (
        <ListItemAvatar className="DialogSelectItem__avatar">
          <Avatar src={picture} sx={{ width: 40, height: 40 }} />
        </ListItemAvatar>
      )}
      {(title || body) && (
        <ListItemText
          className="DialogSelectItem__text"
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>{title}</Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
                {subtitle}
              </Typography>
            </Box>
          }
          secondary={body}
        />
      )}
    </>
  );

  return (
    <>
      {onClick ? (
        <ListItemButton
          selected={selected}
          onClick={onClick}
          sx={{
            borderRadius: 2,
            "&.Mui-selected": {
              bgcolor: "#6e86c7",
            },
            "&.Mui-selected:hover": {
              bgcolor: "#6e86c7",
            },
            "& .MuiListItemText-primary": {
              color: "#fff",
            },
            "& .MuiListItemText-secondary": {
              color: "#fff",
            },
            ...sx,
          }}
        >
          {content}
        </ListItemButton>
      ) : (
        <ListItem
          sx={{
            "& .MuiListItemText-primary": {
              color: "#fff",
            },
            "& .MuiListItemText-secondary": {
              color: "#fff",
            },
            ...sx,
          }}
        >
          {content}
        </ListItem>
      )}
    </>
  );
};
