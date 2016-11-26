import React, { Component, PropTypes } from 'react';

class Listing extends Component {
    render() {
        return (
            <a href={this.props.post.link}>
                <li>
                    {this.props.post.pic}&nbsp;-&nbsp;
                    {this.props.post.price}&nbsp;-&nbsp;
                    {this.props.post.title}      
                </li>
            </a>
        )
    }
}

export default Listing;