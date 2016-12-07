import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// TODO: Clean up styling below

class Listing extends Component {
    render() {
        let pics = this.props.post.pics === 'true',
            age = moment(this.props.post.date).from(moment());
        return (
            <tr>
                <td className="is-icon">
                    <i className={pics ? "fa fa-camera-retro" : "fa fa-times"} style={!pics ? {color:'#ff3860'} : {}}></i>
                </td>
                <td style={{textAlign:'right'}}><strong>{this.props.post.price}</strong></td>
                <td><a href={this.props.post.link}>{this.props.post.title}</a></td>
                <td>{this.props.post.locale}</td>
                <td style={{minWidth:'120px'}}><strong>{age}</strong></td>
            </tr>
        )
    }
}

Listing.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Listing;