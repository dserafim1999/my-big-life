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
  position: 'relative',
  width: '30%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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

const QueryStay = ({id, maxWidth, maxHeight, width, queryState, onDragStay, onRemove, dispatch}) => {
    const height = 50;
    const minWidth = 125;
    const minHeight = 50;
    const y = (maxHeight - height) / 2 - 10;

    const [state, setState] = useState({
        width: width,
        height: height,
        x: queryState.queryBlock.x,
        minX: queryState.queryBlock.minX,
        maxX: queryState.queryBlock.maxX,
        y: y
    });

    const [query, setQuery] = useState(queryState);
    const [selected, setIsSelected] = useState(false);
    const [startOpen, setIsStartOpen] = useState(false);
    const [endOpen, setIsEndOpen] = useState(false);

    useEffect(() => {
      dispatch(updateQueryBlock(query));
    },[query]);

    const getBackgroundColor = () => {
      return selected ? 'yellow' : '#284760';
    }

    const onDoubleClick = (e) => {
      e.preventDefault();
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
      const updatedQuery = query;
      const stayQueryBlock = onDragStay(id);
      
      if (stayQueryBlock.maxX !== undefined && d.x >= stayQueryBlock.maxX - width) {
        setState({ x: stayQueryBlock.maxX - width, y: y });
      } else if (stayQueryBlock.minX !== undefined && d.x <= stayQueryBlock.minX + width) {
          if (id === 0) {
            setState({ x: d.x, y: y });
          } else {
            setState({ x: stayQueryBlock.minX + width, y: y });
          }
      } else {
        setState({ x: d.x, y: y });
      }
      
      updatedQuery.queryBlock.x = state.x;
      updatedQuery.queryBlock.minX = stayQueryBlock.minX;
      updatedQuery.queryBlock.maxX = stayQueryBlock.maxX;
      dispatch(updateQueryBlock(updatedQuery));
    }

    const onCloseStart = (clear) => {
      if (clear) {
        setQuery({...query, 'start': ""});
      }

      setIsStartOpen(false);
    }

    const onCloseEnd = (clear) => {
      if (clear) {
        setQuery({...query, 'end': ""});
      }

      setIsEndOpen(false);
    }

    return (
      <Rnd
        id={id}
        className="stayQuery"
        style={{backgroundColor: getBackgroundColor(), zIndex: "1"}}
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
                  open={startOpen}
                  value={query["start"]}
                  onChange={(newValue) => setQuery({...query, 'start': newValue})}
                  onClick={() => setIsStartOpen(true)}
                  onClose={(clear) => onCloseStart(clear)}
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
                  open={endOpen}
                  value={query["end"]}
                  onChange={(newValue) => setQuery({...query, 'end': newValue})}
                  onClick={() => setIsEndOpen(true)}
                  onClose={(clear) => onCloseEnd(clear)}
              />
          </div>
        </div>
      </Rnd>
    );
};


export default QueryStay;