import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import history from '../../core/history';
import { buildQuery, graphQL } from '../../core/query';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Search.css';

import { criteria as dc } from '../../config';

import Criteria from './Criteria/Criteria';
import Results from './Results/Results';

import roster from '../../core/roster.json';
import types from '../../core/types.json';

//
// Search results component
// -----------------------------------------------------------------------------
class Search extends Component {
  
  constructor(props) {
    super(props);

    let posts    = [],
        criteria = dc;

    if (props.search) {
      criteria = props.search.criteria;
    }

    this.state = { posts, criteria, loadingPosts: true };

    this.setCriteria  = this.setCriteria.bind(this);
    this.getPosts     = this.getPosts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    //
    // loads posts after initial render
    //

    this.getPosts()
    .then(posts => this.setState({posts}));

    // this.getPosts(this.state.criteria).then(posts => {
    //   this.setState({ posts: posts });
    // });
  }

  setCriteria(criteria) {
    //
    // sets filter criteria, loads new posts if necessary
    //

    let fetch = !(_.isEmpty(_.pick(criteria, ['site','type','hood'])));
    criteria  = _.merge(this.state.criteria, criteria);

    this.setState({criteria});
    if (fetch) this.getPosts().then(posts => this.setState({posts}));
  }

  getPosts() {
    //
    // fetches posts from server
    //

    const query = buildQuery(this.state.criteria);
    this.setState({ loadingPosts: true });

    return graphQL(query)
    .then(json => {
      this.setState({ loadingPosts: false });
      return _.compact((json.data.posts || json.data.search.posts)); // removes nulls
    });
  }

  updateSearch() {
    //
    // updates existing search
    //

    if (!this.props.id) return history.push('/register', this.state.criteria);

    const query = buildQuery(_.merge(this.state.criteria, {id: this.props.id, update: true}));
    this.setState({ loadingPosts: true });

    return graphQL(query)
    .then(json => {
      this.setState({ loadingPosts: false });
      if (!json.errors) console.log('Updated.');
    });
  }

  render() {
    let postCount = this.state.posts ? this.state.posts.length : 0;
    let info = {
      postCount
    };
    return (
        <div>
          <Criteria
            criteria={this.state.criteria}
            id={this.props.id}
            info={info}
            loading={this.state.loadingPosts}
            setCriteria={this.setCriteria}
            update={this.updateSearch} />
          <Results
            criteria={this.state.criteria}
            posts={this.state.posts} />
        </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object,
  posts: PropTypes.array,
  id: PropTypes.string,
};

export default withStyles(s)(Search);
