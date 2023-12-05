import React from 'react'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material'
import { AdminPanelSettings, AdminPanelSettingsOutlined, BarChartOutlined, CalendarViewMonthOutlined, ChevronLeft, Group, GroupOutlined, HomeOutlined, PointOfSale, PointOfSaleOutlined, ReceiptLongOutlined, SettingsOutlined, ShoppingBagOutlined, Today, TodayOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FlexBetween from './FlexBetween'

const Sidebar = ({ drawerWidth,
  isSideBarOpen,
  setIsSideBarOpen,
  isNonMobile }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const navItems = [
    {
      text: "Bảng quản lý",
      icon: <HomeOutlined />,
      nav: "/"
    },
    {
      text: "Khách hàng",
      icon: null,
      nav: null
    },
    {
      text: "Sản phẩm",
      icon: <ShoppingBagOutlined />,
      nav: "/san-pham"
    },
    {
      text: "Danh sách khách hàng",
      icon: <GroupOutlined />,
      nav: "/danh-sach-khach-hang"
    },
    {
      text: "Giao dịch gần đây",
      icon: <ReceiptLongOutlined />,
      nav: "/giao-dich-gan-day"
    },
    {
      text: "Doanh thu",
      icon: null,
      nav: null
    },
    {
      text: "Thống kê doanh thu",
      icon: <PointOfSaleOutlined />,
      nav: "/thong-ke-doanh-thu"
    },
    {
      text: "Hằng ngày",
      icon: <TodayOutlined />,
      nav: "/hang-ngay"
    },
    {
      text: "Hằng tháng",
      icon: <CalendarViewMonthOutlined />,
      nav: "/hang-thang"
    },
    {
      text: "Phân tích doanh thu",
      icon: <BarChartOutlined />,
      nav: "/phan-tich-doanh-thu"
    },
    {
      text: "Quản lý",
      icon: null,
      nav: "/quan-ly"
    },
    {
      text: "Tài khoản",
      icon: <AdminPanelSettingsOutlined />,
      nav: "/tai-khoan"
    },
    {
      text: "Cài đặt giao diện",
      icon: <SettingsOutlined />,
      nav: "/cai-dat-giao-dien"
    }
  ]

  useEffect(() => { setActive(pathname.substring(1)) }, [pathname]);

  return (
    <Box component="nav">
      {isSideBarOpen && (
        <Drawer
          open={isSideBarOpen}
          onClose={() => setIsSideBarOpen(false)}
          variant='persistent'
          anchor='left'
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "1px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box margin="1rem 1rem 1.5rem 1.5rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h5" fontWeight="bold">Mỹ Phẩm Lan Thư</Typography>
                </Box>
                {isNonMobile && (<IconButton onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                  <ChevronLeft />
                </IconButton>)}
              </FlexBetween>
            </Box>
            <List>
              {
                navItems.map(({ text, icon, nav }, index) => {
                  if (!icon) {
                    return (
                      <Typography key={text} sx={{ margin: "2rem 0rem 1.5rem 3rem" }} variant="h7" fontWeight="bold">
                        {text}
                      </Typography>
                    )
                  }

                  const lcText = text.toLowerCase().replaceAll(" ", "-");

                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton onClick={() => {
                        setActive(lcText);
                        navigate(`${nav}`);
                      }}
                        sx={{
                          backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                          color: active === lcText ? theme.palette.primary.main : theme.palette.secondary[100],
                        }}
                        selected={active === lcText}>
                        <ListItemIcon sx={{
                          color: active === lcText ? theme.palette.primary.main : theme.palette.secondary[200],
                          marginLeft: "1rem"
                        }}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {active === lcText && <Divider sx={{ margin: "0rem 2rem 0rem 0rem" }} />} 
                      </ListItemButton>
                    </ListItem>
                  )
                })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  )
}

export default Sidebar
