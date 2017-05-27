import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import CheckBox from 'grommet/components/CheckBox';
import Notification from 'grommet/components/Notification';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';


import NavControl from '../components/NavControl';
import {
  loadDashboardEvents, unloadDashboardEvents
} from '../actions/dashboard';

import { pageLoaded } from './utils';

class Dashboard extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount() {
    pageLoaded('Dashboard');
    this.props.dispatch(loadDashboardEvents());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadDashboardEvents());
  }


  render() {
    const { error, events } = this.props;
    const { intl } = this.context;

    let errorNode;
    let metersNode;
    let dashboardNode;

    if (error) {
      errorNode = (
        <Notification status='critical' size='large' state={error.message}
          message='An unexpected error happened, please try again later' />
      );
    } else if (events.length === 0) {
      dashboardNode = (
        <Box direction='row' responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}>
          <Spinning /><span>Loading...</span>
        </Box>
      );
    } else {
      const eventsNode = (events || []).map((event, index) => (
        <TableRow key={index} justify='between' pad={{ horizontal: 'medium', vertical: 'none', between: 'small' }} separator='none'>
            <td><Label margin='none' align='end'>{(new Date(sensor.eventTime)).getFullYear() +"-"+ ("0" + (new Date(sensor.eventTime)).getMonth()).slice(-2) +"-"+ ("0" + (new Date(sensor.eventTime)).getDate()).slice(-2) + " " + ("0" + (new Date(sensor.eventTime)).getHours()).slice(-2) + ":" + ("0" + (new Date(sensor.eventTime)).getMinutes()).slice(-2) + ":"  + ("0" + (new Date(sensor.eventTime)).getSeconds()).slice(-2)}</Label></td>
            <td><CheckBox checked={sensor.sensorState == '0' ? false : true} toggle={false} disabled={true} /></td>
            <td><Label margin='none'><Anchor path={`/sensor/${sensor.sensorId}`} label={sensor.sensorId} /></Label></td>
            <td><Label margin='none' align='end'>{sensor.sensorLat}</Label></td>
            <td><Label margin='none' align='end'>{sensor.sensorLng}</Label></td>
        </TableRow>
      ));

      dashboardNode = (
        <Box direction='column' align='start' pad={{horizontal: 'medium', vertical: 'small'}} full='horizontal'>
          <Table>
            <thead>
              <tr><th>Time</th><th>State</th><th>ID</th><th>Lat</th><th>Lng</th></tr>
            </thead>
            <tbody>
              {sensorsNode}
            </tbody>
          </Table>
        </Box>
      );
    }

    metersNode = (
      <Box direction='row' full='horizontal' align='stretch' pad={{horizontal: 'medium', vertical: 'small', between: 'small'}}>
        <AnnotatedMeter type='circle' series={[{"label": "Events", "value": events.length, "colorIndex": "brand"}]} units={getMessage(intl, 'EventsD')} max={events.length} legend={false} />
      </Box>
    );

    return (
      <Article primary={true}>
        <Header direction='row' size='large' colorIndex='light-2' align='center' responsive={false} pad={{ horizontal: 'medium' }}>
          <NavControl name={getMessage(intl, 'Dashboard')} />
        </Header>
        {errorNode}
        {metersNode}
        {dashboardNode}
      </Article>
    );
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object)
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);
