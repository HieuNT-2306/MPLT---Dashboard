import { DownloadOutlined, Email, EmailOutlined, PointOfSale, ReceiptLongOutlined } from '@mui/icons-material';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BreakdownChart from 'components/BreakdownChart';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import OverviewChart from 'components/OverviewChart';
import StatBox from 'components/StatBox';
import React from 'react'
import { useGetDashboardStatsQuery, useGetTransactionsQuery } from 'state/api';

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardStatsQuery();
  console.log("Dashboard", data);

  const columns = [
    // { field: 'userId.name', headerName: 'Tên khách hàng', flex: 1, valueGetter: (params) => params.row.userId.name },
    // { field: 'email', headerName: 'Email', flex: 1, valueGetter: (params) => params.row.userId.email },
    // { field: 'phonenumber', headerName: 'Số điện thoại', flex: 1, valueGetter: (params) => params.row.userId.phonenumber },
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
    // {
    //   field: 'cost', headerName: 'Tổng tiền', flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <span>{params.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
    //     )
    //   }
    // },
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
        mt='1rem'
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        height="160px"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 6",
          }
        }}
      >
        {/* Row 1 */}
        <StatBox
          title="Lượt bán hôm nay"
          value={data?.totalCustomer || 0}
          increase={10}
          icon={<ReceiptLongOutlined sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }} />}
          description="So với hôm qua"
        />

        <StatBox
          title="Doanh thu hôm nay"
          value={data?.todayData.salesTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0}
          increase={-10}
          icon={<PointOfSale sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }} />}
          description="So với hôm qua"
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Box height="40vh" width="100%" >
            <OverviewChart view="sales" isDashboard={true} />
          </Box>
        </Box>
        <StatBox
          title="Lượt bán tháng nay"
          value={data?.thisMonthData.salesUnits || 0}
          increase={-20}
          icon={<ReceiptLongOutlined sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }} />}
          description="So với tháng trước"
        />
        <StatBox
          title="Doanh thu tháng nay"
          value={data?.todayData.salesTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0}
          increase={-10}
          icon={<PointOfSale sx={{
            color: theme.palette.secondary[300],
            fontSize: "26px"
          }} />}
          description="So với tháng trươc"
        />
         <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow= "span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{color: theme.palette.secondary[100]}}>Tổng quan</Typography>
          <BreakdownChart isDashboard={true} />
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard;
