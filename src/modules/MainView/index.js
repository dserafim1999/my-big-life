import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import useDraggableScroll from "use-draggable-scroll";
import { loadAllTrips, loadTripsAndLocations } from "../../actions/general";
import { loadTripsInBounds } from "../../actions/tracks";
import Timeline from "../../components/Timeline";
import Card from "../../containers/Card";


const MainView = ({ dispatch, isVisible }) => {
    if (!isVisible) return null;

    const timelineWidthPercentage = 0.9; // sets percentage of width card will occupy
    const height = 75;

    var timelineRef = useRef(null);
    const [fullWidth, setFullWidth] = useState(window.innerWidth * timelineWidthPercentage);
    const { onMouseDown } = useDraggableScroll(timelineRef, { direction: 'horizontal' });


    useEffect(() => {
        const handleResize = () => {
            setFullWidth(window.innerWidth * timelineWidthPercentage);
        }
        window.addEventListener('resize', handleResize)
    });

    dispatch(loadTripsAndLocations());
    //dispatch(loadAllTrips());

    return (
        <Card 
            width={fullWidth} 
            height={height} 
            verticalOffset={2} horizontalOffset={50} 
            isDraggable={false}
            canToggleVisibility={false}
            innerStyle={{display: "flex", alignItems: "center"}}
        >
            <Timeline render={{stays: [], routes: []}} height={height/2}></Timeline>
        </Card>
    );
};

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible')
    };
}
  
export default connect(mapStateToProps)(MainView);