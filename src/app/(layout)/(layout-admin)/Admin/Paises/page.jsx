'use client';
import { useUser } from '@/context/Context'
import { getSpecificData, writeUserData, removeData } from '@/firebase/database'
import { uploadStorage } from '@/firebase/storage'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
// import { getCurrencyExchange } from '@/currency';
import Modal from '@/components/Modal'
import Label from '@/components/Label'
import Input from '@/components/Input'
import { useRouter } from 'next/navigation';



export default function Home() {

  const { user, userDB, setUserProfile, modal, setModal, users, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, setCountries, item, setItem, exchange, setExchange, countries } = useUser()
  const router = useRouter()
  const [filter, setFilter] = useState('')
  const [state, setState] = useState({})
  const [temporal, setTemporal] = useState(undefined)
  const [postImage, setPostImage] = useState({})
  const [urlPostImage, setUrlPostImage] = useState({})
  const refFirst = useRef(null);

  const [bankDB, setBankDB] = useState(null)
  const [routeCountry, setRouteCountry] = useState(null)
  const [bank, setBank] = useState(null)

  const [postImageBank, setPostImageBank] = useState({})
  const [urlPostImageBank, setUrlPostImageBank] = useState({})

  const [postImageQR, setPostImageQR] = useState({})
  const [urlPostImageQR, setUrlPostImageQR] = useState({})

  function onChangeFilter(e) {
    setFilter(e.target.value)
  }


  function sortArray(x, y) {
    if (x['translation']['spa']['common'].toLowerCase() < y['translation']['spa']['common'].toLowerCase()) { return -1 }
    if (x['translation']['spa']['common'].toLowerCase() > y['translation']['spa']['common'].toLowerCase()) { return 1 }
    return 0
  }
  function onChangeHandler(e, i) {
    setState({ ...state, [i.cca3]: { ...state[i.cca3], [e.target.name]: e.target.value } })
  }
  function manage(i, data, operacion) {
    setItem(i)
    setModal(operacion)
  }
  function save(i) {
    setItem(i)
    setModal('Save')
  }

  function disableConfirm(operacion) {
    function callback() {
      getSpecificData('currencies', setCountries, () => { setModal('') })
    }
    setModal('Guardando...')
    writeUserData(`currencies/${item.cca3}`, { [operacion]: item[operacion] === undefined || item[operacion] === false ? true : false }, setUserSuccess, callback)
  }
  async function saveConfirm() {

    function callback2() {
      const obj = { ...state }
      delete obj[item.cca3]
      setState(obj)

      const obj2 = { ...postImage }
      delete obj2[item.cca3]
      setState(obj2)

      setModal('')
    }

    function callback() {
      getSpecificData('currencies', setCountries, callback2)
    }

    setModal('Guardando...')
    postImage[item.cca3]
      ? await uploadStorage(`currencies/${item.cca3}`, postImage[item.cca3], state[item.cca3], callback)
      : await writeUserData(`currencies/${item.cca3}`, state[item.cca3], setUserSuccess, callback)

    return
  }
  function manageInputIMG(e, name) {
    const file = e.target.files[0]
    setPostImage({ ...postImage, [name]: file })
    setUrlPostImage({ ...urlPostImage, [name]: URL.createObjectURL(file) })
  }


  function handlerAddBank(i) {
    setRouteCountry(i)
  }

  function saveBank(e) {
    e.preventDefault()
    const callback2 = () => {
      getSpecificData(`/currencies/`, setCountries)
      setRouteCountry(null)
    }
    const callback = () => {
      uploadStorage(`currencies/${routeCountry.cca3}/countries/${e.target[3].value}`, postImageQR, { banco: e.target[3].value, ['cta bancaria']: e.target[4].value }, callback2, 'qrURL')
    }
    uploadStorage(`currencies/${routeCountry.cca3}/countries/${e.target[3].value}`, postImageBank, { banco: e.target[3].value, ['cta bancaria']: e.target[4].value }, callback)
  }
  function manageInputIMGbank(e, name) {
    const file = e.target.files[0]
    setPostImageBank(file)
    setUrlPostImageBank(URL.createObjectURL(file))
  }
  function manageInputQRbank(e, name) {
    const file = e.target.files[0]
    setPostImageQR(file)
    setUrlPostImageQR(URL.createObjectURL(file))
  }
  function handlerBankRemove(i, e) {
    setModal('DELETE')
    setBankDB({
      route: `currencies/${i.cca3}/countries/${e.banco}`,
      banco: e.banco
    })
    // console.log(`currencies/${i.cca3}/countries/${e.banco}`)
    // removeData(`currencies/${i.cca3}/countries/${e.banco}`, setUserSuccess, callback)
  }
  function deletConfirmBank() {
    const callback = () => {
      getSpecificData(`/currencies/`, setCountries)
      setModal('')
    }
    removeData(`${bankDB.route}`, setUserSuccess, callback)
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
  console.log(postImage)
  return (
    <main className='h-full w-full'>
      {modal === 'Guardando...' && <Loader> {modal} </Loader>}
      {modal === 'Save' && <Modal funcion={saveConfirm}>Estas por modificar los datos de:  {item['currency']}</Modal>}
      {modal === 'recepcion' && <Modal funcion={() => disableConfirm('recepcion')}>Estas por {item.recepcion !== undefined && item.recepcion !== false ? 'DESABILITAR' : 'HABILITAR'} la RECEPCIÓN para el siguiente pais:  {item['currency']}</Modal>}
      {modal === 'envio' && <Modal funcion={() => disableConfirm('envio')}>Estas por {item.envio !== undefined && item.envio !== false ? 'DESABILITAR' : 'HABILITAR'} el ENVIO para el siguiente pais:   {item['currency']}</Modal>}
      {modal === 'DELETE' && bankDB !== null && <Modal theme="Danger" button="Eliminar" funcion={deletConfirmBank}>Estas por eliminar al siguiente banco:  {bankDB['banco']}</Modal>}

      <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:left-[20px]' onClick={prev}>{'<'}</button>
      <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:right-[20px]' onClick={next}>{'>'}</button>

      <div className="w-full   relative h-full overflow-auto shadow-2xl p-5 bg-white min-h-[80vh] scroll-smooth" ref={refFirst}>
        <h3 className='font-medium text-[14px]'>Lista de paises y operaciones habilitadas por BOTTAK</h3>
        <br />
        <input type="text" className='border-b-[1px] text-[14px] outline-none w-[400px]' onChange={onChangeFilter} placeholder='Buscar Divisa' />
        <br />
        <br />
        <table className="w-full overflow-visible min-w-[1800px]  text-[14px] text-left text-gray-500 border-t-4 border-gray-400" >
          {/* <table className="relative w-full overflow-scroll max-w-[800px] h-[50px]  text-[14px] text-left text-gray-500 border-t-4 border-gray-400"> */}
          <thead className="text-[14px] text-gray-700 uppercase bg-white">
            <tr>
              <th scope="col" className=" px-3 py-3">
                #
              </th>
              <th scope="col" className=" px-3 py-3">
                Pais
              </th>
              <th scope="col" className=" px-3 py-3">
                Divisa <br />
                Code
              </th>
              {/* <th scope="col" className="text-center px-3 py-3">
                Cuenta de cobro
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Banco de cobro
              </th>
              <th scope="col" className="text-center px-3 py-3">
                QR de cobro
              </th> */}
              <th scope="col" className="text-center px-3 py-3">
                Bancos admitidos
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Recepción
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Envio
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Guardar
              </th>
            </tr>
          </thead>
          <tbody>
            {countries && countries !== undefined && Object.values(countries).sort(sortArray).map((i, index) => {
              return i.currency !== undefined && i.currency.toLowerCase().includes(filter.toLowerCase()) && <tr className={`text-[14px] border-b hover:bg-gray-100  ${index % 2 === 0 ? '' : ''} `} key={index}>
                <td className="px-3 py-4  flex text-gray-900 ">
                  <span className='h-full flex py-2'>{index + 1}</span>
                </td>
                <td className="px-3 py-4 text-gray-900 ">
                  {i['translation']['spa']['common']}
                </td>
                <td className="px-3 py-4 text-gray-900 ">
                  {i.code}
                </td>
                {/* <td className="px-3 py-4 text-gray-900 ">
                  <input type="text" name="cuenta de cobro" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['cuenta de cobro'] !== undefined ? i['cuenta de cobro'] : 0} />
                </td>
                <td className="px-3 py-4 text-gray-900 ">
                  <input type="text" name="banco de cobro" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['banco de cobro'] !== undefined ? i['banco de cobro'] : 0} />
                </td>
                <td className="px-3 py-4 w-[100px] text-gray-900 ">
                  <label htmlFor={`img${index}`}>
                    <img src={urlPostImage[i.cca3] ? urlPostImage[i.cca3] : i.url} alt="Subir QR" />
                    <input id={`img${index}`} type="file" onChange={(e) => manageInputIMG(e, i.cca3)} className='hidden' accept='image/*' />
                  </label>
                </td> */}
                <td className="w-[500px] px-3 py-4 text-gray-900 ">
                  {i.countries !== undefined && Object.values(i.countries).map((e, index) => <div className='flex items-center justify-between border-b-[1px] border-gray-400 py-2'>
                    <img src={e.url} className='w-[30px]' alt="Subir QR" /> 
                    <img src={e.qrURL} className='w-[30px]' alt="Subir QR" />
                    <span className='inline-block  pl-[10px]'>{e.banco}</span>
                    <span className='inline-block  pl-[10px]'>{e['cta bancaria']}</span>
                    <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" onClick={() => handlerBankRemove(i, e)}>
                      <path fill="#f44336" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path><line x1="16.9" x2="31.1" y1="16.9" y2="31.1" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="4"></line><line x1="31.1" x2="16.9" y1="16.9" y2="31.1" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="4"></line>
                    </svg>
                  </div>)}
                  <div className='relative left-0 right-0 mx-auto w-[200px] pt-5'>
                    <Button theme={"Success"} click={() => handlerAddBank(i)}>Agregar Banco</Button>
                  </div>
                </td>
                <td className="px-3 py-4">
                  {i.recepcion !== undefined && i.recepcion !== false
                    ? <Button theme={"Success"} click={() => manage(i, 'Desabilitar', 'recepcion')}>Habilitado</Button>
                    : <Button theme={"Danger"} click={() => manage(i, 'Habilitar', 'recepcion')}>Desabilitado</Button>
                  }
                </td>
                <td className="px-3 py-4">
                  {i.envio !== undefined && i.envio !== false
                    ? <Button theme={"Success"} click={() => manage(i, 'Desabilitar', 'envio')}>Habilitado</Button>
                    : <Button theme={"Danger"} click={() => manage(i, 'Habilitar', 'envio')}>Desabilitado</Button>
                  }
                </td>
                <td className="px-3 py-4">
                  {(state && state[i.cca3] !== undefined) || (postImage && postImage[i.cca3] !== undefined)
                    ? <Button theme={"Success"} click={() => save(i)}>Guardar</Button>
                    : <Button theme={"Disable"} >Disable</Button>
                  }
                </td>
              </tr>
            })
            }
          </tbody>
        </table>








        {routeCountry &&
          <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center p-5 z-50 bg-[#000000C7]'>
            <form className='relative p-5 bg-white w-full max-w-[800px] shadow-2xl rounded-[20px]' onSubmit={saveBank} >
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-[14px] w-8 h-8 ml-auto inline-flex justify-center items-center  dark:hover:text-white" onClick={() => setRouteCountry(null)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <h3 className='text-center text-[16px] pb-3 font-bold'>Agregar Banco</h3>
              <h3 className='text-center text-[16px] pb-3'>{countries[routeCountry.cca3].translation.spa.common}</h3>


              <div className="grid gap-6 my-6 md:grid-cols-2">


                <div className="min-w-full flex justify-center ">
                  <label htmlFor="fileUpload" className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 md:w-[250px] md:h-[200px]" style={{ backgroundImage: `url(${urlPostImageBank === null && countries[routeCountry].countries !== undefined && countries[routeCountry].countries[bank] !== undefined ? countries[routeCountry].countries[bank] : urlPostImageBank})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="fileUpload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Cargar Icono de Banco</span>
                          <input id="fileUpload" name="frontPage" onChange={manageInputIMGbank} type="file" className="sr-only" accept="image/*" />
                        </label>
                        <p className="pl-1">{' '} puede ser:</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, max 10MB</p>
                    </div>
                  </label>
                </div>
                <div className="min-w-full flex justify-center ">
                  <label htmlFor="fileUpload" className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 md:w-[250px] md:h-[200px]" style={{ backgroundImage: `url(${urlPostImageQR === null && countries[routeCountry].countries !== undefined && countries[routeCountry].countries[bank] !== undefined ? countries[routeCountry].countries[bank] : urlPostImageQR})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="fileUploadQR" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Cargar QR de cobro</span>
                          <input id="fileUploadQR" name="frontPage" onChange={manageInputQRbank} type="file" className="sr-only" accept="image/*" />
                        </label>
                        <p className="pl-1">{' '} puede ser:</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, max 10MB</p>
                    </div>
                  </label>
                </div>

                <div className='space-y-5'>
                  <Label htmlFor="">Banco</Label>
                  <Input type="text" name="nombre de banco" defValue={'banco'} require />
                </div>

                <div className='space-y-5'>
                  <Label htmlFor="">Cta. bancaria</Label>
                  <Input type="text" name="cta bancaria" defValue={'banco'} require />
                </div>

              </div>

              <div className='flex w-full justify-around'>
                <Button type="submit" theme='Primary'>Guardar</Button>
              </div>
            </form>
          </div>
        }








      </div>
    </main>
  )
}


