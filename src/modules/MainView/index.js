import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import useDraggableScroll from "use-draggable-scroll";
import { loadTrips } from "../../actions/general";
import Timeline from "../../components/Timeline";
import Card from "../../containers/Card";


const MainView = ({ dispatch }) => {
    const timelineWidthPercentage = 0.9; // sets percentage of width card will occupy
    const height = 75;

    var timelineRef = useRef(null);
    const { onMouseDown } = useDraggableScroll(timelineRef, { direction: 'horizontal' });
    
    const [id, setId] = useState(0);
    const [fullWidth, setFullWidth] = useState(window.innerWidth * timelineWidthPercentage);


    useEffect(() => {
        const handleResize = () => {
            setFullWidth(window.innerWidth * timelineWidthPercentage);
        }
        window.addEventListener('resize', handleResize)
    });

    dispatch(loadTrips());

    return (
        <Card 
            width={fullWidth} 
            height={height} 
            verticalOffset={2} horizontalOffset={50} 
            isDraggable={false}
            innerStyle={{display: "flex", alignItems: "center"}}
        >
            <Timeline render={{stays: [], routes: []}} height={height/2}></Timeline>
        </Card>
    );
};

const mapStateToProps = (state) => {
    return {};
}
  
export default connect(mapStateToProps)(MainView);