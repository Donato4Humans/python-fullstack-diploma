import React from 'react';
import {ChatComponent} from "../../components/chat/ChatComponent";
import "./VenuesPage.css";


const VenuesPage = () => {
    return (
        <div className={'venues-page'}>
            <h1>Venues Page</h1>
            <div>
                <ChatComponent/>
            </div>
        </div>
    );
};

export {
    VenuesPage
};