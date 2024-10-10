import React from "react";
import Header from "../components/Header/Header";
import UserLoans from '../components/UserLoans/UserLoans';
import Footer from "../components/Footer/Footer";

function User() {
    return (
        <div>
            <Header />
            <div>
                <UserLoans />
            </div>
            <Footer />
        </div>
    );
}

export default User;