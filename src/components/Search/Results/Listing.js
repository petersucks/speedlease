import React, { Component, PropTypes } from 'react';

class Listing extends Component {
    render() {
        let pic = this.props.post.pic === 'true';
        return (
            <tr>
                <td className="is-icon">
                    <i className={pic ? "fa fa-camera-retro" : "fa fa-times"} style={!pic ? {color:'#ff3860'} : {}}></i>
                </td>
                <td style={{textAlign:'right'}}><strong>{this.props.post.price}</strong></td>
                <td><a href={this.props.post.link}>{this.props.post.title}</a></td>
                <td>{this.props.post.locale}</td>
                <td>{this.props.post.date}</td>
            </tr>
        )
    }
}

export default Listing;