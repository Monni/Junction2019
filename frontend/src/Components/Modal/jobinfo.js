import React, { Component } from 'react';
import AsyncWrapper from '../AsyncWrapper/wrapper';
import { connect } from 'react-redux';
import moment from 'moment';


function defineStatus(code) {
    switch(code){
        case 'in_progress': return 'In progress';
        case 'on_hold': return 'On hold';
        case 'received': return 'Received';
        case 'approved': return 'Approved';
        case 'finished': return 'Finished';
        default: return code;
    }
}

const Step = props => (<div className="row p-2">
    <div className="col-1">
        <i className="fa fa-circle p-2" style={{ color: 'limegreen' }}></i>
    </div>
    <div className="col-11">
        <b className="pull-left">{defineStatus(props.data.status)}</b>
        <p className="pull-right mb-0">{props.data.description}</p>
        <small>{moment(props.data.created_at).format('DD.MM.YYYY HH:mm')}</small>

    </div>
</div >)
const SubStep = props => (<div className="row p-2">
    <div className="col-1 offset-1">
        <i className="fa fa-circle p-2 pl-4" style={{ color: 'yellow' }}></i>
    </div>
    <div className="col-10">
        <b className="pull-left">{defineStatus(props.data.status)}</b>
        <p className="pull-right mb-0">{props.data.description}</p>
        <small>{moment(props.data.created_at).format('DD.MM.YYYY HH:mm')}</small>

    </div>

</div >)

const InfoField = props => (<div className="mb-2">
    <h6 className="mb-0">{props.label}</h6>
    <i>{props.value}</i>
</div>)

const mapStateToProps = state => {
    return {
        job: state.jobs.singleJobData
    }
}

class JobInfoModal extends Component {

    defineType = (event) => {
        switch (event.type) {
            case 0: return <Step data={event} key={event.url} />
            case 1: return <SubStep data={event} key={event.url} />;
            default: break;
        }
    }
    render() {
        let foremans = [];
        let workers = [];
        let feedback_score = [];
        if (this.props.job) {
            for (let i = 1; i < 4; i++) {
                feedback_score.push(<i key={'feed_back_' + i} className="fa fa-cog" style={this.props.job.feedback && i < this.props.job.feedback.score ? { color: 'gold' } : { color: 'black' }}></i>)
            }
            for (let emp of this.props.job.employees) {
                if (emp.role === 'worker') {
                    workers.push(<div><h6>{emp.name}</h6></div>)
                }
                if (emp.role === 'foreman') {
                    foremans.push(<div key={'foreman' + emp.name}><h6>{emp.name}</h6></div>)
                }
            }
        }

        return (
            <div className="modal fade" id="info-modal" style={{ marginTop: '70px' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <AsyncWrapper status={this.props.async}>
                            <div className="modal-header">
                                <h4>{this.props.job && this.props.job.pk}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body border-bottom" style={{ borderColor: '#e9ecef' }}>
                                <div className="row">
                                    <div className="col-6">
                                        <h5>Created</h5>
                                        <h6 className="pl-2">{this.props.job && moment(this.props.job.created_at).format('DD.MM.YYYY HH:mm')}</h6>

                                        <h5>Task status</h5>
                                        <h6 className="pl-2">{this.props.job && this.props.job.status}</h6>
                                    </div>
                                    <div className="col-6">
                                        <h5>Foreman</h5>
                                        {foremans.length > 0 ? foremans : <div><h6 style={{ color: 'blue' }}>Unassigned</h6></div>}
                                        <h5>Workers</h5>
                                        {workers.length > 0 ? workers : <div><h6 style={{ color: 'blue' }}>Unassigned</h6></div>}
                                    </div>
                                </div>

                            </div>
                            <div className="modal-body border-bottom" style={{ borderColor: '#e9ecef' }}>
                                <h5>Contact person</h5>
                                <div className="row">
                                    <div className="col-6 pl-4 pb-2">
                                        <InfoField label="First name" value={this.props.job && this.props.job.user_first_name} />
                                        <InfoField label="Last name" value={this.props.job && this.props.job.user_last_name} />
                                    </div>
                                    <div className="col-6">
                                        <InfoField label="Phone number" value={this.props.job && this.props.job.contact_phone} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body border-bottom" style={{ borderColor: '#e9ecef' }}>
                                <h5 className="mb-2">Additional information</h5>
                                <div className="pl-2">
                                    <InfoField label="Description of the task" value={this.props.job && this.props.job.description} />
                                    <h5>Images</h5>
                                    {this.props.job && this.props.job.images.length > 0 ? this.props.job.images.map((image) => (<img alt="imagine" key={image} width="100" height="100" src={image} className="img-thumbnail" />)) : <h6 style={{ color: 'blue' }}>No images</h6>}
                                </div>
                            </div>

                            <div className="modal-body">
                                <h5>Task history</h5>
                                {this.props.job && this.props.job.events.map((event) => this.defineType(event))}

                            </div>
                            <hr />
                            {this.props.job && this.props.job.feedback && <div className="modal-body">
                                <h5>Feedback from the task</h5>
                                {feedback_score}{' - ' + this.props.job.feedback.detail}
                            </div>}
                        </AsyncWrapper>

                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(JobInfoModal);