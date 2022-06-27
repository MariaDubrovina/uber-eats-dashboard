import OrdersPage from "../../pages/OrdersPage";
import OrderDetailsPage from "../../pages/OrderDetailsPage";
import { Routes, Route } from "react-router-dom";
import MenuPage from "../../pages/MenuPage";
import OrdersHistoryPage from "../../pages/OrdersHistoryPage";
import CreateMenuItem from "../../pages/CreateMenuItem";
import SettingsPage from "../../pages/SettingsPage";
import UpdateMenuItem from "../../pages/UpdateMenuItem";



function AppRoutes() {
  return (
    
         <Routes>
          <Route path="/" element={<OrdersPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="history" element={<OrdersHistoryPage />} />
          <Route path="menu/create" element={<CreateMenuItem />} />
          <Route path="menu/update/:id" element={<UpdateMenuItem />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
       
  );
}

export default AppRoutes;
