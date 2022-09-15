import React from "react";
import {
  Avatar,
  DialogContent,
  InputAdornment,
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

const DialogPeopleWindow = ({ searchValue, onSearch, children }) => {
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
        }}
        spacing={2}
        {...props}
      >
        <TextField
          variant="standard"
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
        {isPending && <PendingBackdrop />}
        <List
          sx={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          {children}
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
  onClick,
}) => {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        "&.Mui-selected": {
          bgcolor: "#b5b5b5",
        },
        "&.Mui-selected:hover": {
          bgcolor: "#b5b5b5",
        },
        "& .MuiListItemText-primary": {
          color: "#fff",
        },
        "& .MuiListItemText-secondary": {
          color: "#fff",
        },
      }}
    >
      {picture && (
        <ListItemAvatar>
          <Avatar src={item?.picture} sx={{ width: 40, height: 40 }} />
        </ListItemAvatar>
      )}
      {(title || body) && <ListItemText primary={title} secondary={body} />}
    </ListItemButton>
  );
};
