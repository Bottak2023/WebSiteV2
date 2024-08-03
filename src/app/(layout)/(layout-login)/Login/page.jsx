'use client'
import { useUser } from '@/context/Context'
import { onAuth, signInWithEmail } from '@/firebase/utils'
import { getSpecificData } from '@/firebase/database'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Msg from '@/components/Msg'
import NavInit from '@/components/NavInit'

import Error from '@/components/Error'
import SelectWithFlag from '@/components/SelectWithFlag'
import { useRouter } from 'next/navigation';
import style from '@/app/(layout)/style.module.css'

export default function Home() {
  const { user, userDB, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, transferencia } = useUser()
  const router = useRouter()

  const signInHandler = async (e) => {
    e.preventDefault()
    let email = e.target[0].value
    let password = e.target[1].value

    if (email.length == 0 || password.length == 0) {
      return setUserSuccess('Complete')
    }
    const res = await signInWithEmail(email, password, setUserProfile)

    if (res == null) {

      setUserSuccess('Intente')
      return
    }
    console.log(res)

    if (res && (userDB == null || userDB == undefined)) {
      console.log(res)
      const data = await getSpecificData(`/users/${res.uid}`, setUserData)
      console.log(data)
      if (data == null) {
        router.push('/Register') 
      } else {
        transferencia ? router.push('/Register/Destinatario') : router.push('/')
      }
    }
  }



  useEffect(() => {
    // console.log(user)
    // if (user) {
    //   transferencia ? router.push('/') : router.push('/Register')
    // }  
  }, [user]);

  return (
          <form className="relative w-full max-w-[500px] h-full min-h-[300px] flex flex-col justify-between" onSubmit={signInHandler} >
            <h5 className="text-[24px] font-medium text-white text-center">Iniciar Sesión</h5>
            <div>
              <label htmlFor="email" className="block mb-2 text-[14px] font-light text-left  text-white">Email</label>
              <Input type="email" name="email" id="email" placeholder="name@company.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2  text-left  text-[14px] font-light text-white">Contraseña</label>
              <Input type="password" name="password" id="password" placeholder="••••••••••••"  minLength={8} styled='font-sans' required />
            </div>
            <div className="flex items-start">
              <Link href="/Resset" className="ml-auto text-green-400 text-[14px] font-light hover:underline">Olvidaste tu contraseña?</Link>
            </div>
            <div className="w-full flex justify-center">
              <Button type="submit" theme={"Primary"}>Iniciar Sesión</Button>
            </div>
            <div className="text-[14px] font-light  text-gray-500 dark:text-gray-300 text-center">No tienes una cuenta? <Link href="/SignUp" className="text-green-400 text-[14px] font-light  hover:underline">Registrate</Link ></div>
      </form>
       
  )}


