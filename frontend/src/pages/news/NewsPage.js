import React from 'react';
import {ChatComponent} from "../../components/chat/ChatComponent";
import "./NewsPage.css";


const NewsPage = () => {
    return (
        <div className={'news-page'}>
            <h1>News Page</h1>
            <div>
                <ChatComponent/>
            </div>
        </div>
    );
};

export {
    NewsPage
};