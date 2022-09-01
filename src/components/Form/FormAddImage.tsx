import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ChangeEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: v => parseInt(v[0].size) < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: v => /image\/(png|jpeg|gif)/.test(v[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
      }     
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      types: {
        required: 'Título obrigatório',
        minLength: {
          value: 2,
          message: 'Mínimo de 2 caracteres'
        },
        maxLength: {
          value: 20,
          message: 'Máximo de 20 caracteres'
        }
      }
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      types: {
        required: 'Descrição obrigatória',
        maxLength: {
          value: 65,
          message: 'Máximo de 65 caracteres'
        }
      }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    (formData:Object) => { return api.post('/api/images',formData) },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(['images'])
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
      
      if(!imageUrl){
        toast({title:'Imagem não adicionada',description:'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',status:'info',duration:2000,isClosable:true})
      }

      const formData = {
        url: imageUrl,
        title: String(data.title),
        description: String(data.description)
      }

      mutation.mutateAsync(formData);

      if(mutation.isError){
        toast({title:'Imagem não cadastrada',description:'Ocorreu um erro ao salvar sua imagem',status:'error',duration:2000,isClosable:true})
      }else{
        toast({title:'Imagem cadastrada',description:'Sua imagem foi cadastrada com sucesso',status:'success',duration:2000,isClosable:true})
      }
      
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({title:'Falha no cadastro',description:'Ocorreu um erro ao tentar cadastrar a sua imagem',status:'error',duration:2000,isClosable:true})
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset()
      setLocalImageUrl('')
      closeModal()
    }
  };

  console.log('Errors.image: ',errors.image)
  
  let imageErrors       = (errors.image && errors.image.type)     ? {type:errors.image.type, message:errors.image.message} : null;
  let titleErrors       = errors.title       ? {type:errors.title.type, message:errors.title.message} : null;
  let descriptionErrors = errors.description ? {type:errors.description.type, message:errors.description.message} : null;

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger} name={'image'} onChange={ (event) => { console.log('Onchange: ',event)} } 
          // TODO SEND IMAGE ERRORS
          error={ imageErrors ? {type:String(imageErrors.type),message:String(imageErrors.message)} : null }
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register("image",formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..." name={'title'} 
          // TODO SEND TITLE ERRORS
          error={ titleErrors ? {type:String(titleErrors.type),message:String(titleErrors.message)} : null } 
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register("title",formValidations.title.types)}
        />

        <TextInput
          placeholder="Descrição da imagem..." name={'description'} 
          // TODO SEND DESCRIPTION ERRORS
          error={ descriptionErrors ? {type:String(descriptionErrors.type),message:String(descriptionErrors.message)} : null }
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register("description",formValidations.description.types)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
