import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";

const BreakdownChart = ({ isDashboard = false, isSales, isUnit }) => {
  const { data, isLoading } = useGetSalesQuery();
  const theme = useTheme();
  console.log("Data:", data);

  if (!data || isLoading) return "Loading...";
  const selectedData = isSales ? data.salesByCategory : data.unitsByCategory;
  const formattedData = Object.entries(selectedData).map(
    ([key, value]) => ({
      id: key,
      label: key,
      value: value,
    })
  );

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.primary.main,
            },
          },
        }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        tooltip={ e => {
            const percentage = isSales ? (e.datum.value/data.yearlySalesTotal) : (e.datum.value/data.yearlyTotalSoldUnit);
            return (
                <div
                    style={{
                        background:  theme.palette.background.alt,
                        padding: '0.5rem 0.5rem',
                        border: '1px solid',
                        borderColor: theme.palette.secondary[200],
                        color: theme.palette.secondary[300],
                        fontSize: '0.8rem',
                        fontWeight: 600,
                    }}
                >
                    <div>{e.datum.label}</div>
                    <div>{isSales ? "Doanh thu: " : "Số lượng: "}{isSales ? 
                    (e.datum.value).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'}) : 
                    (e.datum.value + " Mặt hàng")}</div>
                    <div>Phần trăm: {
                        (percentage*100).toFixed(2) + "%"
                    }</div>
                </div>
            )
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: isDashboard ? 20 : 0,
            translateY: isDashboard ? 50 : 56,
            itemsSpacing: 0,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform: isDashboard
            ? "translate(-75%, -170%)"
            : "translate(-50%, -100%)",
        }}
      >
        <Typography variant="h6" fontWeight="200" textAlign="center">
          {!isDashboard && "Tổng:"} {isSales ? 
          (data.yearlySalesTotal).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'}) : 
          data.yearlyTotalSoldUnit + (isDashboard ? "" : " Mặt hàng" )}
        </Typography>
      </Box>
    </Box>
  );
};
export default BreakdownChart;