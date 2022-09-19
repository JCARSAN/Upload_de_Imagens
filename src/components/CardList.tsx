import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure()

  // TODO SELECTED IMAGE URL STATE
  const [urlImg,setUrlImage] = useState('')

  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(url: string){
    onOpen();
    setUrlImage(url);
  }

  return (
     
      <SimpleGrid columns={3} columnGap={10} rowGap={10}>
        {
          cards.map((card,index) => { 
                let url = card.url;
                return <Card key={index} data={card} viewImage={ handleViewImage }  /> 
          }) 
        }
        <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={urlImg} />
      </SimpleGrid>
     
  );
  
}
