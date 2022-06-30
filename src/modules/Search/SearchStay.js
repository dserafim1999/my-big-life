import React, { useEffect, useState } from "react";
import { TextField, SectionBlock } from '../../components/Form';
import QueryTimePicker from "../../components/Form/QueryTimePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateQueryBlock } from "../../actions/queries";
import IconButton from "../../components/Buttons/IconButton";

const SearchStay = ({id, startVal, endVal, queryState, onRemove, dispatch}) => {
    const [start, setStart] = useState(startVal);
    const [end, setEnd] = useState(endVal);
    const [startOpen, setIsStartOpen] = useState(false);
    const [endOpen, setIsEndOpen] = useState(false);
    const [query, setQuery] = useState(queryState);

    useEffect(() => {
        dispatch(updateQueryBlock(query));
    },[query]);

    const onCloseStart = (clear) => {
        if (clear) {
          onChange({start: ""});
          setStart("");
        }
  
        setIsStartOpen(false);
    }

    const onChangeStart = (value) => {
        setStart(value);
        onChange({start: value});
    }

    const onCloseEnd = (clear) => {
        if (clear) {
          onChange({end: ""});
          setEnd("");
        }
  
        setIsEndOpen(false);
    }

    const onChangeEnd = (value) => {
        setEnd(value);
        onChange({end: value});
    }

    const onChange = (param) => {
        setQuery({...query, ...param});
    }

    const addSuffix = (value, suffix) => {
        return value !== "" ? value + suffix : value;
    }

    const deleteButton = (
        <IconButton title={"Delete Stay"} placement="top" onClick={() => onRemove(id)}>    
            <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
        </IconButton>
    );

    return (
        <SectionBlock name={'Stay ('+id+')'} button={deleteButton}>
            <TextField title='Location' onChange={(value) => onChange({location: value})}/>
            <TextField title='Spatial Range' hasOperators={true} onChange={(value) => onChange({spatialRange: addSuffix(value, 'm')})} type='number' min={0} suffix={"m"}/>
            <TextField title='Duration' hasOperators={true} onChange={(value) => onChange({duration: addSuffix(value, 'min')})} type='number' min={0} suffix={"min"}/>
            <div style={{display: "flex"}}>
                <QueryTimePicker
                    title='Start'
                    open={startOpen}
                    value={start}
                    onChange={(newValue) => onChangeStart(newValue)}
                    onClick={() => setIsStartOpen(true)}
                    onClose={(clear) => onCloseStart(clear)}
                    style={{marginRight: "10px"}}
                />
                <TextField title='Temporal Range' onChange={(value) => onChange({temporalStartRange: addSuffix(value, 'min')})} type='number' min={0} suffix={"min"}/>
            </div>
            <div style={{display: "flex"}}>
                <QueryTimePicker
                    title='End'
                    open={endOpen}
                    value={end}
                    onChange={(newValue) => onChangeEnd(newValue)}
                    onClick={() => setIsEndOpen(true)}
                    onClose={(clear) => onCloseEnd(clear)}
                    style={{marginRight: "10px"}}
                />
                <TextField title='Temporal Range' onChange={(value) => onChange({temporalEndRange: addSuffix(value, 'min')})} type='number' min={0} suffix={"min"}/>
            </div>
        </SectionBlock>
    );
};


export default SearchStay;