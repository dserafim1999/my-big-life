import React, { Component } from 'react';

import ChangeDayButtons from './ChangeDayButtons';
import NavigationButtons from './NavigationButtons';
import PaneContent from './PaneContent';
import ProgressBar from './ProgressBar';
import Card from '../../components/Card';
import DownloadingIcon from '@mui/icons-material/Downloading';

import { connect } from 'react-redux';
import { toggleRemainingTracks, addAlert } from '../../actions/general';
import { clearAll, resetHistory } from '../../actions/tracks';
import { BoundsRecord } from '../../records';
import { updateBounds } from '../../actions/map';
import { DONE_STAGE } from '../../constants';
import { 
    skipDay, nextStep, previousStep, requestServerState, reloadQueue
} from '../../actions/process';
import LoadingBar from '../../components/LoadingBar';

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

    onRefreshInputFolder = (e, modifier) => {
        modifier('is-loading');
        this.dispatch(reloadQueue())
            .then(() => modifier());
    }
    
    render () {
        const {
            dispatch,
            showList, 
            step, 
            isLoadingNext, 
            isLoadingPrevious, 
            isLoadingQueue, 
            remainingCount, 
            canProceed, 
            daysLeft, 
            isVisible, 
            isBulkProcessing, 
            bulkProgress
        } = this.props;

        const BULK_PROCESSING = (
            <div style={{ margin: 'auto', marginTop: '1rem', color: 'rgb(191, 191, 191)', textAlign: 'center' }}>
                <DownloadingIcon style={{ color: 'rgb(191, 191, 191)', verticalAlign: 'middle', marginRight: '5px' }} /> 
                <span style={{verticalAlign: 'middle'}}>Bulk processing currently in progress.</span>
                <LoadingBar height={30} value={bulkProgress}/>
            </div>
        );

        if (!isVisible) return null;

        const progress = (
            <ProgressBar state={step}>
              <span>Preview</span>
              <span>Adjust</span>
              <span>Annotate</span>
            </ProgressBar>
        );
        
        let buttons;
        if (remainingCount > 0 && !showList) {
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
        } else {
            if (step === DONE_STAGE) {
                dispatch(updateBounds(this.bounds));
            }
            buttons = (
                    <ChangeDayButtons
                        onBack={this.onChangeDay}
                        onRefresh={this.onRefreshInputFolder}
                        isEmpty={remainingCount === 0}
                        isLoadingQueue={isLoadingQueue}
                    />
            );
        }
        
        return (
            <Card width={375} verticalOffset={1} horizontalOffset={1}>
                { progress }
                <div style={{marginTop: '10px'}}/>
                {
                    isBulkProcessing ? 
                        BULK_PROCESSING :
                        (<>
                            <PaneContent showList={showList} stage={step}/>
                            <div style={{ marginTop: '0.5rem' }}>
                                { buttons }
                            </div>
                        </>)
                }
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
    isLoadingPrevious: state.get('general').get('loading').has('previous-button'),
    isLoadingQueue: state.get('general').get('loading').has('refresh-button'),
    isVisible: state.get('general').get('isUIVisible'),
    isBulkProcessing: state.get('process').get('isBulkProcessing'),
    bulkProgress: state.get('process').get('bulkProgress')
  }
}

export default connect(mapStateToProps)(TrackProcessing);