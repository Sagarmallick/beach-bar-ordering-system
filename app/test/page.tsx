"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Test() {

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("drinks")
                .select("*")

            console.log(data)
            console.log(error)
        }

        fetchData()
    }, [])

    return <div>Check console</div>
}