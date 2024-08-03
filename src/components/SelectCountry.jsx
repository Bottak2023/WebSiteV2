'use client'

import React, { useState, useEffect } from "react";
import { useUser } from '@/context/Context'
import { writeUserData, getSpecificData } from "@/firebase/database"

export default function App({ propIsSelect, propHandlerIsSelect, operation, click }) {
    const { countries } = useUser()
    const [countrie, setCountrie] = useState(undefined)
    const [select, setSelect] = useState('Seleccionar')
    const [flag, setFlag] = useState('')

    function handlerUserSelect(e, i) {
        setSelect(i.translation.spa.common)
        setFlag(i.flagPNG)
        click(i.translation.spa.common, i.cca3)
        setCountrie(i)
    }
    function handlerIsSelect(e, i) {
        e.stopPropagation()
        propHandlerIsSelect()
    }

    return (
        <div className={`relative w-full sm:max-w-[380px] bg-transparent border border-gray-300 text-gray-900 text-[14px] rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-0 `} >
            <div className='relative w-full bg-transparent flex justify-between items-center'>
                <span className=" w-full text-gray-100 p-3 " onClick={(e) => handlerIsSelect(e)}>{select}</span>
                <span className='w-[auto] flex items-center rounded-[20px] '><img src={flag} className="max-w-[50px] h-[30px]" alt="" /></span>
                <span className={propIsSelect ? 'text-white text-center w-[10%] right-5 rotate-[270deg] p-3 ' : 'text-white text-center w-[10%] right-5 rotate-90 p-3 '} onClick={(e) => handlerIsSelect(e)}>{'>'}</span>
            </div>
            {propIsSelect === false && operation === 'recepcion' && countrie && countrie !== undefined && countrie.translation.spa.common === select && countrie['envio'] !== true && <span className=" inline-block text-green-400 text-[14px] font-light p-3">{countrie.translation.spa.common} esta habilitado unicamente para recepciones de dinero</span>}
            <div className={`absolute left-0 top-10 bg-gray-100 flex flex-col justify-start items-center  text-gray-900 text-[14px] rounded-b-xl focus:ring-blue-500 focus:outline-blue-500 w-full   z-30 overflow-y-auto transition-all ${propIsSelect ? 'h-[150px] outline outline-1 outline-gray-300' : 'h-0 overflow-y-hidden'}`} >
                <ul className="inline-block w-full">
                    {Object.values(countries).map((i, index) => ((i[operation] !== undefined && i[operation] !== false && i[operation] !== null) || (i['envio'] !== undefined && i['envio'] !== false && i['envio'] !== null)) &&
                        <li className='w-full h-[50px] flex justify-start items-center px-10' key={index} onClick={(e) => handlerUserSelect(e, i)}>
                            <span className="inline-block w-30px] h-[20px]"><img src={i.flagPNG} className="w-[30px] h-[20px]" alt="" /></span>
                            <span className="pl-5"> {i.translation.spa.common}</span>
                        </li>)}
                </ul>
            </div>
        </div>
    );
}

// --------------------------------IMPORTANTE-----------------------

// const fetchdata = async (e) => {
//     const res = await fetch('https://restcountries.com/v3.1/all')
//     const db = await res.json()

//     console.log(db)
//     const data = db.reduce((acc, i) => {
//         const obj = {
//             cambioUSD: 0,
//             cambio: false,
//             cca2: i.cca2,
//             cca3: i.cca3,
//             ccn3: i.ccn3 ? i.ccn3 : 'non exist',
//             cioc: i.cioc !== undefined ? i.cioc : i.status,
//             remesas: false,
//             code: i.currencies && Object.keys(i.currencies)[0] !== null && Object.keys(i.currencies)[0] !== undefined ? Object.keys(i.currencies)[0] : i.cca3,
//             symbol: i.currencies && i.currencies[Object.keys(i.currencies)[0]].symbol ? i.currencies[Object.keys(i.currencies)[0]].symbol : 'non exist',
//             currency: i.currencies && i.currencies[Object.keys(i.currencies)[0]].name ? i.currencies[Object.keys(i.currencies)[0]].name : 'non exist',
//             flagSVG: i.flags.svg,
//             flagPNG: i.flags.png,
//             translation: i.translations
//         }
//         console.log(obj)
//         return { ...acc, [obj.cca3]: obj }
//     }, {})

//     return writeUserData('currencies', data, setUserSuccess)
// }

// -------------------------------------------------


// const fetchdata = async (e) => {
//     const res = await fetch('https://restcountries.com/v3.1/all')
//     const db = await res.json()

//     console.log(db)
//     const data = db.reduce((acc, i) => {
//         const obj = {
//             cambioUSD: 0,
//             cambio: false,
//             cca2: i.cca2,
//             cca3: i.cca3,
//             ccn3: i.ccn3,
//             cioc: i.cioc !== undefined ? i.cioc : i.status,
//             remesas: false,
//             code: i.currencies && Object.keys(i.currencies)[0] !== null && Object.keys(i.currencies)[0] !== undefined ? Object.keys(i.currencies)[0] : i.cca3,
//             symbol: i.currencies && i.currencies[Object.keys(i.currencies)[0]].symbol ? i.currencies[Object.keys(i.currencies)[0]].symbol : 'non exist',
//             currency: i.currencies && i.currencies[Object.keys(i.currencies)[0]].name ? i.currencies[Object.keys(i.currencies)[0]].name : 'non exist',
//             flagSVG: i.flags.svg,
//             flagPNG: i.flags.png,
//             translation: i.transalations ? i.transalations : 'non exist',
//         }
//         console.log(obj)
//         return { ...acc, [obj.code !== null && obj.code !== undefined ? obj.code : obj.ccn3]: obj }
//     }, {})

//     return writeUserData('currencies', data, setUserSuccess)
// }



