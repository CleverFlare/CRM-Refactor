import React from "react";
import { Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const PicturePicker = ({
  description = "اضف صورة",
  picture = "",
  paperProps = {},
  onChange = () => {},
  error = false,
}) => {
  const [picturePath, setPicturePath] = useState("");

  const inputRef = useRef();

  const handlePaperClick = (e) => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const path = URL.createObjectURL(e.target.files[0]);
    setPicturePath(path);

    onChange(e, path);
  };

  return (
    <Paper
      {...paperProps}
      sx={{
        ...paperProps?.sx,
        position: "relative",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 1,
        width: "max-content",
        flexDirection: "column",
        overflow: "hidden",
        outline: error ? "1px solid red" : "unset",
      }}
      onClick={handlePaperClick}
    >
      <input
        type="file"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFileChange}
      />
      {Boolean(picture) && (
        <img
          src={picture}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            backgroundColor: "white",
          }}
        />
      )}
      <AddPhotoAlternateIcon color="primary" sx={{ width: 100, height: 100 }} />
      <Typography variant="caption" color="primary">
        {description}
      </Typography>
    </Paper>
  );
};

export default PicturePicker;
