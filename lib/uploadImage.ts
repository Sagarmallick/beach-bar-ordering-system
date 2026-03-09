import { supabase } from "@/lib/supabaseClient"

export async function uploadDrinkImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `drinks/${fileName}`

    const { error } = await supabase.storage
        .from("drink-images")
        .upload(filePath, file)

    if (error) throw new Error(error.message)

    const { data } = supabase.storage
        .from("drink-images")
        .getPublicUrl(filePath)

    return data.publicUrl
}
