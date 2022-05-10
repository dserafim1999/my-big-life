import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleRemainingTracks, addAlert } from '../../actions/general';
import { clearAll, hideCanonical, resetHistory } from '../../actions/tracks';

import BulkButtons from '../../components/Buttons/BulkButtons';
import NavigationButtons from '../../components/Buttons/NavigationButtons';
import PaneContent from './PaneContent';
import ProgressBar from './ProgressBar';
import Card from '../../containers/Card';

import {
    skipDay,
    nextStep,
    previousStep,
    bulkProcess,
    loadLIFE,
    requestServerState
  } from '../../actions/process';
import { updateBounds } from '../../actions/map';
import { BoundsRecord } from '../../records';
import { DONE_STAGE } from '../../constants';

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

class TrackProcessing extends Component {
    constructor(props) {
        super(props);

        this.dispatch = this.props.dispatch;

        // sets bounds to reset map
        this.bounds = new BoundsRecord().setWithCoords(90, -200, -90, 200);
    }

    componentDidMount() {
        this.dispatch(clearAll());
        this.dispatch(requestServerState());
    }

    componentWillUnmount() {
        this.dispatch(clearAll());
        this.dispatch(resetHistory());
        this.dispatch(updateBounds(this.bounds));
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

    onChangeDay = (e, modifier) => {
        this.dispatch(toggleRemainingTracks());
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
        const { dispatch, showList, canonical, step, isLoadingNext, isLoadingPrevious, remainingCount, canProceed, daysLeft} = this.props;

        const progress = (
            <ProgressBar state={step}>
              <span>Preview</span>
              <span>Adjust</span>
              <span>Annotate</span>
            </ProgressBar>
        );
    
        let buttons;
        if (canonical) {
            buttons = (
              <a className='button is-primary' onClick={() => dispatch(hideCanonical())} style={{ margin: 'auto' }}>Done</a>
            );
        } else if (remainingCount > 0) {
            if (showList) {
                buttons = <BulkButtons onBulkClick={this.onBulkClick} onLifeRead={this.onLifeRead} />
            } else {
                buttons = (
                    <NavigationButtons
                        isFinal={step === 2}
                        isLoadingNext={isLoadingNext}
                        isLoadingPrevious={isLoadingPrevious} 
                        onPrevious={this.onPrevious}
                        onSkip={this.onSkip} onNext={this.onNext} 
                        onChangeDay={this.onChangeDay}
                        canSkip={step === 0 && remainingCount > 1 && canProceed} 
                        canProceed={canProceed} canPrevious={step !== 0}
                        daysLeft={daysLeft}
                    />
                );
            }
        } else if (step === DONE_STAGE) {
            dispatch(updateBounds(this.bounds));
        }
        
        return (
            <Card width="375" top="99" left="99" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                { progress }
                <div style={{marginTop: '15px'}}/>
                <PaneContent showList={showList} stage={step}/>
    
                <div style={{ marginTop: '0.5rem' }}>
                    <div className='columns is-centered' style={{ marginBottom: 0, textAlign: 'center' }}>
                        { buttons }
                    </div>
                </div>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    step: state.get('process').get('step'),
    canonical: state.get('tracks').get('canonical'),
    showList: state.get('general').get('showRemainingTracks'),
    remainingCount: state.get('process').get('remainingTracks').count(),
    canProceed: state.get('tracks').get('tracks').count() > 0,
    daysLeft: state.get('process').get('remainingTracks').count() > 0 ? state.get('process').get('remainingTracks').count() : 0,
    segmentsCount: state.get('tracks').get('segments').count(),
    isLoadingNext: state.get('general').get('loading').has('continue-button'),
    isLoadingPrevious: state.get('general').get('loading').has('previous-button')
  }
}

export default connect(mapStateToProps)(TrackProcessing);