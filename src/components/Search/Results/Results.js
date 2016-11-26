import React, { Component, PropTypes } from 'react';
import Listing from './Listing'

class Results extends Component {

    constructor() {
        super();
    }
    
    render() {

        var min  = this.props.criteria.min,
            max  = this.props.criteria.max;
        
        return (
            <ul>
                {this.props.posts.map((post, i) => {
                    /* show posts within criteria range */
                    var price = parseInt(post.price);
                    if ( price >= min && price <= max )
                        return <Listing key={i} post={post} />
                })}
            </ul>
        )
    }
}

Results.propTypes = {
  posts: PropTypes.array,
  criteria: PropTypes.object,
};

export default Results;