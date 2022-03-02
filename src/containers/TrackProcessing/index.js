import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addAlert } from '../../actions/ui';
import { clearAll, hideCanonical, resetHistory } from '../../actions/tracks';

import BulkButtons from '../../components/Buttons/BulkButtons';
import NavigationButtons from '../../components/Buttons/NavigationButtons';
import PaneContent from '../../components/PaneContent';
import ProgressBar from '../../components/ProgressBar';
import Card from '../Card';

import {
    skipDay,
    nextStep,
    previousStep,
    bulkProcess,
    loadLIFE,
    requestServerState
  } from '../../actions/progress';

const errorHandler = (dispatch, err, modifier) => {
    dispatch(addAlert(
    <div>
        <div>There was an error</div>
        <div>{ process.env.NODE_ENV === 'development' ? err.stack.split('\n').map((e) => <div>{e}</div>) : '' }</div>
    </div>
    ), 'error', 20);

    modifier('is-danger');
    setTimeout(() => modifier(''), 2000);
}

class SidePane extends Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;
    }

    componentDidMount() {
        this.dispatch(requestServerState());
    }

    componentWillUnmount() {
        this.dispatch(clearAll());
        this.dispatch(resetHistory());
        //TODO center map
    }

    onPrevious = (e, modifier) => {
        modifier('is-loading');
        this.dispatch(previousStep())
            .then(() => modifier())
            .catch((e) => errorHandler(this.dispatch, e, modifier));
    }

    onSkip = (e, modifier) => {
        modifier('is-loading');
        this.dispatch(skipDay())
        .then(() => modifier())
        .catch((e) => errorHandler(this.dispatch, e, modifier));
    }

    onNext = (e, modifier) => {
        modifier('is-loading');
        this.dispatch(nextStep())
            .then(() => modifier())
            .catch((e) => errorHandler(this.dispatch, e, modifier));
    }

    onBulkClick = (e, modifier) => {
        modifier('is-loading')
        this.dispatch(bulkProcess())
            .then(() => modifier());
    }

    onLifeRead = (text, modifier) => {
        modifier('is-loading');
        this.dispatch(loadLIFE(text))
            .then(() => {
                modifier('is-success', (c) => c !== 'is-warning');
                setTimeout(() => modifier(), 2000);
            })
            .catch((err) => {
                console.error(err);
                modifier('is-danger', (c) => c !== 'is-warning');
                setTimeout(() => modifier(), 2000);
            })
    }
    
    render () {
        const progress = (
            <ProgressBar state={this.props.stage}>
              <span>Preview</span>
              <span>Adjust</span>
              <span>Annotate</span>
            </ProgressBar>
        );
    
        let buttons;
        if (this.props.canonical) {
            buttons = (
              <a className='button is-primary' onClick={() => this.dispatch(hideCanonical())} style={{ margin: 'auto' }}>Done</a>
            );
        } else if (this.props.remainingCount > 0) {
            if (this.props.showList) {
                buttons = <BulkButtons onBulkClick={this.onBulkClick} onLifeRead={this.onLifeRead} />
            } else {
                buttons = (
                    <NavigationButtons
                        isFinal={this.props.stage === 2}
                        isLoadingNext={this.props.isLoadingNext}
                        isLoadingPrevious={this.props.isLoadingPrevious} 
                        onPrevious={this.onPrevious}
                        onSkip={this.onSkip} onNext={this.onNext} 
                        canSkip={this.props.stage === 0 && this.props.remainingCount > 1} 
                        canProceed={this.props.canProceed} canPrevious={this.props.stage !== 0}
                    />
                );
            }
        }
        return (
            <Card width="375" height="" top="99" left="99" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                { progress }
                <div style={{borderBottom: "2px solid #F0F0F0"}}></div>
                <PaneContent showList={this.props.showList} stage={this.props.stage} />
    
                <div style={{ marginTop: '0.5rem' }}>
                    <div className='columns is-gapless' style={{ marginBottom: 0 }}>
                        { buttons }
                    </div>
                </div>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    stage: state.get('progress').get('step'),
    canonical: state.get('tracks').get('canonical'),
    showList: state.get('ui').get('showRemainingTracks'),
    remainingCount: state.get('progress').get('remainingTracks').count(),
    canProceed: state.get('tracks').get('tracks').count() > 0,
    segmentsCount: state.get('tracks').get('segments').count(),
    isLoadingNext: state.get('ui').get('loading').has('continue-button'),
    isLoadingPrevious: state.get('ui').get('loading').has('previous-button')
  }
}

export default connect(mapStateToProps)(SidePane);