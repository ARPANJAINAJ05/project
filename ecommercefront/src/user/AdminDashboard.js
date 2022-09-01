import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
 

const AdminDashboard=()=>{
    const {user:{_id,name,email,role}}=isAuthenticated();
    const adminInfo=()=>{
        return (
            <div className="card mb-5">
            <h3 className="card-header">Admin Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">{role===1?"Admin":"Registered User"}</li>
                <li className="list-group-item">{_id}</li>
            </ul>
        </div>
        )
    }
    const adminLinks=()=>{
        return (
            <div className="card mb-5">
            <h3 className="card-header">Admin Links</h3>
            <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/create/category">Create Category</Link>
                </li>
                <li className="list-group-item">
                <Link to="/create/product">Create Product</Link>
               </li>
               <li className="list-group-item">
                <Link to="/admin/orders">View Orders</Link>
               </li>
               <li className="list-group-item">
                <Link to="/admin/products">Manage Products</Link>
               </li>
            </ul>
        </div>
        )
    }
    return (
        <Layout title="Dashoard" description={`Good Day ${name}!`} className="container-fluid">
         <div className="row">
             <div className="col-3">
                 {adminLinks()}
             </div>
             <div className="col-9">
                 {adminInfo()}
                 
             </div>
         </div>

           

        </Layout>
    )
}
export default AdminDashboard