'use client';

import { useRouter } from 'next/navigation';


export default function Button({click, type, name, onChange,reference, minLength, pattern, placeholder, styled, title, required}) {

    const router = useRouter()


    function handlerButton(e) {
        e.preventDefault(e)
        router.push(click)
    }


    return (
        <input
            type={type}
            name={name}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-[14px] text-center rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-[100%] p-3 ${styled}`}
            // className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3
            //  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={onChange}
            // style={{...styled}}
            required={required}
            ref={reference}
            minLength={minLength && minLength}
            pattern={pattern && pattern}
            title={title && title}
            placeholder={placeholder}
          />
    )
}