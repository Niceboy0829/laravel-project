import React from 'react';
import {connect} from 'react-redux';
import SweetAlert from "sweetalert2-react";
import {pinterestAppId} from "../../config/api";
import {startAddPinterestChannel, startSetChannels} from "../../actions/channels";
import channelSelector from "../../selectors/channels";
import {destroyChannel} from "../../requests/channels";
import {logout} from "../../actions/auth";
import Loader from "../../components/Loader";
import ChannelItems from "./ChannelItems";
import PinterestButton from "../PinterestButton";
import {apiUrl} from "../../config/api";

class Pinterest extends React.Component {
    constructor(props) {
        super(props);
    }

    defaultAction = {
        id: "",
        type: ""
    };

    state = {
        action: this.defaultAction,
        error: ""
    }

    setAction = (action = this.defaultAction) => {
        this.setState(() => ({
            action
        }));
    }

    onFailure = (response) => {
        console.log(response);
    };

    onSuccess = (response) => {
        if(response){
            this.props.startAddPinterestChannel(response.accessToken)
            .then(() => {
            });
        }
    };

    remove = (id) => {
        return destroyChannel(id)
        .then((response) => {
            this.props.startSetChannels()
            .then((response) => {
                if(response.length < 1){
                    this.props.logout();
                }
            });
        }).catch((error) => {

        });
    }

    render(){
        return (
            <div className="accounts-container">

                <SweetAlert
                    show={!!this.state.action.id}
                    title={`Do you wish to ${this.state.action.type} this item?`}
                    text="To confirm your decision, please click one of the buttons below."
                    showCancelButton
                    type="warning"
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                    onConfirm={() => {
                        if(this.state.action.type === 'delete'){
                            this.remove(this.state.action.id);
                        }else{
                            console.log('something went wrong');
                        }
                        this.setAction();
                    }}
                />

                <h2>HAVE PINTEREST ACCOUNTS?</h2>
                <p>Connect them all, and we'll help you get the right audience.</p>
                
                <div className="flex_container-center">
                    <div className="accounts-container__logo pinterest_color col-md-1">
                        <div>
                            <i className="fa fa-pinterest"></i>
                        </div>
                    </div>
                    <div className="accounts-container__content col-md-10">
                        <div className="accounts-container__content__wrapper">
                            <div className="accounts-container__content__wrapper__heading">
                                <h2>Let's grow your audience using Pinterest!</h2>
                            </div> 
                            
                            <ChannelItems channels={this.props.channels} setAction={this.setAction} /> 
                            {!!this.props.loading && <Loader />}
                        </div> 
            
                        <div className="accounts-container__content__wrapper__footer">
                            <PinterestButton
                                clientId={pinterestAppId}
                                redirectUri={`${apiUrl}/pinterest/callback`}
                                onSuccess={this.onSuccess} 
                                onError={() => console.log("something wrong.")}
                                cssClass="add-channel-plus-btn"
                                icon={<i className="fa fa-plus"></i>}
                                />
                            <span className="left-side-label">Have an account? Let's connect!</span>
                        </div> 
                    </div>
                </div>
              
            </div>
        );
    };
} 

const mapStateToProps = (state) => {

    const pinterestChannelsFilter = {selected: undefined, provider: "pinterest"};
    const channels = channelSelector(state.channels.list, pinterestChannelsFilter);
    return {
        channels,
        loading: state.channels.loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    startAddPinterestChannel: (accessToken) => dispatch(startAddPinterestChannel(accessToken)),
    startSetChannels: () => dispatch(startSetChannels()),
    logout: () => dispatch(logout())
});


export default connect(mapStateToProps, mapDispatchToProps)(Pinterest);