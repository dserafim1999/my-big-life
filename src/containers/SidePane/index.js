import React from 'react';
import { connect } from 'react-redux';

import { addAlert, toggleRemainingTracks } from '../../actions/ui';
import { hideCanonical } from '../../actions/tracks';

import BulkButtons from '../../components/Buttons/BulkButtons';
import NavigationButtons from '../../components/Buttons/NavigationButtons';
import PaneDrawer from '../../components/PaneDrawer';
import PaneContent from '../../components/PaneContent';
import ProgressBar from '../../components/ProgressBar';
import Card from '../Card';

import {
    skipDay,
    nextStep,
    previousStep,
    bulkProcess,
    loadLIFE,
    reloadQueue
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

let SidePane = ({ dispatch, stage, canProceed, remainingCount, showList, segmentsCount, canonical }) => {
    const style = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    };
    
    const toggleList = () => dispatch(toggleRemainingTracks());

    const onPrevious = (e, modifier) => {
        modifier('is-loading');
        dispatch(previousStep())
            .then(() => modifier())
            .catch((e) => errorHandler(dispatch, e, modifier));
    }

    const onSkip = (e, modifier) => {
        modifier('is-loading');
        dispatch(skipDay())
        .then(() => modifier())
        .catch((e) => errorHandler(dispatch, e, modifier));
    }

    const onNext = (e, modifier) => {
        modifier('is-loading');
        dispatch(nextStep())
            .then(() => modifier())
            .catch((e) => errorHandler(dispatch, e, modifier));
    }

    const onBulkClick = (e, modifier) => {
        modifier('is-loading')
        dispatch(bulkProcess())
            .then(() => modifier());
    }

    const onLifeRead = (text, modifier) => {
        modifier('is-loading');
        dispatch(loadLIFE(text))
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

    const progress = (
        <ProgressBar state={stage}>
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
    } else {
        if (showList) {
            buttons = <BulkButtons onBulkClick={onBulkClick} onLifeRead={onLifeRead} />
        } else {
            buttons = (
                <NavigationButtons
                    isFinal={stage === 2} 
                    onPrevious={onPrevious}
                    onSkip={onSkip} onNext={onNext} 
                    canSkip={stage === 0 && remainingCount > 1} 
                    canProceed={canProceed} canPrevious={stage !== 0}
                />
            );
        }
    }
    return (
        <Card width="350" height="" top="99" left="99" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            { progress }
            <div style={{borderBottom: "2px solid #F0F0F0"}}></div>
            <PaneContent showList={showList} stage={stage} />

            <div style={{ marginTop: '0.5rem' }}>
                <div className='columns is-gapless' style={{ marginBottom: 0 }}>
                    { buttons }
                </div>
                <PaneDrawer onClick={toggleList} remainingCount={remainingCount} showList={showList} />
            </div>
        </Card>
    );
}

const mapStateToProps = (state) => {
  return {
    stage: state.get('progress').get('step'),
    canonical: state.get('tracks').get('canonical'),
    showList: state.get('ui').get('showRemainingTracks'),
    remainingCount: state.get('progress').get('remainingTracks').count(),
    canProceed: state.get('tracks').get('tracks').count() > 0,
    segmentsCount: state.get('tracks').get('segments').count()
  }
}

export default connect(mapStateToProps)(SidePane);