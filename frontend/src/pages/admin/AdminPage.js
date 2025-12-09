import React from 'react';
import {ChatComponent} from "../../components/chat/ChatComponent";
import "./AdminPage.css";


const AdminPage = () => {
    return (
        <div className={'admin-page'}>
            <h1>Admin Page</h1>
            <div>
                <ChatComponent/>
            </div>
        </div>
    );
};

export {
    AdminPage
};