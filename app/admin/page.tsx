"use client";

import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Button } from "@nextui-org/button";
import { Form, Input, Alert } from '@nextui-org/react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/modal';
import { FormEvent, useCallback, useState, useEffect, useRef } from "react";
import { CldUploadButton } from 'next-cloudinary';

interface CarProps {
  id: string
  brand: string
  model: string
  year: number
  color: string
  collection: string
  blister_type: string
  image_url: string
  is_premium: boolean
}

interface FormData {
  brand: string
  model: string
  year: string
  color: string
  collection: string
  blisterType: string
  isPremium: boolean
}

const GET_CARS = gql`
  query {
    cars {
      id
      brand
      model
      year
      image_url
    }
  }
`;

const SAVE_CAR = gql`
  mutation CreateCar(
    $brand: String!,
    $model: String!,
    $year: Int!,
    $color: String!,
    $blisterType: String!,
    $imageUrl: String!,
    $isPremium: Boolean!,
    $collection: String,
    $masterBrand: String!
  ) {
  createCar(
    brand: $brand,
    model: $model,
    year: $year,
    color: $color,
    blisterType: $blisterType,
    imageUrl: $imageUrl,
    isPremium: $isPremium,
    collection: $collection,
    masterBrand: $masterBrand
  ) {
    brand
    model
    year  
  }
}
`

const Admin = () => {
  
  const [queryCars, { data, loading, error }] = useLazyQuery(GET_CARS,{
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
  }
  );
  const [saveCar, { loading: savingCar }] = useMutation(SAVE_CAR)

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedCar, setSelectedCar] = useState<CarProps| null>();
  const [url, setUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'danger' | 'default' | 'primary' | 'secondary' | 'warning'>('success');

  const alertRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    queryCars();
  }, [])

  useEffect(() => {
    if (isVisible)
      alertRef.current && alertRef.current.scrollIntoView({ behavior: 'smooth'})
  }, [isVisible])
  
  const handleOnSuccess = useCallback((result: any) => {
    console.log(result.info.secure_url)
    setUrl(result.info.secure_url)
  }, [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(data)
    
    await saveCar({
      variables: {
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year.toString()),
        color: data.color,
        blisterType: data.blisterType,
        imageUrl: data.url,
        isPremium: data.isPremium === "on" ? true: false,
        collection: data.collection,
        masterBrand: data.masterBrand,
      },
      onCompleted: (data) => {
        const { brand, model, year } = data.createCar;

        setUrl('');
        setTitle('Carrito guardado');
        setDescription(`${brand} ${model} ${year} guardado correctamente en la base`);
        queryCars({
          variables: {
            time: Math.random()
          },
          onCompleted: () => {
            setIsVisible(true);
          }
        })
      },
      onError: (error) => {
        setTitle('No se pudo guardar el carrito');
        setDescription(`Lo sentimos ocurrio un error ${error.message}`);
        setAlertType("danger");
        setIsVisible(true)
      }
    })
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <h1>Colección Hot Wheels</h1>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly'
        }}
      >

        <Card
          isPressable
          isBlurred
          className="h-[300px] w-[300px] col-span-12 sm:col-span-5"
          style={{
            backgroundColor: '#0057b8',
            boxShadow: 'inset 4px 4px 8px 4px rgb(3, 67, 141), inset -4px -4px 8px 4px rgb(3, 67, 141)'
          }}
          onPress={() => {
            setSelectedCar(null)
            onOpen()
          }}
        >
          <CardBody
            className="justify-center items-center"
          >
            <Image
              src="/agregar.png"
            />
          </CardBody>
        </Card>

        {
          data && data.cars.map((car: any) => (
            <Card
              key={car.id}
              isPressable
              isFooterBlurred
              style={{ width: '300px' }}
              className="h-[300px] col-span-12 sm:col-span-5"
              onPress={() => {
                setSelectedCar(car)
                onOpen()
              }}
            >
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">{car.year}</p>
                <h4 className="text-black font-medium text-2xl">{`${car.brand} ${car.model}`}</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src={car.image_url}
              />
              <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black text-tiny">Available soon.</p>
                  <p className="text-black text-tiny">Get notified.</p>
                </div>
                {/* <Button className="text-tiny" color="primary" radius="full" size="sm">
                  Notify Me
                </Button> */}
              </CardFooter>
            </Card>
          ))
        }
      </div>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{ selectedCar === null ? "Agregar carrito": `${selectedCar?.brand} ${selectedCar?.model}` } </ModalHeader>
              <Form
                className="w-full justify-center items-center space-y-4"
                onSubmit={onSubmit}
              >
                <ModalBody>
                  {
                    selectedCar !== null &&
                    <>
                      <p>Modal</p>
                      <Image
                        src={selectedCar ? selectedCar.image_url : ''}
                      />
                    </>
                  }
                  {
                    selectedCar === null &&
                    <>
                        <Input isRequired label="Marca principal" name="masterBrand" labelPlacement="outside" />
                        <Input isRequired label="Marca" name="brand" labelPlacement="outside" />
                        <Input isRequired labelPlacement="outside" name="model" label="Modelo" />
                        <Input isRequired labelPlacement="outside" name="year" label="Año" />
                        <Input labelPlacement="outside" name="color" label="Color" />
                        <Input labelPlacement="outside" name="collection" label="Colección" />
                        <Input labelPlacement="outside" name="blisterType" label="Blister" />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '8px'
                          }}
                        >
                          <input type="checkbox" id="cbox2" name="isPremium" />
                          <label htmlFor="cbox2">Es premium</label>
                        </div>
                        
                        <Input readOnly name="url" value={url} label={"URL"} labelPlacement="outside" />

                        <CldUploadButton 
                          onSuccess={handleOnSuccess}
                          uploadPreset="hw_preset"
                          className="uploadButton"
                        >
                          Cargar imagen
                        </CldUploadButton>
                    </>
                  }

                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" color="primary" onPress={onClose}>
                    { selectedCar === null ? 'Guardar': 'Actualizar' }
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>

      <Alert
        ref={alertRef}
        color={alertType}
        description={description}
        isVisible={isVisible}
        title={title}
        variant="faded"
        onClose={() => {
          setIsVisible(false)
        }}
      />

    </div>
  );
}

export default Admin;