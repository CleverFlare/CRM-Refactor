import React, { useState } from "react";
import { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useAfterEffect from "../hooks/useAfterEffect";

const DropBox = ({
  sx = {},
  files,
  buttonLabel = "رفع الملف",
  isPending,
  title = "قم بالسحب والإفلات هنا",
  onDrag = () => {},
  onClick = () => {},
}) => {
  const [isDropHovered, setIsDropHovered] = useState(false);

  const handlePreventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Paper
      sx={{
        bgcolor: "#f5f6fa",
        maxWidth: 600,
        width: "100%",
        ...sx,
      }}
    >
      <Stack spacing={2}>
        <Paper
          variant="outlined"
          sx={{
            borderStyle: "dashed",
            borderWidth: "3px",
            bgcolor: isDropHovered ? "#ccced7" : "#f5f6fa",
            cursor: "default",
            position: "relative",
            margin: 2,
          }}
        >
          <Box
            sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
            onDrag={handlePreventDefault}
            onDragStart={handlePreventDefault}
            onDragEnd={handlePreventDefault}
            onDragOver={handlePreventDefault}
            onDragExit={handlePreventDefault}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDropHovered(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDropHovered(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDropHovered(false);
              onDrag(e);
            }}
          />
          <Stack
            sx={{
              width: "100%",
              paddingBlock: 10,
            }}
            justifyContent="center"
            alignItems="center"
            spacing={5}
          >
            <BackupOutlinedIcon
              sx={{
                width: 100,
                height: 100,
              }}
              color="primary"
            />
            <Typography
              variant="h5"
              color="neutral.main"
              sx={{ textAlign: "center" }}
            >
              {title}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ width: 150, height: 50 }}
              disabled={isPending}
              onClick={onClick}
            >
              {buttonLabel}
            </Button>
          </Stack>
        </Paper>
        {files && <Stack divider={<Divider />}>{files}</Stack>}
      </Stack>
    </Paper>
  );
};

export default DropBox;

export const ProgressCard = ({
  picture = "",
  progress = 0,
  size = "428kb",
}) => {
  return (
    <Card
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        position: "relative",
      }}
    >
      <CardHeader
        avatar={<Avatar src={picture} />}
        title={
          <Typography sx={{ color: "#7884a0" }}>
            {progress >= 100 ? `تم` : `الرجاء الإنتظار`}
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            sx={{ color: "#a1a9bf", marginBlock: "5px" }}
          >
            {size}kb
          </Typography>
        }
        action={
          progress >= 100 ? (
            <CheckCircleIcon sx={{ color: "#687ddb" }} size="large" />
          ) : (
            <CancelIcon sx={{ color: "#ff6464" }} size="large" />
          )
        }
        sx={{
          "& .MuiCardHeader-action": {
            margin: 0,
            alignSelf: "unset",
            display: "flex",
            alignItems: "center",
            transform: "scale(1.2)",
          },
        }}
      />
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          top: 0,
          right: "100px",
          pointerEvents: "none",
          color: "#23397542",
          visibility: progress >= 100 ? "hidden" : "visible",
          opacity: progress >= 100 ? "0" : "1",
        }}
      >
        {progress}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          backgroundColor: "transparent",
          "& .MuiLinearProgress-bar1Determinate": {
            bgcolor: "#23397542",
          },
          "& .MuiLinearProgress-bar1Determinate": {
            bgcolor: "#23397542",
          },
          visibility: progress >= 100 ? "hidden" : "visible",
          opacity: progress >= 100 ? "0" : "1",
        }}
      />
    </Card>
  );
};
