import React from 'react';
import BookList from '../components/BooksList/BookList'; 
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function Glossary() {
    return (
        <div>
            <Header />
            <BookList />
            <Footer />
        </div>
    );
}

export default Glossary;
