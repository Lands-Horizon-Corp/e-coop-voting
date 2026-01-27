'use client'
import { useEffect, useState } from "react"

const useOrigin = () => {
    const [origin, setOrigin] = useState<string>('');

    useEffect(()=>{
        if(window && window.location.origin){
            setOrigin(window.location.origin)
        }
    })

    return { origin }
}

export default useOrigin;