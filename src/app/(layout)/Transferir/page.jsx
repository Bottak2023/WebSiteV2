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
import { getSpecificDataEq, getSpecificData, writeUserData, removeData } from '@/firebase/database'

import Link from 'next/link'
function Home() {

    const { nav, setNav, user, userDB, setUserProfile, select, setDestinatario, success, setUserData, postsIMG, setUserPostsIMG, isSelect3, setIsSelect3, isSelect4, setIsSelect4, modal, setModal, destinatario, qr, setQr, QRurl, setQRurl, countries, setEnviosDB, setCambiosDB, setIsSelect5, isSelect5 } = useUser()
    const router = useRouter()

    const [postImage, setPostImage] = useState(undefined)
    const [urlPostImage, setUrlPostImage] = useState(undefined)

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

    const handlerBankSelect = (i) => {
        setDestinatario({ ...destinatario, ['banco de transferencia']: i })
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
    function save(e) {

        e.preventDefault()
        e.stopPropagation()

        console.log('button')

        const reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader.result);
        }
        reader.readAsDataURL(postImage);

        const uuid = generateUUID()
        const date = new Date().getTime()
        const fecha = getDayMonthYear(date)
        const db = {
            ...destinatario,
            fecha,
            date,
            uuid,
            email: user.email
        }
        setModal('Guardando...')
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
            await fetch(`/api/sendEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: botChat, estado : object['estado'], email: user.email})
            })
            await fetch(`/api/bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: botChat, url: object.url }),
            })
            router.push(`/Exitoso?uuid=${uuid}`)
            setModal('')
        }
        destinatario.operacion === 'Cambio'
            ? uploadStorage(`cambios/${uuid}`, postImage, db, callback)
            : uploadStorage(`envios/${uuid}`, postImage, db, callback)
        // writeUserData(`envios/${uuid}`, db, setUserSuccess, callback)
    }

    downloadFile(`/currencies/${userDB.cca3.toUpperCase()}`)




    return (
        countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined
            ? <form className='w-full min-h-[80vh] space-y-6 lg:grid lg:grid-cols-2 lg:gap-5' onSubmit={save}>
                {modal === 'Guardando...' && <Loader> {modal} </Loader>}
                <div className='w-full border-b-[2px] border-gray-100 col-span-2'>
                    <h3 className=' pb-3 text-white  text-right'>Efectuar transacción</h3>
                </div>
                <div className='lg:hidden'>
                    <h3 className='text-center pb-3  text-green-400 lg:hidden'>Datos de cuenta remitente</h3>
                </div>
                <div className=' space-y-5'>
                    <Label htmlFor="">Pais de cuenta bancaria</Label>
                    <SelectCountry name="pais cuenta bancaria" propHandlerIsSelect={handlerIsSelect} propIsSelect={isSelect3} operation="recepcion" click={handlerCountrySelect} />
                </div>
                {destinatario !== undefined && destinatario['pais cuenta bancaria'] !== undefined && <div className=' space-y-5'>
                    <Label htmlFor="">Nombre de banco</Label>
                    <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect5} propIsSelect={isSelect5} operation="envio" click={handlerBankSelect2} arr={Object.values(countries[destinatario.cca3].countries)} />
                </div>}
                <div className=' space-y-5'>
                    <Label htmlFor="">Numero de cuenta bancaria</Label>
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

                {destinatario !== undefined && destinatario['banco de transferencia'] !== undefined && <div className=' space-y-5'>
                    <Label htmlFor="">QR bancario</Label>
                    <Link href='#' className="w-full flex flex-col justify-center items-center" download >
                        <label className=" flex flex-col justify-start items-center w-[200px] h-[230px] bg-white border border-gray-300 text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                            {countries && countries[userDB.cca3] && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined ? <img className=" flex justify-center items-center w-[200px] h-[200px] bg-white border border-gray-300 text-gray-900 text-[12px]  focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined ? countries[userDB.cca3].countries[destinatario['banco de transferencia']].qrURL : ''} alt="" />
                                : 'QR no disponible'}
                            {destinatario && destinatario.importe} {destinatario && destinatario['divisa de envio']}
                        </label>
                    </Link>
                    <span className="block text-white text-center" >Cta. {countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']]['cta bancaria']} <br />
                        {destinatario !== undefined && destinatario['banco de transferencia'] !== undefined && countries && countries !== undefined && countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']] !== undefined && countries[userDB.cca3].countries[destinatario['banco de transferencia']].banco}</span>
                </div>}
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Cuenta bancaria</Label>
                <span className="block text-white text-center" >{countries && countries !== undefined && countries[userDB.cca3]['cuenta de cobro'] !== undefined && countries[userDB.cca3]['cuenta de cobro']} <br />
                    {countries && countries !== undefined && countries[userDB.cca3]['cuenta de cobro'] !== undefined && countries[userDB.cca3]['banco de cobro']}</span>
            </div> */}

                <div className='lg:hidden'>
                    <h3 className='text-center pb-3  text-green-400 lg:hidden'>Informacion de transferencia</h3>
                </div>
                <div className=' space-y-5'>
                    <Label htmlFor="">Baucher de transferencia</Label>
                    <div className="w-full flex justify-center">
                        <label htmlFor="file" className="flex justify-center items-center w-[200px] h-[200px] bg-white border border-gray-300 text-center text-gray-900 text-[14px] focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" >
                            {urlPostImage !== undefined ? <img className="flex justify-center items-center w-[200px] h-[200px] bg-white border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 rounded-[10px]" style={{ objectPosition: 'center' }} src={urlPostImage} alt="" />
                                : 'Subir baucher'}
                        </label>
                        <input className="hidden" id='file' name='name' onChange={manageInputIMG} accept=".jpg, .jpeg, .png, .mp4, webm" type="file" required />
                    </div>
                </div>
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Banco de transferencia</Label>
                 <SelectBank name="nombre de banco" propHandlerIsSelect={handlerIsSelect4} propIsSelect={isSelect4} operation="envio" click={handlerBankSelect} arr={Object.values(countries[userDB.cca3].countries)} />
            </div>
            <div className=' space-y-5'>
                <Label htmlFor="">Numero de cuenta transferidora</Label>
                <Input type="text" name="cuenta transferidora" onChange={onChangeHandler} required />
            </div> */}
                {/* <div className=' space-y-5'>
                <Label htmlFor="">Titular de banco de transferencia</Label>
                <Input type="text" name="titular de banco" onChange={onChangeHandler} required />
            </div> */}
                {countries[userDB.cca3] !== undefined && countries[userDB.cca3].countries !== undefined && <div className='flex w-full justify-around items-end col-span-2'>
                    <Button theme='Primary' >Guardar</Button>
                </div>}
                {success == 'CompletePais' && <Msg>Seleccione un pais</Msg>}
            </form>
            : <ModalINFO theme={'Danger'} alert={false} button="Volver" funcion={() => router.replace('/')} close={true} >Por el momento no hay bancos disponibles para tu pais</ModalINFO>
    )
}

export default WithAuth(Home)

