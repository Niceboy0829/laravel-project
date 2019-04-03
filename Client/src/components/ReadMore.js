import React, { Component } from 'react';
import {truncate, parseTextWithLinks} from '../utils/helpers';

class ReadMore extends Component {

    state = {
      expanded: false,
      text: "",
      length: 200
    }

    componentDidMount(){
        const { expanded } = this.state;
        const {children, characters} = this.props;
        const length = characters ? characters : 200;
        const text = expanded ? parseTextWithLinks(children) : parseTextWithLinks(truncate(children, length));

        this.setState(() => ({
            text,
            length
        }));
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.expanded !== this.state.expanded){
            const { expanded, length } = this.state;
            const {children} = this.props;
            const text = expanded ? parseTextWithLinks(children) : parseTextWithLinks(truncate(children, length));

            this.setState(() => ({
                text
            }));
        }
    }

    //function that takes in expanded and makes it the opposite of what it currently is
    toggleExpand = () => { 
        this.setState({ expanded: !this.state.expanded });
    }

    prepareHtml = () => {
        return <div dangerouslySetInnerHTML={{__html: this.state.text}}></div>
    }

    render() {
        const { expanded, length } = this.state;
        const {children} = this.props;
        
        return (
            <div>            
                {this.prepareHtml()}
                {children.length > length ?
                    <p className="linkify-text" onClick={this.toggleExpand}>{!expanded ? "Read more" : "Read less"}</p> : ""
                }
                
            </div>
        )
    }
}

export default ReadMore;