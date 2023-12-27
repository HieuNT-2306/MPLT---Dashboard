import React, { useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetSalesQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
    const [startDate, setStartDate] = useState(new Date("2023-07-01"));
    const [endDate, setEndDate] = useState(new Date("2023-07-15"));
    const { data } = useGetSalesQuery();
    const theme = useTheme();

    const [formattedData] = useMemo(() => {
        if (!data) return [];

        const { dailyData } = data;
        const totalSalesLine = {
            id: "Doanh thu",
            color: theme.palette.secondary.main,
            data: [],
        };
        const totalUnitsLine = {
            id: "Số lượng",
            color: theme.palette.secondary[600],
            data: [],
        };
        console.log("Daily data", dailyData);
        if (dailyData) Object.values(dailyData).forEach(({ day, salesTotal, salesUnits }) => {
            const formattedDate = new Date(day);
            if (formattedDate >= startDate && formattedDate <= endDate) {
                const splitDate = day.toString().split("T")[0];

                totalSalesLine.data = [
                    ...totalSalesLine.data,
                    { x: splitDate, y: salesTotal },
                ];
                totalUnitsLine.data = [
                    ...totalUnitsLine.data,
                    { x: splitDate, y: salesUnits },
                ];
            }
        });

        const formattedData = [totalSalesLine, totalUnitsLine];
        return [formattedData];
    }, [data, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box m="0.5rem 1.5rem">
            <Header title="Doanh thu hằng ngày" subTitle="Thống kê doanh thu hằng ngày" />
            <Box height="70vh">
                <Box display="flex" justifyContent="flex-end">
                    <Box marginRight = "2rem">
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>Ngày bắt đầu:</Typography>
                        <DatePicker
                            showIcon
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </Box>
                    <Box marginRight = "6rem">
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>Ngày kết thúc:</Typography>
                        <DatePicker
                            showIcon
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                        />
                    </Box>
                </Box>

                {data ? (
                    <ResponsiveLine
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
                        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: false,
                            reverse: false
                        }}
                        yFormat=" >-.2f"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend:  'Hằng ngày',
                            legendOffset: 36,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Tổng",
                            legendOffset: -50,
                            legendPosition: 'middle'
                        }}
                        tooltip={({ point }) => {
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
                                    <div>Ngày: {point.data.x} </div>
                                    {
                                        point.serieId === "Doanh thu" ? 
                                            <div>Doanh thu: {(point.data.y*1000).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</div>   : 
                                            <div>Số lượng: {point.data.y}</div>
                                    }
                                </div>
                            )
                        }} 
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor', modifiers: [] }}
                        pointLabel={(point) => `${point.data.salesTotal}`}
                        pointLabelYOffset={12}
                        areaBaselineValue={20}
                        areaOpacity={0.25}
                        useMesh={true}
                        legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 40,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                        ]}
                    />) : "Đang tải dữ liệu..."}
            </Box>
        </Box>
    );
};

export default Daily;