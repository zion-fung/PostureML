import React, { Component } from "react";
import { Grid, Card, Image, Button, Segment } from 'semantic-ui-react';
import "./App.css";
import LineGraph from "./LineGraph";

export default class App extends Component {
    constructor(props) {
        super(props);
        let startEvent = new Event("startTensor");
        let stopEvent = new Event("stopTensor");
        let resetEvent = new Event("setDefaultPose");
        this.state = {
            isRecording: false,
            startEvent: startEvent,
            stopEvent: stopEvent,
            resetEvent: resetEvent
        }
    }
    toggleRecord() {
        let status = this.state.isRecording;
        if (status) {
            window.dispatchEvent(this.state.stopEvent);
        } else {
            window.dispatchEvent(this.state.startEvent);
        }
        this.setState({ isRecording: !status });
    }
    resetPose() {
        window.dispatchEvent(this.state.resetEvent);
    }
    render() {
        return (
            <div className="parent">
                <Grid columns={2}>
                    <Grid.Column width={4} className="profile">
                        <Card>
                            <Card.Header>Profile</Card.Header>
                            <Card.Meta>Zion Fung</Card.Meta>
                            <Image src="logo192.png"></Image>
                            <Card.Content>
                                <Button
                                    fluid
                                    onClick={() => { this.toggleRecord() }}
                                    color={this.state.isRecording ? "red" : "green"}>{this.state.isRecording ? "Stop" : "Start"}</Button>
                                <Button
                                    fluid
                                    onClick={() => { this.resetPose() }}
                                    color="grey">Reset Pose</Button>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={1}></Grid.Column>
                    <Grid.Column width={11} className="content" stretched>
                        <Grid.Row className="graph">
                            <Segment>
                                <LineGraph />
                            </Segment>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment className="shareOptions">
                                <Button circular color='facebook' icon='facebook' />
                                <Button circular color='twitter' icon='twitter' />
                                <Button circular color='linkedin' icon='linkedin' />
                                <Button circular color='google plus' icon='google plus' />
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}