import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import { updateQueryBlock } from "../../actions/queries";
import { TextField, SectionBlock } from '../../components/Form';

/**
 * Textual representation of a query component, related to a Route
 * 
 * @param {object} queryState Query component object related to a route
 * @param {number} start Id of origin stay
 * @param {number} end Id of destination stay
 * @param {function} dispatch Redux store action dispatcher
 */
const SearchRoute = ({queryState, start, end, dispatch}) => {
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
            <TextField title='Start Range' onChange={(e) => onChange({temporalStartRange: addSuffix(e.target.value, 'min')})} type='number' min={0} suffix={"min"}/>
            <TextField title='End Range' onChange={(e) => onChange({temporalEndRange: addSuffix(e.target.value, 'min')})} type='number' min={0} suffix={"min"}/>
        </SectionBlock>
    );
};

SearchRoute.propTypes = {
    /** Redux store action dispatcher */
    dispatch: PropTypes.func,
    /** Query component object related to a route */
    queryState: PropTypes.object, 
    /** Id of origin stay */
    start: PropTypes.number, 
    /** Id of destination stay */
    end: PropTypes.number
}

export default SearchRoute;