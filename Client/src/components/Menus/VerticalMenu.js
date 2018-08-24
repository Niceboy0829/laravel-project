import React from 'react';
import {NavLink} from "react-router-dom";

const VerticalMenu = ({ menuItems }) => {
    return (
        <div>
            <aside className="vertical-menu gradient-background-teal-blue">

                <div className="btn-group">
                    <ProfileInfo />
                    <ProfileSelectionDropDown />
                </div>
        
                <MenuItems menuItems={ menuItems } />
                <SupportSection />
            </aside>
        </div>
    );
};

const ProfileInfo = () => (
    <div className="user-dropdown dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <div className="profile-info pull-right">
            <img className="pull-left" src="" />
            <div className="pull-left">
                <p className="profile-name">Albert Feka</p>
                <p className="profile-username">anime.masters89</p>
            </div>
            <div className="pull-right down-arrow">
                <i className="fa fa-angle-down"></i>
            </div>
        </div>
    </div>
);

const ProfileSelectionDropDown = () => (
    <div className="dropdown-menu select-channel">
        <div className="channel-container">
            <a href="#" className="block-urls">
                <div className="profile-info pull-right">
                    <img className="pull-left" src="" />
                    <div className="pull-left">
                        <p className="profile-name">Albert Feka</p>
                        <p className="profile-username">anime.masters89</p>
                    </div>
                </div>
            </a>
        </div>
        <button className="add-channel-btn block-urls">Add new channel</button>
    </div>
);

const MenuItems = ({ menuItems }) => (
    <ul className="v-menu-links clear-both">
        {menuItems.map((item) => (
            <li key={item.id}><NavLink className="links" to={item.uri}>{item.displayName}</NavLink></li>
        ))}
    </ul>
);

const SupportSection = () => (
    <div className="support">
        <div>
            <a href="mailto:info@oda-lab.com?Subject=The%20sky%20is%20falling!"><i className="fa fa-comment"></i> SUPPORT</a>
        </div>
    </div>
);

export default VerticalMenu;