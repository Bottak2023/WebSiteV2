'use client'

import { writeUserData, getSpecificData } from '@/firebase/database'
import { useState, useEffect } from 'react'
import { useUser } from '@/context/Context.js'
import { getDayMonthYear } from '@/utils/date'
import { WithAuth } from '@/HOCs/WithAuth'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import { useMask } from '@react-input/mask';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/utils/UUIDgenerator'

function Home() {
    const { nav, setNav, user, userDB, setUserProfile, select, setSelect, select2, comision, modal, setModal, setTransferencia, transferencia, divisas, setDivisas, destinatario, setDestinatario, fecha, setFecha, qr, setQr, QRurl, setQRurl, } = useUser()
    const [state, setState] = useState({})
    const router = useRouter()

    const inputRefWhatsApp = useMask({ mask: '+ 591 __ ___ ___', replacement: { _: /\d/ } });
    const redirectHandler = (route) => {
        router.replace(route)
    }
    function save(e) {
        e.preventDefault()
        e.stopPropagation()
        const db = {
            ...destinatario,
            remitente: userDB && userDB && userDB.nombre,
            ['dni remitente']: userDB && userDB && userDB.dni,
            ['pais remitente']: userDB && userDB && userDB.pais,
            ['divisa de envio']: select,
            importe: transferencia + comision,
            comision,
            ['divisa de receptor']: select2,
            cambio: divisas && divisas[select] && divisas[select2] ? divisas && divisas[select] && divisas[select2] && ((transferencia + comision) * divisas[select2].venta / divisas[select].venta).toFixed(2) : '',
            estado: 'En verficación',
            ['user uuid']: user.uid,
            notificaciones: true,

        }
        setDestinatario(db)
        router.push('/Transferir')
        // writeUserData(`users/${user.uid}/historial/${uuid}`, db, setUserSuccess)
        // writeUserData(`envios/${uuid}`, db, setUserSuccess, callback)
    }

    useEffect(() => {
        destinatario === undefined && router.replace('/')
    })
    return (
        <div className='w-full'>
            {modal === 'Guardando...' && <Loader> {modal} </Loader>}
            {destinatario !== undefined && transferencia !== '' && <div className='relative left-0 right-0 mx-0 sm:max-h-[80vh] overflow-y-auto rounded-[20px]'>
                <table className="relative sm:left-0 sm:right-0 mx-auto lg:left-auto lg:right-auto w-full overflow-hidden sm:w-[500px] lg:min-w-auto text-[14px] text-left text-gray-500 bg-white rounded-[20px]" style={{ height: '100px' }}>
                    <thead className="w-full text-[14px] text-gray-700 uppercase bg-gray-50">
                        <tr className="w-full text-[14px] text-center font-semibold border-b hover:bg-gray-50 ">
                            <th></th>
                            <th className='px-2 py-2 text-left'>Datos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                Remitente
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {userDB && userDB && userDB.nombre}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                DNI remitente
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {userDB && userDB && userDB.dni}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                Pais remitente
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {userDB && userDB && userDB.pais}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                Destinatario
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {destinatario.destinatario && destinatario.destinatario}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                DNI destinatario
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {destinatario.dni && destinatario.dni}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                Pais destinatario
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {destinatario.pais && destinatario.pais}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2 flex flex-col text-[14px] text-gray-700 ">
                                Celular de destinatario
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {destinatario.celular && destinatario.celular}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                Cuenta destinatario:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {destinatario['cuenta destinatario'] && destinatario['cuenta destinatario']}
                            </td>
                        </tr>
                        {/* <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                Divisa de envio:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {select}
                            </td>
                        </tr> */}
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                Importe mas comision:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {transferencia + comision} {select}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                comision:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {comision} {select}
                            </td>
                        </tr>
                        {/* <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                Divisa de receptor:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {select2}
                            </td>
                        </tr> */}
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                Importe mas comision <br /> con el cambio aplicado:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {divisas && divisas[select] && divisas[select2] ? divisas && divisas[select] && divisas[select2] && ((transferencia + comision) * divisas[select2].venta / divisas[select].venta).toFixed(2) : ''} {select2}
                            </td>
                        </tr>
                        <tr className=" text-[14px] border-b hover:bg-gray-50 " >
                            <td className="px-2 py-2  text-gray-900 ">
                                Operacion:
                            </td>
                            <td className="px-2 py-2  text-gray-900 ">
                                {destinatario.operacion}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex justify-center pt-5'>
                    <Button theme='Primary' click={save}>Confirmar datos</Button>
                </div>
            </div>}
        </div>
    )
}

export default WithAuth(Home)

// function save(e) {
//     e.preventDefault()
//     e.stopPropagation()
//     const uuid = generateUUID()
//     const date = new Date().getTime()
//     const fecha = getDayMonthYear(date)
//     const db = {
//         ...destinatario,
//         remitente: userDB && userDB && userDB.nombre,
//         ['dni remitente']: userDB && userDB && userDB.dni,
//         ['pais remitente']: userDB && userDB && userDB.pais,
//         ['divisa de envio']: select,
//         importe: transferencia,
//         ['divisa de receptor']: select2,
//         cambio: divisas && divisas[select] && divisas[select2] ? divisas && divisas[select] && divisas[select2] && (transferencia * divisas[select2].venta / divisas[select].venta).toFixed(2) : '',
//         fecha,
//         date,
//         estado: 'En verficación',
//         uuid,
//         ['user uuid']: user.uid,
//     }
//     setModal('Guardando...')
//     const callback = () => {
//         redirectHandler(`/Exitoso?uuid=${uuid}`)
//         setModal('')
//     }
//     // writeUserData(`users/${user.uid}/historial/${uuid}`, db, setUserSuccess)
//     writeUserData(`envios/${uuid}`, db, setUserSuccess, callback)
// }