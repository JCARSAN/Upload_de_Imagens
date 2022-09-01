import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Text
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  //console.log('Image Url em ViewImage: ',imgUrl)
  return(
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Image 
            src={imgUrl}
            width="100%"
            maxWidth="900px"
            maxHeight="600px"
          />
        </ModalBody>
        <ModalFooter justifyContent='flex-start'>
          <Link href={imgUrl} color='black' border='none'>Abrir Original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
