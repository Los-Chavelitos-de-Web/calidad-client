import { useEffect, useState } from "react";
import AdminAside from "./template/AdminAside";
import './admin-css/admin.css';
import './admin-css/ProductsDetaills.css';
import { useNavigate } from "react-router-dom";

const UserView = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside/>
      </div>
        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis hic explicabo atque laboriosam consequatur voluptate quos amet libero iusto rem dolores molestiae, sunt alias distinctio impedit, molestias minus corrupti beatae!</span>
    </div>
  );
};

export default UserView;