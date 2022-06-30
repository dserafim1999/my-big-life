import React, { useEffect, useState } from "react";
import { updateQueryBlock } from "../../actions/queries";
import { TextField, SectionBlock } from '../../components/Form';

const SearchRoute = ({id, queryState, start, end, dispatch}) => {
    const [query, setQuery] = useState(queryState);

    useEffect(() => {
        dispatch(updateQueryBlock(query));
    },[query]);

    const onChange = (param) => {
        setQuery({...query, ...param});
    }

    const addSuffix = (value, suffix) => {
        return value !== "" ? value + suffix : value;
    }

    return (
        <SectionBlock name={'Route ('+start+'→'+end+')'}>
            <TextField title='Route' onChange={(e) => onChange({route: e.target.value})}/>
            <TextField title='Duration' hasOperators={true} onChange={(e) => onChange({duration: addSuffix(e.target.value, 'min')})} type='number' min={0} suffix={"min"}/>
            <TextField title='Start Range' hasOperators={true} onChange={(e) => onChange({temporalStartRange: addSuffix(e.target.value, 'min')})} type='number' min={0} suffix={"min"}/>
            <TextField title='End Range' hasOperators={true} onChange={(e) => onChange({temporalEndRange: addSuffix(e.target.value, 'min')})} type='number' min={0} suffix={"min"}/>
        </SectionBlock>
    );
};


export default SearchRoute;