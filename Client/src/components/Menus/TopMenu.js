import React from 'react';
import {NavLink} from "react-router-dom";

const TopMenu = () => (
    <div className="navbar-uniclix">
        <a href="#" className="brand"><img src="/images/uniclix.png"/></a>

        <ul className="top-menu">
            <li><NavLink to="/manage/dashboard" activeClassName="is-active">MANAGE</NavLink></li> 
            <li><NavLink to="/scheduled" activeClassName="is-active">SCHEDULED</NavLink></li>  
            <li><NavLink to="/accounts" activeClassName="is-active">ACCOUNTS</NavLink></li>  
        </ul>

        <ul className="nav-buttons">
            <li><a href="#" className="upgrade-btn">Upgrade for more features</a></li> 
            <li><a href="#" className="top-icons"><i className="fa fa-bell"></i></a></li>  
            <li><a href="#" className="top-icons"><i className="fa fa-gear"></i></a></li>
            <li>
                <a href="#" className="compose-btn">Compose</a>
            </li>  
        </ul>
    </div>
);

export default TopMenu;