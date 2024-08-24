'use client';
import { useUser } from '@/context/Context'
import { useEffect, useState, useRef } from 'react'
import { getDayMonthYear } from '@/utils/date'

export default function Home() {

    const { user, userDB, setUserProfile, modal, setModal, enviosDB, cambiosDB, postsIMG, setUserPostsIMG, divisas, setDivisas, item, setItem, exchange, setExchange, } = useUser()
    const [filter, setFilter] = useState('')
    const refFirst = useRef(null);

    function onChangeFilter(e) {
        setFilter(e.target.value)
    }
    function sortArray(x, y) {
        if (x['currency'].toLowerCase() < y['currency'].toLowerCase()) { return -1 }
        if (x['currency'].toLowerCase() > y['currency'].toLowerCase()) { return 1 }
        return 0
    }
    const prev = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            
            const itemWidth = screen.width - 50
            refFirst.current.scrollLeft = scrollLeft - itemWidth;
        });
    };
    const next = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            
            const itemWidth = screen.width - 50

            refFirst.current.scrollLeft = scrollLeft + itemWidth;
        });
    };
    console.log({ ...enviosDB, ...cambiosDB })
    return (
        <main className='w-full h-full'>
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:left-[20px]' onClick={prev}>{'<'}</button>
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:right-[20px]' onClick={next}>{'>'}</button>
            <div className="w-full   relative h-full overflow-auto shadow-2xl p-5 bg-white min-h-[80vh] scroll-smooth" ref={refFirst}>
                <h3 className='font-medium text-[16px]'>Historial de notificaciones</h3>
                <br />
                {/* <div className="w-[405px] grid grid-cols-2 gap-[5px]" >
                    <input type="text" className='border-b-[1px] text-[14px] outline-none w-[200px]' onChange={onChangeFilter} placeholder='Buscar Destinatario' />
                </div> */}
                <div className={'bg-white top-[70px] w-full  p-5 z-40 sm-right-[10px]'}>
                    {((enviosDB && enviosDB !== undefined) || (cambiosDB && cambiosDB !== undefined)) ? <ul> {Object.values(enviosDB && enviosDB !== undefined && cambiosDB && cambiosDB !== undefined ? { ...enviosDB, ...cambiosDB } : (enviosDB && enviosDB !== undefined ? enviosDB : (cambiosDB && cambiosDB !== undefined ? cambiosDB : {}))).sort((a, b) => b.date - a.date).map((i, index) => {
                        return <li className='relative pb-8 border-b-[1px] border-gray-300' >
                            <span className='w-full pr-[10px]'>Tu {i.operacion} de dinero de
                                <b> {i['divisa de envio']} {i.importe}</b>  {i.destinatario !== undefined ? `a ${i.destinatario}, ` : ''}
                                {i.estado == 'En verificación' && <span className={` text-black`}>esta en verificación.</span>}
                                {i.estado == 'Verificado' && <span className={` text-black  bg-blue-100`}>esta VERIFICADO, la transaferencia esta apunto de realizarse.</span>}
                                {i.estado == 'Transfiriendo' && <span className={` text-black  bg-yellow-100`}>'ya se esta transfiriendo.</span>}
                                {i.estado == 'Exitoso' && <span className={` text-black bg-green-100`}>ha sido exitoso.</span>}
                                {i.estado == 'Rechazado' && <span className={` text-black bg-red-100 `}>ha sido rechazado.</span>}

                            </span>
                            <span className="absolute bottom-[15px] right-0 text-[10px]">{getDayMonthYear(i.date)}</span>
                            <span className="absolute bottom-[2px] right-0 text-[10px]">ID:{i.uuid}</span>


                        </li>


                    })
                    }</ul>
                        : <ul>
                            <li className='pb-4 border-b-[1px] border-gray-300'>Sin notificaciones</li>
                        </ul>}
                </div>
            </div>
        </main>
    )
}




















