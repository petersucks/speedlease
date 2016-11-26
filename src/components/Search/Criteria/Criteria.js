import React, { Component, PropTypes } from 'react';

import { DropdownList, NumberPicker } from 'react-widgets';
import numberLocalizer from 'react-widgets/lib/localizers/simple-number';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Search.css';

import roster from '../../../spiders/roster.json';
import types from '../../../spiders/types.json';

//
// Hood value component - display nothing instead of 'default'
// -----------------------------------------------------------------------------

class HoodValue extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.item.short != 'default') {
      return (
        <span>{this.props.item.long}</span>
      );
    } else {
      return (<span></span>);
    }
  }
}

//
// Criteria widget
// -----------------------------------------------------------------------------

const rosterList = Object.keys(roster).map(site => roster[site]),
      typesList  = Object.keys(types).map(type => types[type]);

numberLocalizer(); // necessary for react-widgets

class Criteria extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    // for the sake of brevity
    var site = roster[this.props.criteria.site],
        type = types[this.props.criteria.type],
        hood = site['hoods'][this.props.criteria.hood],
        min  = this.props.criteria.min,
        max  = this.props.criteria.max;
    
    var hoodsList = Object.keys(site['hoods'])
                    .map(h => site['hoods'][h]);

    return (
      <div className={s.root}>
        <div className={s.container} >

          {/* site */}
          <DropdownList
            valueField='short' textField='long'
            data={rosterList}
            defaultValue={site} 
            onChange={val => {
              let hoods = roster[val.short]['hoods'],
                  newHood = hoods[Object.keys(hoods)[0]], /* get default hood */
                  newSite = roster[val.short];
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
              let newHood = val;
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
              let newType = types[val.short];
              this.props.setCriteria({
                type: newType,
              });
            }} />

          {/* price:min */}
          <NumberPicker
            format='-$#,###'
            defaultValue={min || 0}
            min={0}
            max={99999}
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
            min={0}
            max={99999}
            step={100}
            onChange={val => {
              this.props.setCriteria({
                max: val
              });
            }} />

        </div>
      </div>
    )
  }
}

Criteria.propTypes = {
  setCriteria: PropTypes.func,
  criteria: PropTypes.object,
};

export default withStyles(s)(Criteria);