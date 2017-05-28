import React, { Component, PropTypes } from 'react';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';

import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Notification from 'grommet/components/Notification';
import Button from 'grommet/components/Button';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Form from 'grommet/components/Form';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import request from 'request';

import { getMessage } from 'grommet/utils/Intl';

import NavControl from '../components/NavControl';
import {
  loadPublish, unloadPublish
} from '../actions/publish';

import { pageLoaded } from './utils';

class Publish extends Component {

  constructor() {
    super();

    this._onSubmit = this._onSubmit.bind(this);
    this._onItemsChange = this._onItemsChange.bind(this);

    this.state = {
      message: 'Team 128: HPE PaaS Rules!'
    };
  }

  _onSubmit (e) {
    e.preventDefault();
    if (this.state.message) {
      request.post(`http://producer.paas.comarch.pl/${this.state.message}`, (err, response, body) => {
        if (err) {
          console.log('publish> ', err);
        } else {
          console.log('publish> '+response.statusCode+' '+response.headers['content-type']+' '+body)
        }
      })
    };
    history.push('/dashboard');
  }

  _onItemsChange (e) {
    this.setState({ message: e.target.value });
  }

  componentDidMount() {
    const { params, dispatch, error } = this.props;
    pageLoaded('Publish');
    dispatch(loadPublish());
  }

  componentWillUnmount() {
    const { params, dispatch, error } = this.props;
    dispatch(unloadPublish());
  }

  render() {
    const { intl } = this.context;

    let publishNode;

    publishNode = (
      <Box direction='column' align='start' pad={{horizontal: 'medium', vertical: 'small'}} full='horizontal'>
        <Form onSubmit={this._onSubmit}>
        <FormFields>
          <fieldset>
            <FormField label={getMessage(intl, 'Message')} htmlFor="messageId">
              <input type="text" name="message" id="messageId" onChange={this._onItemsChange} value={this.state.message} />
            </FormField>
          </fieldset>
        </FormFields>
        <Footer pad={{vertical: 'small'}} justify="end">
          <Box pad={{horizontal: 'small'}}>
            <Button label={getMessage(intl, 'Publish')} primary={true} onClick={this._onSubmit} />
          </Box>
        </Footer>
        </Form>
      </Box>
    );

    return (
      <Article primary={true}>
        <Header direction='row' size='large' colorIndex='light-2' align='center' responsive={false} pad={{ horizontal: 'medium' }}>
          <NavControl name={getMessage(intl, 'PublishtoQueue')} />
        </Header>
        {publishNode}
      </Article>
    );
  }
}

Publish.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  params: PropTypes.object.isRequired
};

Publish.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.publish });

export default connect(select)(Publish);
