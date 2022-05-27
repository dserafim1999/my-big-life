import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { updateQueryBlock } from "../../actions/queries";
import CloseIcon from "@mui/icons-material/Close";
import CustomTimePicker from "./CustomTimePicker";

const inputStyle={
  border: "none",
  backgroundColor: "transparent",
  resize: "none", 
  outline: "none", 
  width: "35%", 
  textAlign: "center"
}

const locationInputStyle = {
  margin: '0 auto', 
  display: 'block', 
  position: 'relative',
  width: '30%',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'white'
}

const footerElementsStyle = {
  position: "relative",
  top: "40%",
  display: "flex",
  justifyContent: "space-between"
}

const deleteButtonStyle = {
  position: "absolute",
  top: "-50%",
  left: "100%",
  color: "red",
  cursor: "pointer"
}

const QueryStay = ({id, maxWidth, maxHeight, width, queryState, onRemove, dispatch}) => {
    const height = 50;
    const minWidth = 125;
    const minHeight = 50;

    const [state, setState] = useState({
        width: width,
        height: height,
        x: queryState.queryBlock.x,
        y: (maxHeight - height) / 2 - 10
    });

    const [query, setQuery] = useState(queryState);
    const [selected, setIsSelected] = useState(false);

    useEffect(() => {
      dispatch(updateQueryBlock(query));
    },[query]);

    const getBackgroundColor = () => {
      return selected ? 'yellow' : '#284760';
    }

    const onDoubleClick = () => {
      setIsSelected(!selected);
    }

    const onResizeStop = (e, direction, ref, delta, position) => {
        const maxHeightDelta = maxHeight - minHeight;
        const maxWidthDelta = maxWidth - minWidth;

        setState({
          width: ref.style.width,
          height: ref.style.height,
          ...position
        });
    }

    const onDrag = (e, d) => { 
      setState({ x: d.x, y: d.y });
      dispatch(updateQueryBlock({...query, queryBlock:{x: d.x, id: id}}));
    }

    return (
      <Rnd
        id={id}
        className="stayQuery"
        style={{backgroundColor: getBackgroundColor()}}
        size={{ width: state.width, height: state.height }}
        position={{ x: state.x, y: state.y }}
        bounds="parent"
        minHeight={minHeight}
        minWidth={minWidth}
        dragAxis="x"
        onDrag={onDrag}
        onResizeStop={onResizeStop}
        onDoubleClick={onDoubleClick}
      >
        <div style={{width: '100%', height: '100%'}}>
          {
            selected && (
              <div style={deleteButtonStyle}>
                <CloseIcon onClick={() => onRemove(id)}/>
              </div>
            )
          }
          <input 
            style={{...inputStyle, ...locationInputStyle}}
            placeholder="location"
            onChange={(e) => setQuery(
              {...query, "location": e.target.value}
          )}/>
          <div style={footerElementsStyle}>
              <CustomTimePicker
                  value={query["start"]}
                  onChange={(newValue) => setQuery({...query, 'start': newValue})}
              />
            <input
              id="duration"
              type="text"
              placeholder="duration"
              style={inputStyle}
              value={query["duration"]}
                  onChange={(e) => setQuery(
                      {...query, "duration": e.target.value}
              )}
            />
              <CustomTimePicker
                  value={query["end"]}
                  onChange={(newValue) => setQuery({...query, 'end': newValue})}
              />
          </div>
        </div>
      </Rnd>
    );
};


export default QueryStay;