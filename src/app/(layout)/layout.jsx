'use client'
import { useUser } from '@/context/Context'
import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import { onAuth, handleSignOut } from '@/firebase/utils'
import { useRouter } from 'next/navigation';
import Particles from '@/components/Particles'
import { useEffect } from 'react'
import { getSpecificData, getSpecificDataEq} from '@/firebase/database'

export default function RootLayout({ children }) {

    const { user, userDB, setUserProfile, nav, setNav, userNav, setNavItem, setUserData, divisas, setDivisas, setCountries, setEnviosDB, setCambiosDB, setNotificaciones, setIsSelect, setIsSelect2, setIsSelect3, setIsSelect4, setIsSelect5} = useUser()
    const router = useRouter()
    console.log(user)
    console.log(userDB)

    function mainHandler () {
        setIsSelect(false)
        setIsSelect2(false)
        setIsSelect3(false)
        setIsSelect4(false)
        setIsSelect5(false)
        setNavItem('')
        setNotificaciones(false)
        
    }
    const signOutHandler = () => {
        handleSignOut()
        setUserProfile(null)
        setUserData(null)
        setNav(false)
        router.push('/')
    }
    function soporte(e) {
        e.preventDefault()
        window.open('https://api.whatsapp.com/send?phone=+59177455743&text=Hola%20BOTTAK,%20necesito%20hacer%20una%20transacci%C3%B3n...', '_blank')
      }

    useEffect(() => {
        onAuth(setUserProfile, setUserData)
        getSpecificData('divisas', setDivisas)
        getSpecificData(`/currencies/`, setCountries)
    }, [])
    useEffect(() => {
        user && userDB === undefined && getSpecificData(`/users/${user.uid}`, setUserData)
        user && user !== undefined && getSpecificDataEq(`/envios/`, 'user uuid', user.uid, setEnviosDB )
        user && user !== undefined && getSpecificDataEq(`/cambios/`, 'user uuid', user.uid, setCambiosDB )
    }, [user, userDB])

    return (
        user !== undefined && userDB !== undefined && divisas !== undefined && <>
        {userDB && userDB.bloqueado === true ? <Modal funcion={soporte} cancel={signOutHandler} cancelText="Cerrar sesión" successText="Soporte">
            Esta cuenta esta bloqueada, <br />por favor comuniquese con soporte.<br />
          </Modal> : ''}
            <Navbar/>
            <div className={`relative  w-screen px-[20px]  pt-[80px] pb-[30px] md:pb-0 flex items-center min-h-full   ${nav ? 'left-[100vw] sm:left-[250px]' : 'left-0'} ${userNav ? 'top-[70px]' : 'top-0'}`} style={{transition: 'all .02s linear'}} onClick={mainHandler}>
                {children}
            </div>
            <Particles />
        </>
    )
}

