import React from 'react';
import {ChatComponent} from "../../components/chat/ChatComponent";
import "./SearchPage.css";


const SearchPage = () => {
    return (
        <div className={'search-page'}>
            <h1>Search Page</h1>
            <div>
                <ChatComponent/>
            </div>
        </div>
    );
};

export {
    SearchPage
};