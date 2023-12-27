import { useTheme } from '@mui/material';
import React, { useMemo } from 'react'
import { useGetSalesQuery } from 'state/api';
import { ResponsiveLine } from '@nivo/line';


const OverviewChart = ({
  isDashboard = false,
  view
}) => {
  const theme = useTheme();
  const { data, isLoading } = useGetSalesQuery();
  console.log("Overall", data);
  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return [];
    const { monthlyData } = data;
    console.log("Monthly data", monthlyData);
    const totalSalesLine = {
      id: 'Doanh thu',
      color: theme.palette.secondary.main,
      data: []
    }
    const totalUnitsLine = {
      id: 'Số lượng',
      color: theme.palette.secondary[600],
      data: []
    }
    Object.values(monthlyData).reduce((acc, { month, salesTotal, salesUnits }) => {
      const curSales = salesTotal;
      const curUnits = salesUnits;
      totalSalesLine.data = [...totalSalesLine.data, {
        x: month,
        y: curSales
      }];
      totalUnitsLine.data = [...totalUnitsLine.data, {
        x: month,
        y: curUnits
      }]
      return { sales: curSales, unit: curUnits };
    }, { sales: 0, units: 0 })
    return [[totalSalesLine], [totalUnitsLine]];
  }, [data]);

  if (!data || isLoading) return "Đang tải...";
  return (
    <ResponsiveLine
      data={view === 'sales' ? totalSalesLine : totalUnitsLine}
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
      margin={{ top: 10, right: 110, bottom: 70, left: 60 }}
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
        legend: isDashboard ? "" : 'Tháng',
        legendOffset: 36,
        legendPosition: 'middle'
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : (view === 'sales' ? 'Doanh thu' : 'Số lượng mặt hàng bán ra'),
        legendOffset: -50,
        legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor', modifiers: [] }}
      pointLabelYOffset={-12}
      areaBaselineValue={20}
      areaOpacity={0.25}
      useMesh={true}
      tooltip={isDashboard ? null : ({ point }) => {
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
                <div>Tháng: {point.data.x} </div>
                {
                    point.serieId === "Doanh thu" ? 
                        <div>Doanh thu: {(point.data.y*1000).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</div>   : 
                        <div>Số lượng: {point.data.y}</div>
                }
                
            </div>
        )
    }}
      legends={[
        isDashboard ? {} :
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 30,
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
    />
  )
}

export default OverviewChart
