import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncWrapper from '../../Components/AsyncWrapper/wrapper';
import CreateJobModal from '../../Components/Modal/createJob';
import JobInfoModal from '../../Components/Modal/jobinfo';

import cloneDeep from 'lodash/cloneDeep';


function mapStateToProps(state) {
    return {
        jobsAsync: state.jobs.getAsync,
        jobs: state.jobs.data,
        getSingleAsync: state.jobs.getSingleAsync,
        user: state.users.data,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        getJobs: () => dispatch({ type: 'GET_ALL_JOBS' }),
        createJob: (data) => dispatch({ type: 'CREATE_NEW_JOB', payload: data }),
        resetAsync: () => dispatch({ type: 'RESET_ASYNC' }),
        getSingleJob: (url) => dispatch({ type: 'GET_SINGLE_JOB_DATA', payload: url })
    };
}

/* 
    Isännöitsijä
    Ilmoittaja
    Objektinumero / Kiinteistön numero
    Työtehtävän id
    Osoite / Osoitteen tarkenne
    Kuvaus
    Prioriteetti
    Kuvat
*/

const ListItem = props => {
    let stars = [];
    if (props.data.feedback) {
        for (let i = 0; i < props.data.feedback.score; i++) {
            stars.push(<i key={'star_' + i} className="fa fa-star" style={{ color: 'gold' }}></i>)
        }
    }
    return <div className="row border-top ml-2 mr-2 pt-2 pb-1" style={{ borderColor: '#dddddd' }}>
        <div className="col-lg-1 text-center">
            <i className={props.logo ? props.logo.logo : 'fa fa-wrench fa-2x'} style={{ color: props.logo ? props.logo.color : 'black', paddingTop: '8px' }}></i>
        </div>
        <div className="col-lg-9 col-md-8">
            <div className="pull-left">
                <h5 className="mb-0 pb-0">{props.data.address}</h5>
                <small className="mt-0 pt-0">{props.data.description}</small>
                <button className="btn btn-link" data-toggle="modal" data-target="#info-modal" onClick={props.getData}>More info</button>
            </div>
        </div>
        <div className="col-md-12 col-lg-2 pt-3">
            {stars}
        </div>
    </div >
}

const Form = props => (<CreateJobModal submit={props.submit} >
    <FormRowContainer label="Property manager">
        <select className="form-control" onChange={props.onChange} name="housing_manager">
            {props.user.housing_managers.map((manager) => (<option key={'manager_' + manager.pk} value={manager.pk} >{manager.detail}</option>))}
        </select>
    </FormRowContainer>

    <FormRowContainer label="Contact phone number">
        <input type="text" className="form-control" name="contact_phone" onChange={props.onChange} />
    </FormRowContainer>

    <FormRowContainer label="Address" extra>
        <div className="row">
            <div className="col-7">
                <input type="text" className="form-control" placeholder="Address" name="address" onChange={props.onChange} />
            </div>
            <div className="col-5">
                <input type="text" className="form-control" placeholder="Address additional" name="address-additional" onChange={props.onChange} />
            </div>
        </div>
    </FormRowContainer>

    <FormRowContainer label="Task description">
        <textarea className="form-control" rows="3" name="description" onChange={props.onChange}></textarea>
    </FormRowContainer>
</CreateJobModal>)


const FormRowContainer = props => (<div className="row p-2">
    <div className="col-12">
        <label className="mb-0 pb-0">{props.label}</label>
        {props.children}
    </div>
</div>)

const initialState = {
    images: [],
    client: "",
    address: "",
    description: "",
    priority: 1,
    contact_phone: "+358505330252",
    building_object_id: "",
    housing_manager: '/api/housing_managers/4/',
    refreshUrl: '',
}

class List extends Component {
    state = initialState;

    componentDidMount() {
        this.props.resetAsync();
        this.props.getJobs();
        this.state.client.onConnectionLost = this.onConnectionLost;
        this.state.client.onMessageArrived = this.onMessageArrived;
        this.state.client.connect({ onSuccess: this.onConnect }, {
            useSSL: true,
        });
    }

    componentWillMount() {
        this.setState({ client: new window.Paho.MQTT.Client('broker.mqttdashboard.com', Number(8000), "asdsad"), })
    }

    onConnect = (client) => {
        console.log('Connected')
        this.state.client.subscribe('muspellsheimr');
    }

    onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
            this.state.client.connect({ onSuccess: this.onConnect }, {
                useSSL: true,
            });
        }
    }

    onMessageArrived = (message) => {
        if (message.destinationName === 'muspellsheimr') {
            this.props.getJobs();
            if (this.state.refreshUrl) {
                this.props.getSingleJob(this.state.refreshUrl)
            }
        }
    }

    createJob = (e) => {
        let data = cloneDeep(this.state);
        delete data.refreshUrl;
        setTimeout(() => this.setState(initialState), 2000)
        this.props.createJob(data);
    }

    handleCreateChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'housing_manager') {
            value = '/api/housing_managers/' + e.target.value + '/';
        }
        this.setState({ [e.target.name]: value });
    }

    getJobData = (url) => (e) => {
        this.setState({ refreshUrl: url });
        this.props.getSingleJob(url)
    }

    defineLogo = (status) => {
        switch (status) {
            case 'created': return { color: '#012877', logo: 'fa fa-file fa-2x' };
            case 'approved': return { color: '#012877', logo: 'fa fa-thumbs-up fa-2x' };
            case 'in_progress': return { color: 'green', logo: 'fa fa-caret-squared-right fa-2x' };
            case 'on_hold': return { color: '012877', logo: 'fa fa-pause fa-2x' };
            case 'finished': return { color: '012877', logo: 'fa fa-check fa-2x' };
            default: return null;
        }
    }

    render() {
        let finished_jobs = [];
        let open_jobs = [];
        for (let job of this.props.jobs) {
            let logo = this.defineLogo(job.status)
            if (job.status === 'finished') {
                finished_jobs.push(<ListItem key={job.url} data={job} getData={this.getJobData(job.url)} logo={logo} />)
            } else {
                open_jobs.push(<ListItem key={job.url} data={job} getData={this.getJobData(job.url)} logo={logo} />)
            }
        }

        return (
            <div style={{ paddingTop: '30px', minHeight: '100vh', backgroundColor: '#36509c' }}>
                <Form submit={this.createJob} onChange={this.handleCreateChange} user={this.props.user} />
                <JobInfoModal async={this.props.getSingleAsync} />
                <AsyncWrapper status={this.props.jobsAsync}>
                    <div className="row mt-0">
                        <div className="col-lg-8  offset-lg-2">
                            <div className="card shadow-sm p-3">

                                <div className="row mt-1 mb-2">
                                    <div className="col-12">
                                        <h4 style={{ float: 'left' }}>Open tasks</h4>
                                        <button className="btn btn-primary" data-toggle="modal" data-target="#create-modal" style={{ float: 'right' }}><i className="fa fa-edit"></i>Create new task</button>

                                    </div>
                                </div>
                                {open_jobs}
                            </div>
                        </div>
                    </div>
                </AsyncWrapper>

                <AsyncWrapper status={this.props.jobsAsync}>
                    <div className="row">
                        <div className="col-lg-8  offset-lg-2">
                            <div className="card shadow-lg p-3">
                                <div className="row mt-1 mb-2">
                                    <div className="col-12">
                                        <h4>Finished tasks</h4>
                                    </div>
                                </div>
                                {finished_jobs}
                            </div>
                        </div>
                    </div>
                </AsyncWrapper>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);