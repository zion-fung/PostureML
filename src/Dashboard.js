/*global chrome*/

import React, { Component } from 'react';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoPermission: false,
      notificationPermission: false,
    }
  }

  componentDidMount() {
    chrome.permissions.contains({
      permissions: ['notifications', 'videoCapture'],
    }, function(result) {
      if (result) {
        // The extension has the permissions.
        console.log(result);
      } else {
        // The extension doesn't have the permissions.
        console.log('oops');
      }
    });
  }

  render() {
    return(
      <button>Click me!</button>
    )
  }
}
