import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import channelSelector from '../selectors/channels';
import {setPost, setPostedArticle} from "../actions/posts";
import SelectChannelsModal from './SelectChannelsModal';
import DraftEditor from './DraftEditor';
import PublishButton from './PublishButton';

class TailoredPostModal extends React.Component{

    state = {
        publishChannels: this.props.channels,
        selectChannelsModal: false,
        draftEditorModal: false,
        content: "",
        pictures: [],
        restricted: false,
        network: ""
    };

    componentDidUpdate(prevProps) {

        if(prevProps.channels !== this.props.channels){
            this.setState(() => ({
                publishChannels: this.props.channels
            }));
        }
    }

    toggleSelectChannelsModal = () => {

        if(this.state.selectChannelsModal){
            localStorage.setItem('publishChannels', JSON.stringify(this.state.publishChannels));
        }

        this.setState(() => ({
            selectChannelsModal: !this.state.selectChannelsModal
        }));
    };

    toggleDraftEditorModal = (network = "") => {
        
        let content = `${this.props.title}  ${this.props.source}`;
        let pictures = [];

        if(network == "facebook"){
            content = ` ${this.props.source}`;
        }

        this.setState(() => ({
            draftEditorModal: !this.state.draftEditorModal,
            network,
            content,
            pictures
        }));
    };

    updateContent = (content = "") => {
        this.setState(() => ({
            content: content,
            letterCount: content.length
        }));
    };

    updatePictures = (pictures = []) => {
        this.setState(() => ({
            pictures: pictures
        }));
    };

    onChannelSelectionChange = (obj) => {

        const publishChannels = this.state.publishChannels.map((channel) => {
            if(channel.id === obj.id){
                return {
                    ...channel,
                    selected: channel.selected ? 0 : 1
                }
            }
            else{
        
                if(obj.type == "twitter" && channel.type == "twitter"){
                    return {
                        ...channel,
                        selected:0
                    }
                }else{
                    return {
                        ...channel
                    };
                }
            }
        });

        this.setState(() => ({
            publishChannels
        }));
    };

    publish = (scheduled, publishType) => {

    };

    render(){
        const {title, image, source, description, isOpen, toggleTailoredPostModal} = this.props;
        const selectedChannels = channelSelector(this.state.publishChannels, {selected: true, provider: undefined});
        return  (
                    <Modal 
                    isOpen={isOpen}
                    ariaHideApp={false}
                    className="tailored-post-wrapper modal-animated-dd"
                    closeTimeoutMS={300}
                    >   
                        <Modal isOpen={this.state.selectChannelsModal} ariaHideApp={false} className="modal-no-bg">
                            <SelectChannelsModal 
                            channels={this.state.publishChannels} 
                            onChange={this.onChannelSelectionChange}
                            toggle={this.toggleSelectChannelsModal}/>
                        </Modal>

                        <Modal isOpen={this.state.draftEditorModal} ariaHideApp={false} closeTimeoutMS={300} className="modal-bg-radius">
                            <DraftEditor 
                                onChange={this.updateContent}
                                onImagesChange={this.updatePictures}
                                content={this.state.content}
                                pictures={this.state.pictures}
                                toggle={this.toggleDraftEditorModal}
                                onDone={this.toggleDraftEditorModal}
                                inclusive={true}
                            />
                        </Modal>

                        <div className="tailored-post-container">
                            <div className="tailored-post-content">
                                <TailoredPostCard 
                                    network="twitter"
                                    title={title}
                                    image={image}
                                    source={source}
                                    selectedChannels={selectedChannels}
                                    onOverlayClick={this.toggleSelectChannelsModal}
                                    onEditClick={this.toggleDraftEditorModal}
                                />

                                <TailoredPostCard 
                                    network="facebook"
                                    title={title}
                                    image={image}
                                    source={source}
                                    selectedChannels={selectedChannels}
                                    onOverlayClick={this.toggleSelectChannelsModal}
                                    onEditClick={this.toggleDraftEditorModal}
                                />

                            </div>
                            <div className="tailored-post-bottom flex-center">
                                <div className="tailored-post-bottom-content flex-center-h">

                                    <ul className="compose-header">
                                        <li onClick={this.toggleSelectChannelsModal} className="add-new-channel"><i className="fa fa-plus"></i></li>

                                        {!!this.state.publishChannels.length && channelSelector(this.state.publishChannels, {selected: true, provider: undefined}).map((channel) => (
                                            <li key={channel.id} className="channel-item">
                                                <div className="remove-overlay fa fa-close" onClick={() => this.onChannelSelectionChange(channel)}></div>
                                                <img src={channel.avatar}/>
                                            </li>
                                        ))}

                                    </ul>
                                    <PublishButton 
                                        action={this.publish} 
                                        onChange={this.updateScheduledLabel}
                                        restricted={this.state.restricted}
                                    />

                                </div>

                            </div>
                        </div>
                        <div className="tailored-post-close flex-center-h">
                            <button className="btn tailorCloseBtn" onClick={() => toggleTailoredPostModal({})}>
                                <i className="fa fa-close"></i>
                            </button>
                        </div>
                    </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    const channels = channelSelector(state.channels.list, {selected: undefined, provider: undefined, publishable: true});

    return {
        channels
    }
};

const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setPostedArticle: (article) => dispatch(setPostedArticle(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(TailoredPostModal);

const TailoredPostCard = ({network, title, image, source, selectedChannels, onOverlayClick, onEditClick}) => (
    <div className="tailored-post-card">

    <div className="tailored-post-card-content">
            <div onClick={() => onEditClick(network)} className="tailored-post-preview">

                <div className="tailored-post-preview__header">
                    <i className={ `socialIcon fa fa-${network} ${network}_bg`}></i>
                    <div>
                        <div className="social-preview-title">{network} preview</div>
                        <div className="small-blurry-text">small text here</div>
                    </div>
                </div>

                {network == "facebook" ?
                    <div className="social-body-text-suggestion">
                        Click here to add text
                    </div>
                    :
                    <div className="social-body-text">
                        {title}
                    </div>
                }
                <div className="tailored-post-preview-body">
                    <img src={image}/>
                    <div className="tailoredPost__previewCardWrapper__link__text">
                        <div className="tailoredPost__previewCardWrapper__link__title">{title}</div>
                        <div className="tailoredPost__previewCardWrapper__link__domain">{source}</div>
                    </div>
                </div>
            </div>

            {!(!!channelSelector(selectedChannels, {selected: undefined, provider: network}).length) &&
                <div onClick={onOverlayClick} className="tailored-post-overlay flex-center-v">
                
                    <div>
                        <div className="flex-center-h">
                            <i className={`overlaySocialIcon fa fa-${network} ${network}_color`}></i>
                        </div>
                        <div className="flex-center-h center-inline p10">
                            Let's reach more people by posting on {network}
                        </div>
                        <div className="flex-center-h">
                            <button className={`connectButton btn ${network}_bg normalizeText`}>Add {network}</button>
                        </div>
                    </div>

                </div>
            }
        </div>
    </div>
);
