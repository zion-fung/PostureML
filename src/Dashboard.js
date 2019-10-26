/*global chrome*/

import React, { Component } from 'react';
import firebase from "./firebase/config";
import 'firebase/database';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoPermission: false,
      notificationPermission: false,
      notificationIds: [],
    }
    this.handleNotification = this.handleNotification.bind(this);
  }

  componentDidMount() {
    console.log(firebase);
  }

  handleNotification() {
    let _this = this;
    let options = {
      type: "basic",
      iconUrl: "./logo192.png",
      title: "PostureML",
      message: "Uh-Oh! Fix your posture!",
      priority: 2,
      buttons: [
        { title: "Reset posture" }
      ]
    }

    chrome.notifications.create(options, function(notificationId) {
      _this.setState(state => {
        return {
          notificationIds: [...state.notificationIds, notificationId]
        }
      });
    })
  }

  render() {
    return(
      <button onClick={this.handleNotification}>Test push notifications</button>
    )
  }
}
