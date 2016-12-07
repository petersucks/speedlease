import React, { Component, PropTypes } from 'react';
import { DropdownList, NumberPicker } from 'react-widgets';
import numberLocalizer from 'react-widgets/lib/localizers/simple-number';
numberLocalizer(); // necessary for react-widgets
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Criteria.css';
import StripeWidget from '../../StripeWidget/StripeWidget';
import roster from '../../../core/roster.json';
import types from '../../../core/types.json';
const rosterList = Object.keys(roster).map(site => roster[site]).sort((a,b) => a.short > b.short),
      typesList  = Object.keys(types).map(type => types[type]);

//
// Hood value component - display nothing instead of 'default'
// -----------------------------------------------------------------------------

class HoodValue extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (<span>{this.props.item.short === 'default' ? '' : this.props.item.long}</span>);
  }
}

//
// Criteria widget
// -----------------------------------------------------------------------------

class Criteria extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let site = roster[this.props.criteria.site], // for the sake of brevity
        type = types[this.props.criteria.type],
        hood = site['hoods'][this.props.criteria.hood],
        min  = this.props.criteria.min,
        max  = this.props.criteria.max;
    
    let hoodsList = Object.keys(site['hoods']).map(h => site['hoods'][h]);
    let button, loading = 'button is-primary' + (this.props.loading ? ' is-loading' : '');
    
    if (this.props.id) {
      button = (
        <a className={loading} onClick={this.props.update}>
          <span className="icon"><i className="fa fa-check"></i></span>
          <span>{'Save Criteria'}</span>
        </a>) }
    else {
      button = (<StripeWidget criteria={this.props.criteria} loadingClass={loading} />) }
      

    return (
      <div className="columns">
        <div className="column is-one-third">

          <div className={s.criteria}>

            {button}

            {/* site */}
            <DropdownList
              valueField='short' textField='long'
              data={rosterList}
              defaultValue={site} 
              onChange={val => {
                let hoods = roster[val.short]['hoods'],
                    newHood = hoods[Object.keys(hoods)[0]].short, /* get default hood */
                    newSite = val.short;
                this.props.setCriteria({
                  site: newSite,
                  hood: newHood
                });
              }} />

            {/* hood */}
            <DropdownList
              disabled={hood.short == 'default'}
              data={hoodsList}
              value={hood}
              textField={'long'}
              valueComponent={HoodValue}
              onChange={val => {
                let newHood = val.short;
                this.props.setCriteria({
                  hood: newHood
                });
              }}/>

            {/* type */}
            <DropdownList
              valueField='short' textField='long'
              data={typesList}
              defaultValue={type}
              onChange={val => {
                let newType = val.short;
                this.props.setCriteria({
                  type: newType,
                });
              }} />

            {/* price:min */}
            <NumberPicker
              format='-$#,###'
              defaultValue={min || 0}
              min={0}
              max={max}
              step={100} 
              onChange={val => {
                this.props.setCriteria({
                  min: val
                });
              }} />

            {/* price:max */}
            <NumberPicker
              format='-$#,###'
              defaultValue={max || 3000}
              min={min}
              max={99999}
              step={100}
              onChange={val => {
                this.props.setCriteria({
                  max: val
                });
              }} />
          </div>
          
        </div>
        <div className="column is-two-thirds">
          <h1 className="title is-1">{this.props.info.postCount}</h1>
        </div>
      </div>
    )
  }
}

Criteria.propTypes = {
  setCriteria: PropTypes.func.isRequired,
  criteria: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withStyles(s)(Criteria);