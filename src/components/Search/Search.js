import _ from 'lodash';
import fetch from '../../core/fetch';

import React, { Component, PropTypes } from 'react';
import history from '../../core/history';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Search.css';

import Criteria from './Criteria/Criteria'
import Results from './Results/Results'

const roster = require('../../spiders/roster.json'),
      types  = require('../../spiders/types.json');

//
// Search results component
// -----------------------------------------------------------------------------

const defaultCriteria = {
        site: roster['sfbay'].short,
        type: types['roo'].short,
        hood: roster['sfbay']['hoods']['sfc'].short,
        min:  0,
        max:  3000
      };

class Search extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      posts:    [],
      // use search retrieved with URL param "q",
      // or set to default
      criteria: props.search
                ? props.search.criteria
                : defaultCriteria
    }

    this.setCriteria  = this.setCriteria.bind(this);
    this.getPosts     = this.getPosts.bind(this);
    this.saveSearch   = this.saveSearch.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  componentDidMount() {
    //
    // loads posts after initial render
    //

    this.getPosts(this.state.criteria).then(posts => {
      this.setState({ posts: posts });
    });
  }

  setCriteria(updates) {
    //
    // sets filter criteria, loads new posts if necessary
    //

    let criteria = this.state.criteria,
        fetch    = false;
    
    // update this.state.criteria
    for (let key in updates) {
      if (['site', 'type', 'hood'].indexOf(key) > -1) fetch = true;

      // set as shorthand, or fall back to number if min/max
      criteria[key] = updates[key].short || updates[key];
    }
    
    if (fetch) {
      // get new posts and set criteria
      this.getPosts(criteria).then(posts => {
        this.setState({
          posts:    posts,
          criteria: criteria
        });
      });

    } else {

      // otherwise just update min/max filter
      this.setState({
        criteria: criteria
      });
    }
  }

  buildQuery(type, c) {
    //
    // builds GraphQL query
    //

    var params = '';
    for (let key in c) { params += `${key}:"${c[key]}",`; }

    switch (type) {
      case 'posts':
        return `{posts(${params}){date,link,title,price,pic,site,hood,type}}`;
      case 'search':
        return `{search(${params}){id,criteria{site,type,hood,min,max}}}`;
    }
  }

  getPosts({ site, type, hood }) {
    //
    // fetches posts from server
    //

    const query = this.buildQuery('posts', _.merge({}, {site:site,type:type,hood:hood})); // clean this up

    return fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
      credentials: 'include',
    })
    .then(resp => {
      if (resp.status !== 200) throw new Error(resp.statusText);
      return resp.json();
    })
    .then(json => json.data.posts)
    .catch(err => console.error(err));
  }

  saveSearch() {
    //
    // instantiate new search
    //

    const query = this.buildQuery('search', _.merge({}, this.state.criteria, { secret: 'pass' }));

    return fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
      credentials: 'include',
    })
    .then(resp => {
      if (resp.status !== 200) throw new Error(resp.statusText);
      return resp.json();
    })
    .then(json => {
      history.push(`/search?q=${json.data.search.id}`);
    })
    .catch(err => console.error(err));
  }

  updateSearch() {
    //
    // updates existing search
    //

    const query = this.buildQuery('search', _.merge({}, this.state.criteria, { id: this.props.search.id, update: 'update' }));

    return fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
      credentials: 'include',
    })
    .then(resp => {
      if (resp.status !== 200) throw new Error(resp.statusText);
      return resp.json();
    })
    .then(json => {
      if (!json.errors) console.log('Updated.');
      // history.push(`/search?q=${json.data.search.id}`);
    })
    .catch(err => console.error(err));

  }

  render() {    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <button className={s.save}
                  onClick={this.props.search ? this.updateSearch : this.saveSearch}>
                    {this.props.search ? 'Save Criteria' : 'Save This Search'}
          </button>
          <Criteria criteria={this.state.criteria} setCriteria={this.setCriteria} />
          <Results criteria={this.state.criteria} posts={this.state.posts} />
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object,
  posts: PropTypes.array,
};

export default withStyles(s)(Search);
