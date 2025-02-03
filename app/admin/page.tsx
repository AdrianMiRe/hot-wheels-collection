"use client";

import { gql, useMutation, useLazyQuery } from "@apollo/client";

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';
import { Button } from "@heroui/button";
import { Form, Input, Alert, Select, SelectItem } from '@heroui/react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/modal';
import { FormEvent, useCallback, useState, useEffect, useRef } from "react";
import { CldUploadButton } from 'next-cloudinary';

import { CarProps } from "@/interfaces/car";
import { CarForm } from "@/interfaces/form";
import { GET_CARS } from "@/graphql/queries/car";
import { SAVE_CAR } from "@/graphql/mutations/car";
import { GET_MASTER_BRANDS } from "@/graphql/queries/masterBrand";
import { GET_BRANDS } from "@/graphql/queries/brand";
import { GET_BLISTER } from "@/graphql/queries/blister";
import { MasterBrandProps } from "@/interfaces/masterb";
import { CarBrandProps } from "@/interfaces/carb";
import { BlisterTypeProps } from "@/interfaces/blister";

const Admin = () => {
  
  const [queryCars, { data, loading, error }] = useLazyQuery(GET_CARS,{
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
  }
  );

  const [queryMb] = useLazyQuery(GET_MASTER_BRANDS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const [queryBrands, { data: brandsData }] = useLazyQuery(GET_BRANDS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const [queryBlisters, { data: blisterData }] = useLazyQuery(GET_BLISTER, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  });

  const [saveCar, { loading: savingCar }] = useMutation(SAVE_CAR)

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedCar, setSelectedCar] = useState<CarProps| null>();
  const [url, setUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [masterBrands, setMasterBrands] = useState([]);
  const [carBrands, setCarBrands] = useState([]);
  const [blisterTypes, setBlisterTypes] = useState([]);

  const [alertType, setAlertType] = useState<'success' | 'danger' | 'default' | 'primary' | 'secondary' | 'warning'>('success');

  const alertRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    queryCars();
  }, [])

  useEffect(() => {
    if (isVisible)
      alertRef.current && alertRef.current.scrollIntoView({ behavior: 'smooth'})
  }, [isVisible])

  useEffect(() => {
    queryMb({
      onCompleted: (data) => {
        const tMasterBrands = data.masterBrands;
        setMasterBrands(tMasterBrands);
      }
    });
    queryBrands({
      onCompleted: (data) => {
        const tCarBrands = data.carBrands;
        setCarBrands(tCarBrands);
      }
    });
    queryBlisters({
      onCompleted: (data) => {
        const tBlisterTypes = data.blisterType;
        setBlisterTypes(tBlisterTypes);
      }
    });
  }, [selectedCar])
  
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
        <h1 className="font-heavyHeap">Colección Hot Wheels</h1>
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
          className="h-[350px] w-[350px] col-span-12 sm:col-span-5"
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
              className="w-[350px] h-[350px] col-span-12 sm:col-span-5"
              onPress={() => {
                setSelectedCar(car)
                onOpen()
              }}
            >
              <CardHeader className="absolute z-10 flex-col items-start bg-blue-500/40 border-b-1 border-zinc-100/50 backdrop-filter backdrop-blur-sm bg-opacity-0 ">
                <p className="font-heavyHeap text-red-800 text-lg uppercase tracking-wider">{car.year}</p>
                <h4 className="font-heavyHeap text-red-800 tracking-widest text-3xl italic">{`${car.brand} ${car.model}`}</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                src={car.image_url}
              />
              <CardFooter className="justify-between bg-blue-400/20 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <div className="flex justify-between w-full px-3">
                  <div className="flex flex-col gap-2 items-start">
                    <p className="font-heavyHeap text-red-800 text-xl tracking-wider">{car.master_brand}</p>
                    <p className="font-heavyHeap text-red-800 text-md tracking-widest">{car.collection}</p>
                  </div>
                  <div className="flex items-center">
                  
                    {
                      car.is_premium && 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold" className="size-8">
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                      </svg>
                    }

                  </div>
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
              <ModalHeader className="flex flex-col gap-1 text-white">{ selectedCar === null ? "Agregar carrito": `${selectedCar?.brand} ${selectedCar?.model}` } </ModalHeader>
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
                        <Select
                          isRequired
                          label="Marca principal"
                          name="masterBrand"
                          labelPlacement="outside"
                        >
                          {
                            masterBrands && masterBrands.map((mb: any) => (
                              <SelectItem
                              className="text-white"
                              key={mb.id}
                              value={mb.id}
                              >
                                {mb.brand}
                              </SelectItem>
                            ))
                          }
                        </Select>
                        <Select
                          isRequired
                          label="Marca"
                          name="brand"
                          labelPlacement="outside"
                        >
                          {
                            carBrands && carBrands.map((cb: any) => (
                              <SelectItem
                                className="text-white"
                                key={cb.id}
                                value={cb.id}
                              >
                                {cb.brand}
                              </SelectItem>
                            ))
                          }
                        </Select>
                        <Input classNames={{ input: 'capitalize' }} isRequired labelPlacement="outside" name="model" label="Modelo"/>
                        <Input isRequired labelPlacement="outside" name="year" label="Año" type="number" />
                        <Input classNames={{ input: "capitalize"}} labelPlacement="outside" name="color" label="Color" />
                        <Input classNames={{ input: "capitalize"}} labelPlacement="outside" name="collection" label="Colección" />
                        <Select
                          label="Blister"
                          name="blisterType"
                          labelPlacement="outside"
                        >
                          {
                            blisterTypes && blisterTypes.map((bt: any) => (
                              <SelectItem
                                className="text-white"
                                key={bt.id}
                                value={bt.id}
                              >
                                {bt.blister}
                              </SelectItem>
                            ))
                          }
                        </Select>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '8px'
                          }}
                        >
                          <input type="checkbox" id="cbox2" name="isPremium" />
                          <label className="text-white" htmlFor="cbox2">Es premium</label>
                        </div>
                        
                        <Input readOnly name="url" value={url} label={"URL"} labelPlacement="outside" />

                        <CldUploadButton 
                          onSuccess={handleOnSuccess}
                          uploadPreset="hw_preset"
                          className="uploadButton text-white"
                        >
                          Cargar imagen
                        </CldUploadButton>
                    </>
                  }

                </ModalBody>

                <ModalFooter>
                  <Button className="text-white" color="danger" variant="flat" onPress={onClose}>
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