import React from 'react';
import {Modifier, EditorState} from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-mention-plugin/lib/plugin.css';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import ImageUploader from 'react-images-browse/src/component/compiled';
import moment from "moment";
import hashtagSuggestionList from '../fixtures/hashtagSuggestions';


class DraftEditor extends React.Component{

    imageIcon = React.createRef();

    constructor(props){
        super(props);
        if(typeof(emojiPlugin) === "undefined"){
            this.emojiPlugin = createEmojiPlugin();
            this.hashtagMentionPlugin = createMentionPlugin({
                mentionPrefix: "#",
                mentionTrigger: "#"
            });
        }
    }

    defaultPost = {
        id: "",
        content: "", 
        type: "store",
        images: [],
        scheduled_at: moment(),
        scheduled_at_original: moment()
    };
    
    state = {
        editorState: createEditorStateWithText(this.props.content),
        hashtagSuggestions: hashtagSuggestionList,
        letterCount: 0,
        pictures: this.props.pictures
    };


    focus = () => {
        this.editor.focus();
    };

    onChange = (editorState) => {

        const text = editorState.getCurrentContent().getPlainText();

        this.setState(() => ({
            editorState,
            letterCount: text.length
        }), this.props.onChange(text));
    };

    onDrop = (pictures, pictureDataUrls) => {
        this.setState((prevState) => {
            if(prevState.pictures !== pictures){

                this.props.onImagesChange(pictureDataUrls);
                return {
                    pictures: pictureDataUrls
                }
            }
        });
    };

    onImageIconClick = () => {
        this.imageIcon.current.
        inputElement.
        previousSibling.
        click();
    };

    onHashIconClick = () => {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const ncs = Modifier.insertText(contentState, selection, "#");
        const es = EditorState.push(editorState, ncs, 'insert-fragment');
        this.setState(() => ({
            editorState: es
        }), () => this.focus());
    };

    onHashtagSearchChange = ({ value }) => {
        this.setState(() => ({
            hashtagSuggestions: defaultSuggestionsFilter(value, hashtagSuggestionList)
        }));
    };

    onAddMention = (mention) => {
        //console.log('mention', mention)
    };

    render(){

        const emojiPlugin = this.emojiPlugin;
        const hashtagMentionPlugin = this.hashtagMentionPlugin;

        const { EmojiSuggestions, EmojiSelect} = emojiPlugin;
        const { MentionSuggestions: HashtagSuggestions } = hashtagMentionPlugin;
        const plugins = [emojiPlugin, hashtagMentionPlugin];
        const {scheduledLabel, inclusive, toggle, onDone} = this.props;

        return(
            <div>

                {inclusive &&
                    <div className="modal-header">
                            <button type="button" id="closeModal" onClick={toggle} className="close fa fa-times-circle" data-dismiss="modal"></button>
                            <h4>Editing</h4>
                    </div>
                }

                <div className="modal-body">
                    <form id="draft_form">
                        <div>
                            <div className="editor" onClick={this.focus}>

                                {scheduledLabel}

                                <Editor
                                    editorState={this.state.editorState}
                                    onChange={this.onChange}
                                    plugins={plugins}
                                    placeholder="What's on your mind?"
                                    ref={(element) => { this.editor = element; }}
                                />
                                <ImageUploader
                                    withIcon={false}
                                    buttonText=''
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                    withLabel={false}
                                    buttonClassName='dnone'
                                    ref={this.imageIcon}
                                    defaultImages={this.state.pictures}
                                />

                                <EmojiSuggestions />
                                <HashtagSuggestions
                                    onSearchChange={this.onHashtagSearchChange}
                                    suggestions={this.state.hashtagSuggestions}
                                    onAddMention={this.onAddMention}
                                    onClose={() => this.setState({ ...this, suggestions: hashtagSuggestionList })}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="editor-icons">
                    <i onClick={this.onImageIconClick} className="fa fa-image upload-images"></i>
                    {/* <i className="fa fa-map-marker add-location"></i> */}
                    <EmojiSelect />
                    <i onClick={this.onHashIconClick} className="fa fa-hashtag add-hashtag"></i>
                </div>

                {inclusive && 
                    <div className="modal-footer" style={{position:"relative"}}>
                    
                        <p className={`letter-count pull-left ${this.state.letterCount > 280 ? 'red-txt' : ''}`}>{this.state.letterCount}</p>

                        <button onClick={toggle} className="upgrade-btn pull-right">Done</button>
                    </div>
                }
            </div>
        );
    }
}


export default DraftEditor;