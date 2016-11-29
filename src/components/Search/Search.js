import _ from 'lodash';
import fetch from '../../core/fetch';

import React, { Component, PropTypes } from 'react';
import history from '../../core/history';

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
      posts    = props.search.posts;
      criteria = props.search.criteria;
    }

    this.state = { posts, criteria, loadingPosts: true };

    this.setCriteria  = this.setCriteria.bind(this);
    this.getPosts     = this.getPosts.bind(this);
    this.buildQuery   = this.buildQuery.bind(this);
    this.graphQL      = this.graphQL.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    //
    // loads posts after initial render
    //

    this.getPosts(this.props.id)
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

  buildQuery(id) {
    //
    // builds GraphQL query
    //

    let c = this.state.criteria, params = '';
    for (let key in c) params += `${key}:"${c[key]}",`;
    
    if (id) { return `{search(${params}id:"${id}"){id}}`; } // update search
    else    { return `{posts(${params}){date,link,title,locale,price,pic,site,hood,type}}`; }
  }

  graphQL(query) {
    //
    // queries GraphQL
    //

    return fetch('/graphql', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
      credentials: 'include',
    })
    .then(resp => {
      if (resp.status !== 200) throw new Error(resp.statusText);
      return resp.json();
    })
    .catch(err => console.error(err));;
  }

  getPosts() {
    //
    // fetches posts from server
    //

    const query = this.buildQuery();
    this.setState({ loadingPosts: true });

    return this.graphQL(query)
    .then(json => {
      this.setState({ loadingPosts: false });
      return (json.data.posts || json.data.search.posts);
    });
  }

  // saveSearch() {
  //   //
  //   // instantiate new search
  //   //

  //   if (this.state.criteria)
      
  //   return;

  //   const query = this.buildQuery('search', _.merge({}, this.state.criteria, { secret: 'pass' }));

  //   return fetch('/graphql', {
  //     method: 'post',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ query: query }),
  //     credentials: 'include',
  //   })
  //   .then(resp => {
  //     if (resp.status !== 200) throw new Error(resp.statusText);
  //     return resp.json();
  //   })
  //   .then(json => {
  //     history.push(`/search?q=${json.data.search.id}`);
  //   })
  //   .catch(err => console.error(err));
  // }

  updateSearch() {
    //
    // updates existing search
    //

    if (!this.props.id) return history.push('/register', this.state.criteria);

    const query = this.buildQuery(this.props.id);

    return graphQL(query)
    .then(json => { if (!json.errors) console.log('Updated.'); })
  }

  render() {
    return (
        <div>
          <Criteria criteria={this.state.criteria} id={this.props.id} loading={this.state.loadingPosts} setCriteria={this.setCriteria} update={this.updateSearch}/>
          <Results criteria={this.state.criteria} posts={this.state.posts} />
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
