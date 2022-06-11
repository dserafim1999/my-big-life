import React, { useEffect, useState } from "react";
import { TextField, SectionBlock } from '../../components/Form';
import QueryTimePicker from "../../components/Form/QueryTimePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateQueryBlock } from "../../actions/queries";

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
        <a className='button icon-button' onClick={() => onRemove(id)}>    
            <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
        </a>
    );

    return (
        <SectionBlock name={'Stay ('+id+')'} button={deleteButton}>
            <TextField title='Location' onChange={(e) => onChange({location: e.target.value})}/>
            <TextField title='Spatial Range' onChange={(e) => onChange({spatialRange: addSuffix(e.target.value, 'm')})} type='number' min='0' suffix={"m"}/>
            <TextField title='Duration' onChange={(e) => onChange({duration: addSuffix(e.target.value, 'min')})} suffix={"min"}/>
            <QueryTimePicker
                title='Start'
                open={startOpen}
                value={start}
                onChange={(newValue) => onChangeStart(newValue)}
                onClick={() => setIsStartOpen(true)}
                onClose={(clear) => onCloseStart(clear)}
            />
            <TextField title='Temporal Start Range' onChange={(e) => onChange({temporalStartRange: addSuffix(e.target.value, 'min')})} type='number' min='0' suffix={"min"}/>
            <QueryTimePicker
                title='End'
                open={endOpen}
                value={end}
                onChange={(newValue) => onChangeEnd(newValue)}
                onClick={() => setIsEndOpen(true)}
                onClose={(clear) => onCloseEnd(clear)}
            />
            <TextField title='Temporal End Range' onChange={(e) => onChange({temporalEndRange: addSuffix(e.target.value, 'min')})} type='number' min='0' suffix={"min"}/>
        </SectionBlock>
    );
};


export default SearchStay;