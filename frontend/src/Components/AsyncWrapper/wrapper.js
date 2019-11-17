import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';

function mapStateToProps(state) {
    return {

    };
}

class AsyncWrapper extends Component {
    render() {
        switch (this.props.status) {
        case 'SUCCESS': return <div style={{padding: '30px'}}>{this.props.children}</div>
            case 'ERROR': return 'error'
            case 'FETCHING': return <ReactLoading type="bubbles" color="#012877" />;
            default: return null;
        }

    }
}

export default connect(
    mapStateToProps,
)(AsyncWrapper);