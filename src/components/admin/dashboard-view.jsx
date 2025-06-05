import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import { useNavigate } from "react-router-dom";

const DashboardView = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside />
      </div>
      
      <div>
        
      </div>
    </div>
  );
};

export default DashboardView;