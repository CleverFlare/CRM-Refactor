import React from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/system";
import Breadcrumbs from "../../components/Breadcrumbs";
import Wrapper from "../../components/Wrapper";
import StatisticsCard from "../../components/StatisticsCard";

const Overview = () => {
  return (
    <Box>
      <Wrapper>
        <Breadcrumbs path={["العملاء", "الإحصائيات"]} />
        <Stack direction="row" justifyContent="space-evenly">
          <StatisticsCard
            title="جميع العملاء"
            since="منذ يوم"
            number={324}
            percentage={100}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="الموظفين الجدد"
            since="منذ اسبوع"
            number={234}
            bars={[5, 4, 2, 4, 2, 3, 5, 1, 3]}
            sx={{ width: "100%" }}
          />
          <StatisticsCard
            title="العملاء الجدد"
            since="اكتساب"
            number={234}
            percentage={50}
            sx={{ width: "100%" }}
          />
        </Stack>
      </Wrapper>
    </Box>
  );
};

export default Overview;
