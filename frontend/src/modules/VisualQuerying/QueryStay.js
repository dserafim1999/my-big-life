import React, { useState, useEffect } from "react";

import { Rnd } from "react-rnd";
import { updateQueryBlock } from "../../actions/queries";

import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import QueryTimePicker from "../../components/Form/QueryTimePicker";
import QueryNumberPicker from "../../components/Form/QueryNumberPicker";

const deleteButtonStyle = {
  position: "absolute",
  top: "-50%",
  left: "100%",
  color: "red",
  cursor: "pointer"
}

/**
 * Stay representation on Query Timeline
 * 
 * @param {number} id Stay id
 * @param {number} maxHeight Maximum height for Stay box
 * @param {number} width Width for Stay box
 * @param {object} queryState Current query state
 * @param {function} onDragStay Behaviour when Stay box is dragged
 * @param {function} onRemove Behaviour when Stay box is removed
 * @param {function} dispatch Redux store action dispatcher
 */

const QueryStay = ({id, maxHeight, width, queryState, onDragStay, onRemove, dispatch}) => {
    const minWidth = 125;
    const minHeight = 35;
    const footerHeight = 30;
    const height = minHeight;

    const [state, setState] = useState({
        width: width,
        height: height,
        x: queryState.queryBlock.x,
        minX: queryState.queryBlock.minX,
        maxX: queryState.queryBlock.maxX,
        y: (maxHeight - height) / 2 - 10
    });

    const [query, setQuery] = useState(queryState);
    const [selected, setIsSelected] = useState(false);
    const [startOpen, setIsStartOpen] = useState(false);
    const [endOpen, setIsEndOpen] = useState(false);

    useEffect(() => {
      dispatch(updateQueryBlock(query));
    },[query]);

    const getBackgroundColor = () => {
      return selected ? '#ffcf57' : '#284760';
    }

    const onDoubleClick = (e) => {
      e.preventDefault();;
      setIsSelected(!selected);
    }

    const onResize = (e, direction, ref, delta, position) => {
        const heightChange = ref.style.height.replace('px', '');
        const heightDelta = heightChange - state.height;

        setState({
          ...state,
          width: parseInt(ref.style.width.replace('px', '')),
          height: heightChange <= maxHeight ? heightChange : maxHeight,
          y: state.y - heightDelta
        });

        var spatialRange = "0m", operator = "";
        if (query["spatialRange"] !== "") {
          const firstChar = query["spatialRange"][0];
          if (isNaN(firstChar)) {
            operator = firstChar;
            spatialRange = query["spatialRange"].substring(1);
          } else {
            spatialRange = query["spatialRange"];
          }
        }

        setQuery({...query, "spatialRange": operator + (parseInt(spatialRange.slice(0, -1)) + 100 * heightDelta) + "m"});
    }

    const onDrag = (e, d) => { 
      const updatedQuery = query;
      const stayQueryBlock = onDragStay(id);
      
      e.stopPropagation();
      
      if (stayQueryBlock.maxX !== undefined && d.x >= stayQueryBlock.maxX - width) {
        setState({ ...state, x: stayQueryBlock.maxX - width });
      } else if (stayQueryBlock.minX !== undefined && d.x <= stayQueryBlock.minX + width) {
          if (id === 0) {
            setState({ ...state, x: d.x });
          } else {
            setState({ ...state, x: stayQueryBlock.minX + width });
          }
      } else {
        setState({ ...state, x: d.x });
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
        style={{backgroundColor: getBackgroundColor(), zIndex: "2"}}
        size={{ width: state.width, height: state.height }}
        position={{ x: state.x, y: state.y }}
        bounds="parent"
        minHeight={minHeight}
        minWidth={minWidth}
        dragAxis="x"
        onDrag={onDrag}
        onResize={onResize}
        onDoubleClick={onDoubleClick}
        enableResizing={{ top:true, right:false, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
      >
        <div id={"stayBody"} style={{width: '100%', height: '100%'}}>
          {
            selected && (
              <div style={deleteButtonStyle}>
                <CloseIcon onClick={() => onRemove(id)}/>
              </div>
            )
          }
          <div style={{display: 'flex', justifyContent: 'space-evenly', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>
            <input 
              className="queryInput"
              style={{color: 'white'}}
              placeholder="location"
              onChange={(e) => setQuery(
                {...query, "location": e.target.value.toLowerCase()}
            )}/>
            <QueryNumberPicker
                  style={{color: 'white'}}
                  value={query["spatialRange"]}
                  onChange={(value) => setQuery(
                      {...query, "spatialRange": value}
                  )}
                  onClear={() => setQuery(
                      {...query, "spatialRange": ""}
                  )}
                  label="Spatial Range"
                  placeholder="0m"
                  suffix="m"
                  showOperators={true}
              />
          </div>
          <div style={{display: "flex", justifyContent: "space-between", position: "relative", top: state.height - footerHeight + 'px'}}>
              <QueryTimePicker
                  open={startOpen}
                  value={query["start"]}
                  onChange={(newValue) => setQuery({...query, 'start': newValue})}
                  onClick={() => setIsStartOpen(true)}
                  onClose={(clear) => onCloseStart(clear)}
                  visual={true}
              />
              <QueryNumberPicker
                  value={query["duration"]}
                  onChange={(value) => setQuery(
                      {...query, "duration": value}
                  )}
                  onClear={() => setQuery(
                      {...query, "duration": ""}
                  )}
                  label="Duration"
                  placeholder="duration"
                  suffix="min"
                  showOperators={true}
              />
              <QueryTimePicker
                  open={endOpen}
                  value={query["end"]}
                  onChange={(newValue) => setQuery({...query, 'end': newValue})}
                  onClick={() => setIsEndOpen(true)}
                  onClose={(clear) => onCloseEnd(clear)}
                  visual={true}
              />
          </div>
          <div style={{display: "flex", justifyContent: "space-between", position: "relative", top: state.height - footerHeight*1.1 + 'px'}}>
              <QueryNumberPicker
                  value={query["temporalStartRange"]}
                  onChange={(value) => setQuery(
                      {...query, "temporalStartRange": value}
                  )}
                  onClear={() => setQuery(
                    {...query, "temporalStartRange": ""}
                  )}
                  label="Temporal Start Range"
                  placeholder="±0min"
                  suffix="min"
                  initialOperator="±"
                  style={{fontSize: '10px'}}
              />
              <QueryNumberPicker
                  value={query["temporalEndRange"]}
                  onChange={(value) => setQuery(
                      {...query, "temporalEndRange": value}
                  )}
                  onClear={() => setQuery(
                    {...query, "temporalEndRange": ""}
                  )}
                  label="Temporal End Range"
                  placeholder="±0min"
                  suffix="min"
                  initialOperator="±"
                  style={{fontSize: '10px'}}
              />
          </div>
        </div>
      </Rnd>
    );
};

QueryStay.propTypes = {
  /** Stay id */
  id: PropTypes.number,
  /** Maximum height for Stay box */
  maxHeight: PropTypes.number, 
  /** Width for Stay box */
  width: PropTypes.number, 
  /** Current query state */
  queryState: PropTypes.object, 
  /** Behaviour when Stay box is dragged */
  onDragStay: PropTypes.func,   
  /** Behaviour when Stay box is removed */
  onRemove: PropTypes.func,   
  /** Redux store action dispatcher */
  dispatch: PropTypes.func   
}

export default QueryStay;