import React, { Component, PropTypes } from 'react';
import Listing from './Listing'

class Results extends Component {

    constructor() {
        super();
    }
    
    render() {

        var min  = this.props.criteria.min,
            max  = this.props.criteria.max,
            content;

        if (!this.props.posts || !this.props.posts.length) {
            let style = {color:'#999',backgroundColor:'#fafafa',fontStyle:'italic'};
            content = (<tr style={style}><td colSpan="4">No posts to display.</td></tr>);
        } else {
            content = this.props.posts.map((post, i) => {
                /* show posts within criteria range */
                var price = parseInt(post.price);
                if ( price >= min && price <= max )
                    return <Listing key={i} post={post} />
            });
        }
        
        return (
            <table className="table is-striped">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th style={{textAlign:'right'}}>Rent</th>
                        <th>Title</th>
                        <th>Locale</th>
                        <th>Posted</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Image</th>
                        <th>Rent</th>
                        <th>Title</th>
                        <th>Locale</th>
                        <th>Posted</th>
                    </tr>
                </tfoot>
                <tbody>
                    {content}
                </tbody>
            </table>
        )
    }
}

Results.propTypes = {
  posts: PropTypes.array,
  criteria: PropTypes.object,
};

export default Results;