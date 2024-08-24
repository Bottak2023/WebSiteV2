'use client'
import { useState, useEffect } from 'react'
import { uploadStorage, downloadFile } from '@/firebase/storage'
import { useUser } from '@/context/Context.js'
import Input from '@/components/Input'
import SelectCountry from '@/components/SelectCountry'
import Label from '@/components/Label'
import Loader from '@/components/Loader'
import Button from '@/components/Button'
import Msg from '@/components/Msg'
import { useMask } from '@react-input/mask';
import { useRouter } from 'next/navigation';
import { WithAuth } from '@/HOCs/WithAuth'
import { getDayMonthYear } from '@/utils/date'
import { generateUUID } from '@/utils/UUIDgenerator'
import SelectBank from '@/components/SelectBank'
import ModalINFO from '@/components/ModalINFO'
import { getSpecificDataEq, getSpecificData2, writeUserData, removeData } from '@/firebase/database'

import Link from 'next/link'
function Home() {

    const { nav, setNav, user, userDB, setUserProfile, select, setDestinatario, success, setUserData, postsIMG, setUserPostsIMG, isSelect3, setIsSelect3, isSelect4, setIsSelect4, modal, setModal, destinatario, qr, setQr, QRurl, setQRurl, countries, setEnviosDB, setCambiosDB, setIsSelect5, isSelect5 } = useUser()
    const router = useRouter()

    const [postImage, setPostImage] = useState(undefined)
    const [pagosQR, setPagosQR] = useState(undefined)
    const [urlPostImage, setUrlPostImage] = useState(undefined)
    const [payDB, setPayDB] = useState(undefined)
    function onChangeHandler(e) {
        setDestinatario({ ...destinatario, [e.target.name]: e.target.value })
    }
    const handlerCountrySelect = (pais, cca3) => {
        setDestinatario({ ...destinatario, ['pais cuenta bancaria']: pais, cca3 })
    }
    const handlerIsSelect = () => {
        setIsSelect3(!isSelect3)
    }
    const handlerBankSelect2 = (i) => {
        setDestinatario({ ...destinatario, ['banco remitente']: i })
    }

    const handlerBankSelect = (i, data) => {
        setDestinatario({ ...destinatario, ['banco de transferencia']: i })
        setPayDB(data)
    }
    function manageInputIMG(e) {
        const file = e.target.files[0]
        setPostImage(file)
        setUrlPostImage(URL.createObjectURL(file))
    }
    const handlerIsSelect4 = () => {
        setIsSelect4(!isSelect4)
    }
    const handlerIsSelect5 = () => {
        setIsSelect5(!isSelect5)
    }





    function save(e, verif) {
        e.preventDefault()

        setModal('Verificando...')

        const reader = new FileReader();
        reader.onloadend = () => {
            // console.log(reader.result);
        }
        reader.readAsDataURL(postImage);

        const uuid = generateUUID()
        const date = new Date().getTime()
        const fecha = getDayMonthYear(date)
        const db = {
            ...destinatario,
            email: user.email,
        }



        const callback = async (object) => {


            getSpecificDataEq(`/envios/`, 'user uuid', user.uid, setEnviosDB)
            getSpecificDataEq(`/cambios/`, 'user uuid', user.uid, setCambiosDB)

            const botChat = ` 
            ---DATOS REGISTRO DE REMITENTE---\n
              Remitente: ${object['remitente']},\n
              Dni remitente: ${object['dni remitente']},\n
              Pais remitente: ${object['pais remitente']},\n
              Banco remitente: ${object['banco remitente']},\n
              Divisa de envio: ${object['divisa de envio']},\n
            
            -------DATOS DESTINATARIO-------\n
              Destinatario: ${object['destinatario']},\n
              DNI destinatario: ${object['dni']},\n
              Pais destinatario: ${object['pais']},\n
              Direccion: ${object['direccion']},\n
              Celular: ${object['celular']},\n
              Cuenta destinatario: ${object['cuenta destinatario']},\n
              Nombre de banco: ${object['nombre de banco']},\n
              Divisa de receptor: ${object['divisa de receptor']},\n
            
              ---DATOS DE TRANSACCION GENERALES---\n
              Operacion: ${object['operacion']},\n
              Importe: ${object['importe']},\n
              Comision: ${object['comision']},\n
              Cambio: ${object['cambio']},\n
              Estado: ${object['estado']},\n
              fecha: ${object['fecha']},\n
            
              ---DATOS DE TRANSACCION REMITENTE---\n
              Pais cuenta bancaria: ${object['pais cuenta bancaria']},\n
              Nombre de banco: ${object['nombre de banco']},\n
              Cuenta bancaria: ${object['cuenta bancaria']},\n
            
              ---DATOS DE TRANSACCION BOTTAK---\n
              banco de transferencia: ${object['banco de transferencia']},\n 
              `




            try {
                const response = await fetch('/api/postGoogleSheet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "op": "listar",
                        "remitente": object['remitente'],
                        "importe": object['importe'],
                        "user uuid": object['user uuid'],
                        "uuid": object.uuid,
                        "operacion": object['operacion']=== 'Envio'? 'envios':'cambios'
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();


                result.content.filter((i) => {
                    return
                })


                await fetch(`/api/sendEmail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: botChat, estado: db.estado, email: user.email })
                })

                await fetch(`/api/bot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: botChat, url: object.url }),
                })
            } catch (err) {
            }


            router.replace(`/Exitoso?uuid=${uuid}&operacion=${object['operacion'] === 'Cambio' ? 'cambios' : 'envios'}`)
            setModal('')
        }
        function callback2(object) {
            destinatario.operacion === 'Cambio'
                ? uploadStorage(`cambios/${uuid}`, postImage, { "remitente": object['remitente'],
                    "importe": object['importe'],
                    "user uuid": object['user uuid'],
                    "uuid": object.uuid,
                    "operacion": object['operacion']}, callback)
                : uploadStorage(`envios/${uuid}`, postImage, { "remitente": object['remitente'],
                    "importe": object['importe'],
                    "user uuid": object['user uuid'],
                    "uuid": object.uuid,
                    "operacion": object['operacion']}, callback)
        }


        destinatario.operacion === 'Cambio'
            ? uploadStorage(`cambios/${uuid}`, postImage, {
                ...db, ...verif, fecha,
                date,
                uuid,
            }, callback2)
            : uploadStorage(`envios/${uuid}`, postImage, {
                ...db, ...verif, fecha,
                date,
                uuid,
            }, callback2)
    }


    console.log(userDB)






    return (
        countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined
            ? <form className='relative w-full min-h-[80vh] space-y-6 lg:grid lg:grid-cols-2 lg:gap-5 ' onSubmit={(e) => save(e, { estado: 'En verificación', verificacion: false })}>
                {modal === 'Validando...' && <Loader> {modal} </Loader>}
                {modal === 'Verificando...' && <Loader> Enviando a verificación... </Loader>}

                <div className='w-full  col-span-2'>
                    <h3 className=' pb-3 text-white border-gray-100 border-b-[2px] text-right'>Datos Bancarios De Transacción</h3>
                </div>
                <div className='lg:hidden'>
                    <h3 className='text-center pb-3  text-green-400 lg:hidden'>Datos de cuenta remitente</h3>
                </div>
                <div className=' space-y-5'>
                    <Label htmlFor="">Pais de mi cuenta bancaria</Label>
                    <SelectCountry name="pais cuenta bancaria" propHandlerIsSelect={handlerIsSelect} propIsSelect={isSelect3} operation="recepcion" click={handlerCountrySelect} />
                </div>
                {destinatario !== undefined && destinatario['pais cuenta bancaria'] !== undefined && <div className=' space-y-5'>
                    <Label htmlFor="">Nombre de mi banco</Label>
                    <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect5} propIsSelect={isSelect5} operation="envio" click={handlerBankSelect2} arr={Object.values(countries[destinatario.cca3].countries)} />
                </div>}
                <div className=' space-y-5'>
                    <Label htmlFor="">Numero de mi cuenta bancaria</Label>
                    <Input type="text" name="cuenta bancaria" onChange={onChangeHandler} required />
                </div>

                {destinatario !== undefined && destinatario['pais cuenta bancaria'] !== undefined && <> <div className='lg:hidden'>
                    <h3 className='text-center pb-3  text-green-400 lg:hidden'>QR y cuenta para deposito Bancario</h3>
                </div>
                    <div className=' space-y-5'>
                        <Label htmlFor="">Elige una banco para deposito QR</Label>
                        <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect4} propIsSelect={isSelect4} operation="envio" click={handlerBankSelect} arr={Object.values(countries[destinatario.cca3].countries)} />
                    </div>
                </>}
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Numero de cuenta transferidora</Label>
                <Input type="text" name="cuenta transferidora" onChange={onChangeHandler} required />
            </div> */}
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Titular de banco de transferencia</Label>
                <Input type="text" name="titular de banco" onChange={onChangeHandler} required />
            </div> */}
                <div className='bg-white  col-span-2  lg:grid lg:grid-cols-2 lg:gap-5 p-5 place-items-center'>
                    {<div className='text-center w-full col-span-2 bg-gray-800 text-white py-5' >
                        EFECTUAR TRANSACCION <br />
                        verifique sus datos de transaccion para una oprima validacion
                    </div>}
                    {destinatario !== undefined && destinatario['banco de transferencia'] !== undefined && <div className=' space-y-5'>
                        {/* <Label htmlFor="">QR bancario para el deposito</Label> */}
                        <Link href='#' className="w-full flex flex-col justify-center items-center" download >
                            <label className=" flex flex-col justify-start items-center w-[300px] h-auto bg-white border border-gray-300 text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                                {countries && countries[userDB.cca3] && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined
                                    ? <img className=" flex justify-center items-center w-[300px] h-auto bg-white border border-gray-300 text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined ? countries[userDB.cca3].countries[destinatario['banco de transferencia']].qrURL : ''} alt="" />
                                    : 'QR no disponible'}
                                {destinatario && destinatario.importe} {destinatario && destinatario['divisa de envio']}
                            </label>
                        </Link>
                        <span className="block text-black text-center" >Cta. {countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']]['cta bancaria']} <br />
                            {destinatario !== undefined && destinatario['banco de transferencia'] !== undefined && countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']].banco}</span>
                    </div>}

                    <div className='lg:hidden'>
                        <h3 className='text-center pb-3  text-green-400 lg:hidden'>Informacion de transferencia</h3>
                    </div>
                    {destinatario !== undefined && destinatario['banco de transferencia'] !== undefined && <div className=' space-y-5'>
                        {/* <Label htmlFor="">Baucher de transferencia</Label> */}
                        <div className="w-full flex justify-center">
                            <label htmlFor="file" className="flex justify-center items-center w-[300px] min-h-[300px] bg-white border border-gray-300 border-dotted text-center text-gray-900 text-[14px] focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                                {urlPostImage !== undefined ? <img className="flex justify-center items-center w-[300px] min-h-[300px] bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={urlPostImage} alt="" />
                                    : 'Subir baucher'}
                            </label>
                            <input className="hidden" id='file' name='name' onChange={manageInputIMG} accept=".jpg, .jpeg, .png, .mp4, webm" type="file" required />
                        </div>
                    </div>}


                    {countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && <div className='flex w-full justify-around items-end col-span-2'>
                        <Button type='submit' theme='Success' >Verificar Transacción</Button>
                        {/* <Button type='button' theme='Success' click={validateTransaction} >Verificar Transacció</Button> */}
                    </div>}

                </div>




                {success == 'CompletePais' && <Msg>Seleccione un pais</Msg>}
            </form>
            : <ModalINFO theme={'Danger'} alert={false} button="Volver" funcion={() => router.replace('/')} close={true} >Por el momento no hay bancos disponibles para tu pais</ModalINFO>
    )
}

export default WithAuth(Home)

