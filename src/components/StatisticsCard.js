import React from "react";
import {
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box } from "@mui/system";

const StatisticsCard = ({
  title = "عنوان",
  number = "0000",
  percentage,
  bars,
  sx = {},
}) => {
  return (
    <Paper
      sx={{
        boxShadow: "0px 3px 10px -1px rgb(35 57 117)",
        bgcolor: (theme) => theme.palette.primary.main,
        minWidth: "210px",
        maxWidth: "280px",
        width: "100%",
        color: "white",
        ...sx,
      }}
      elevation={3}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ paddingInline: 2, paddingBlock: 1 }}
      >
        <Typography>{title}</Typography>
      </Stack>
      <Divider light />
      <Stack sx={{ p: 2, minHeight: "100px" }}>
        <Box
          sx={{ direction: "rtl", display: "flex", gap: "40px", flex: ".4" }}
        >
          {number && <Typography variant="h5">{number}</Typography>}
        </Box>
        <Box sx={{ display: "flex", flex: "4" }}>
          {bars ? (
            <Stack
              direction="row"
              sx={{ flex: "1", width: "100%" }}
              alignItems="flex-end"
              spacing={1}
            >
              {bars?.map((bar, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    bgcolor: "#0093ee",
                    borderRadius: "100vmax",
                    height: `${bar * 20}%`,
                  }}
                ></Box>
              ))}
            </Stack>
          ) : (
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                width: "100%",
                marginTop: "5px",
                bgcolor: "white",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#0093ee",
                },
              }}
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default StatisticsCard;
