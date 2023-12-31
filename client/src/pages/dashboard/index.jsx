import { DownloadOutlined, Email, EmailOutlined, PointOfSale, ReceiptLongOutlined } from '@mui/icons-material';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import OverviewChart from 'components/OverviewChart';
import StatBox from 'components/StatBox';
import React from 'react'
import { useGetDashboardStatsQuery } from 'state/api';

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardStatsQuery();
  console.log("Dashboard", data);

  const columns = [
    { field: 'userId.name', headerName: 'Tên khách hàng', flex: 1, valueGetter: (params) => params.row.userId.name },
    { field: 'email', headerName: 'Email', flex: 1, valueGetter: (params) => params.row.userId.email },
    { field: 'phonenumber', headerName: 'Số điện thoại', flex: 1, valueGetter: (params) => params.row.userId.phonenumber },
    {
      field: 'products', headerName: 'Số sản phẩm mua', flex: 1, sortable: false,
      renderCell: (params) => {
        return (
          <span>{params.value.length}</span>
        )
      }
    },
    {
      field: 'createdAt', headerName: 'Ngày mua', flex: 0.8,
      renderCell: (params) => {
        return (
          <span>{new Date(params.value).toLocaleDateString('vi-VN')}</span>
        )
      }
    },
    {
      field: 'cost', headerName: 'Tổng tiền', flex: 1,
      renderCell: (params) => {
        return (
          <span>{params.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        )
      }
    },
  ]
  return (
    <Box margin="0.5rem 1.5rem">
      <FlexBetween>
        <Header title="Bảng quản lý" subTitle="Thống kê tổng quan" />
        <Box>
          <Button sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.background.alt,
            fontWeight: 600,
          }}><DownloadOutlined />Tải xuống</Button>
        </Box>
      </FlexBetween>
      <Box 
        mt='2rem'
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        height="160px"
        gap="20px"
        sx = {{
          "& > div": {
            gridColumn : isNonMediumScreen ? undefined : "span 6",
          }}}
      >
        {/* Row 1 */}
        <StatBox 
          title="Lượt bán hôm nay"
          value={data?.totalCustomer || 0}
          increase={10}
          icon={<ReceiptLongOutlined sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }}/>}
          description="So với hôm qua"
        />

        <StatBox 
          title="Doanh thu hôm nay"
          value={data?.todayData.salesTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0}
          increase={-10}
          icon={<PointOfSale sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }}/>}
          description="So với hôm qua"
        />
        <StatBox 
          title="Lượt bán tháng nay"
          value={data?.thisMonthData.salesUnits || 0}
          increase={-20}
          icon={<ReceiptLongOutlined sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }}/>}
          description="So với tháng trước"
        />
        <StatBox 
          title="Doanh thu tháng nay"
          value={data?.todayData.salesTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0}
          increase={-10}
          icon={<PointOfSale sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }}/>}
          description="So với tháng trươc"
        />


      </Box>
    </Box>
  )
}

export default Dashboard;
