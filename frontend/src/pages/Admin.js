import React from "react";
import Header from "../components/Header/Header";
import AdminDashBoard from "../components/AdminDashBoard/AdminDashBoard";
import Footer from "../components/Footer/Footer";

function Admin() {
    return (
        <div>
            <Header />
            <AdminDashBoard />
            <Footer />
        </div>
    );
}

export default Admin;