import React from "react";
import Header from "../components/Header/Header";
import AdminDashBoard from "../components/AdminDashBoard/AdminDashBoard";
import BooksDashboard from "../components/BooksDashBoard/BooksDashBoard";
import Footer from "../components/Footer/Footer";


function Admin() {
  
    return (
        <div>
            <Header />
            <div>
                <AdminDashBoard />
                <BooksDashboard />
            </div>
            <Footer />
        </div>
    );
}

export default Admin;