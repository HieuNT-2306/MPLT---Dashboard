import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import Dashboard  from "pages/dashboard";
import Products from "pages/products";
import Customers from "pages/customers";
import Layout from "pages/layout";
import Transaction from "pages/transactions";
import Overview from "pages/overview";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  //set up material ui theme
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/bang-quan-ly" replace />} />
              <Route path="/bang-quan-ly" element={<Dashboard />} />
              <Route path="/san-pham" element={<Products />} />
              <Route path="/danh-sach-khach-hang" element={<Customers />} />
              <Route path="/giao-dich-gan-day" element={<Transaction />} />
              <Route path="/thong-ke-doanh-thu" element={<Overview />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
