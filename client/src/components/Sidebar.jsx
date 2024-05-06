import React from 'react'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material'
import { AdminPanelSettings, AdminPanelSettingsOutlined, CalendarViewMonthOutlined, ChevronLeft, ChevronRightOutlined, Group, GroupOutlined, HomeOutlined, PieChartOutlineRounded, PieChartOutlineTwoTone, PointOfSale, PointOfSaleOutlined, ReceiptLongOutlined, SettingsOutlined, ShoppingBagOutlined, Today, TodayOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FlexBetween from './FlexBetween'

const Sidebar = ({ drawerWidth,
  user,
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
        nav: "/bang-quan-ly"
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
        text: "Khách hàng",
        icon: <GroupOutlined />,
        nav: "/danh-sach-khach-hang"
      },
      {
        text: "Hóa đơn",
        icon: <ReceiptLongOutlined />,
        nav: "/giao-dich-gan-day"
      },
      {
        text: "Doanh thu",
        icon: null,
        nav: null
      },
      {
        text: "Thống kê",
        icon: <PointOfSaleOutlined />,
        nav: "/thong-ke-doanh-thu"
      },
      {
        text: "Hằng ngày",
        icon: <CalendarViewMonthOutlined />,
        nav: "/hang-ngay"
      },
      {
        text: "Trong ngày",
        icon: <TodayOutlined />,
        nav: "/trong-ngay"
      },
      {
        text: "Phân tích",
        icon: <PieChartOutlineRounded />,
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

  useEffect(() => { setActive(pathname) }, [pathname]);

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
            <Box margin="1rem 0.5rem 0.5rem 0.5rem">
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
                    return ( <>
                      <Divider sx={{  
                        margin: "0rem 0rem 1rem 0rem",  
                      }} />
                      <Typography key={text} sx={{ margin: "1.5rem 0rem 1.5rem 3rem" }} variant="h7" fontWeight="bold">
                        {text}
                      </Typography>
                      </>
                    )
                  }

                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton onClick={() => {
                        setActive(nav);
                        navigate(`${nav}`);
                      }}
                        sx={{
                          //backgroundColor: active === nav ? theme.palette.secondary[300]: "transparent",
                          //color: active === nav ? theme.palette.primary[600] : theme.palette.secondary[100],
                        }}
                        selected={active === nav}>
                        <ListItemIcon sx={{
                          //color: active === nav ? theme.palette.primary.main : theme.palette.secondary[200],
                          marginLeft: "1rem"
                        }}>
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} size={"1rem"} />
                        {active === nav && <ChevronRightOutlined sx={{ margin: "0rem 2rem 0rem 0rem" }} />} 
                      </ListItemButton>
                    </ListItem>
                  )
                })}
            </List>
          </Box>
          <Box position="absolute" bottom="0rem" width= "100%">
            <Divider />
            <FlexBetween sx={{ margin: "1rem 1rem 1.5rem 1.5rem" }}> 
              <Typography variant="h7" fontWeight="bold">v1.0.0</Typography>
            </FlexBetween>
          </Box>
            
        </Drawer>
      )}
    </Box>
  )
}

export default Sidebar
