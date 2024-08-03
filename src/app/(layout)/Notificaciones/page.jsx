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
            console.log(scrollLeft)
            const itemWidth = screen.width - 50
            refFirst.current.scrollLeft = scrollLeft - itemWidth;
        });
    };
    const next = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            console.log(scrollLeft)
            const itemWidth = screen.width - 50
            console.log(itemWidth)
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
                <div className={'bg-white top-[70px] w-full sm:w-[500px] p-5 z-40 sm-right-[10px]'}>
                    {enviosDB && enviosDB !== undefined && cambiosDB && cambiosDB !== undefined ? <ul> {Object.values({ ...enviosDB, ...cambiosDB }).sort((a, b) => b.date - a.date ).map((i, index) => {
                        return<li className='relative pb-4 border-b-[1px] border-gray-300' >
                        <span className='w-full pr-[10px]'>Tu {i.operacion} de dinero de 
                        <b> {i['divisa de envio']} {i.importe}</b>  {i.destinatario !== undefined ? `a ${i.destinatario}, `: ''} 
                        <span className={`${i.estado == 'En verficación' && 'bg-gray-100'}   ${i.estado == 'Transfiriendo' && 'bg-yellow-300'}   ${i.estado == 'Exitoso' && 'bg-green-400'} ${i.estado == 'Rechazado' && 'bg-red-400'}`}>{i.estado === 'En verficación' && 'esta en verificación'}</span>
                        <span className={`${i.estado == 'En verficación' && 'bg-gray-100'}   ${i.estado == 'Transfiriendo' && 'bg-yellow-300'}   ${i.estado == 'Exitoso' && 'bg-green-400'} ${i.estado == 'Rechazado' && 'bg-red-400'}`}>{i.estado === 'Transfiriendo' && 'ya se esta transfiriendo'}</span>
                        <span className={`${i.estado == 'En verficación' && 'bg-gray-100'}   ${i.estado == 'Transfiriendo' && 'bg-yellow-300'}   ${i.estado == 'Exitoso' && 'bg-green-400'} ${i.estado == 'Rechazado' && 'bg-red-400'}`}>{i.estado === 'Exitoso' && 'ha sido exitoso'}</span>
                        <span className={`${i.estado == 'En verficación' && 'bg-gray-100'}   ${i.estado == 'Transfiriendo' && 'bg-yellow-300'}   ${i.estado == 'Exitoso' && 'bg-green-400'} ${i.estado == 'Rechazado' && 'bg-red-400'}`}>{i.estado === 'Rechazado' && 'ha sido rechazado'}</span>
                        </span>
                        <span className="absolute bottom-[3px] right-0 text-[10px]">{getDayMonthYear(i.date)}</span>
                       
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




















