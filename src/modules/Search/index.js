import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Card from '../../containers/Card';
import AsyncButton from '../../components/Buttons/AsyncButton';
import { addQueryStay, addQueryStayAndRoute, executeQuery, removeQueryStay, resetQuery, updateQueryBlock } from '../../actions/queries';
import SearchStay from './SearchStay';
import { DEFAULT_ROUTE, DEFAULT_STAY } from '../../constants';
import SearchRoute from './SearchRoute';
import QueryDatePicker from '../../components/Form/QueryDatePicker';
import { SectionBlock } from '../../components/Form';
import SimpleButton from '../../components/Buttons/SimpleButton';

const Search = ({ dispatch, query, isVisible }) => {
  if (!isVisible) return null;

  const [queryForm, setQueryForm] = useState([]);
  const [id, setId] = useState(0);
  const [date, setDate] = useState("--/--/----");
  const [dateOpen, setIsDateOpen] = useState(false);

  useEffect( () => {
    dispatch(resetQuery());
  }, []);

  const addStay = () => {
    var stayId;

    if(query.size > 0) {
        const routeId = id;
        stayId = routeId + 1;
        
        const stay = {...DEFAULT_STAY, queryBlock: {id: stayId}};
        const route = {...DEFAULT_ROUTE, queryBlock: {id: routeId}};

        dispatch(addQueryStayAndRoute(stay, route));                
        setQueryForm([...queryForm, route, stay]);
    } else {
        stayId = id;

        const stay = {...DEFAULT_STAY, queryBlock: {id: stayId}};

        dispatch(addQueryStay(stay));
        setQueryForm([...queryForm, stay]);
    }
    
    setId(stayId + 1);
  }

  const displayForm = () => {
    const queryBlocks = [];
    const allQueryBlocks = query.toJS();
        
    for (var i = 0; i < allQueryBlocks.length; i++) {
      if (i % 2 === 0) {
        const stayBlock = {
          type: 'stay',
          id: allQueryBlocks[i].queryBlock.id,
          queryState: allQueryBlocks[i],
          startVal: allQueryBlocks[i].start,
          endVal: allQueryBlocks[i].end,
          dispatch: dispatch,
          onRemove: onStayRemove
        };

        queryBlocks.push(stayBlock);
      } else {
        const prevStayId = allQueryBlocks[i - 1].queryBlock.id;
        const routeId = allQueryBlocks[i].queryBlock.id;
        const nextStayId = allQueryBlocks[i + 1].queryBlock.id;

        const routeBlock = {
          type: 'route',
          id: routeId,
          queryState: allQueryBlocks[i],
          start: prevStayId.toString(), 
          end: nextStayId.toString(),
          dispatch: dispatch
        };

        queryBlocks.push(routeBlock);
      }
    }
    return (
      <div>
        {
          queryBlocks.map((block) => {
            if (block.type === 'stay') {
                return <SearchStay key={block.id} {...block}/>
            } else if (block.type === 'route') {
                return <SearchRoute key={block.id} {...block}/>
            }
          })
        }
      </div>
    );
  }

  const onStayRemove = (id) => {
    dispatch(removeQueryStay(id));
  }

  const onChangeDate = (newValue) => {
    setDate(newValue);
  }

  const onCloseDate = (clear) => {
      if (clear) {
        setDate("--/--/----");
      }

      setIsDateOpen(false);
  }

  const onClearQuery = () => {
    setId(0);
    setDate("--/--/----");
    dispatch(resetQuery());
  }

  const onSubmit = () => {
    dispatch(executeQuery(
        {
            "data": [
                {
                    "date": date
                },
                ...query.toArray()
            ],
            "loadAll": true
        }
      )
    );
  }

  return (
    <Card width={400} title={"Search"} verticalOffset={1} horizontalOffset={1}>
      <section style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '460px'}}>
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
          <SectionBlock name='Date'>
            <QueryDatePicker
                title='Date'
                open={dateOpen}
                value={date}
                onChange={(newValue) => onChangeDate(newValue)}
                onClick={() => setIsDateOpen(true)}
                onClose={(clear) => onCloseDate(clear)}
            />
          </SectionBlock>
          { displayForm() }
        </div>
      </section>
      <footer style={{ textAlign: 'right', paddingTop: '10px' }} className='control'>
        <SimpleButton 
          title='Reset Search Query'
          onClick={onClearQuery}
          className='is-light'
        > Reset </SimpleButton> 
        <SimpleButton 
          title='Add a Stay and Corresponding Route to Query'
          className='is-light'
          onClick={addStay}
          style={{margin: "0 0.25rem"}}
        > Add Stay </SimpleButton> 
        <AsyncButton 
          title='Search'
          className='is-blue'
          onClick={(e, modifier) => {
            modifier('is-loading');
            onSubmit();
            modifier();
        }} > Search </AsyncButton>
      </footer>
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    query: state.get('queries').get('query'),
    isVisible: state.get('general').get('isUIVisible')
  };
}

export default connect(mapStateToProps)(Search);

