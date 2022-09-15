import React from "react";
import PropTypes from "prop-types";
import { Box, Breadcrumbs as MuiBreadcrumbs, Link } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const Breadcrumbs = ({ path }) => {
  return (
    <Box sx={{ p: "20px 0" }}>
      <MuiBreadcrumbs
        separator={<KeyboardDoubleArrowLeftIcon color="primary" />}
      >
        {Boolean(path?.length) &&
          path?.map((location, index) => (
            <Link underline="none" color="primary.main" key={index}>
              {String(location)}
            </Link>
          ))}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
};