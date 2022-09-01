import { Button, Box, SimpleGrid } from '@chakra-ui/react';
import { useMemo } from 'react';
//import { useInfiniteQuery } from 'react-query';
import { useInfiniteQuery } from "@tanstack/react-query";

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import axios from 'axios';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['images'],
    // TODO AXIOS REQUEST WITH PARAM
    async ({ pageParam = 0 }) =>  axios.get(`/api/images?after=${pageParam}`), {
      getNextPageParam: (data) => { console.log('Data: ',data.data); return data.data.after }
    }
    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const response = []
    if(!isLoading){
      console.log('Formatted data foi chamado: ',data.pages.length)
      for(let i =0; i < data.pages.length; i++){
        response.push(...data.pages[i].data.data)
      }
      //console.log('Response array: ',response)
      //return data.pages[0].data.data;
      return response;
    }
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if(isLoading){
    return <Loading />
  }
  // TODO RENDER ERROR SCREEN
  if(isError){
    return <Error />
  }

  //console.log('Formatted data: ',formattedData);

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        { hasNextPage &&
          <Button mt={45} onClick={ () => fetchNextPage() }>{isFetchingNextPage?'Carregando...' : 'Carregar mais'}</Button>
        }
      </Box>
    </>
  );
}
