import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { supplier_id } = req.query

    //check if ID is valid
if (typeof supplier_id !== 'string') {
    return res.status(400).json({error: 'Invalid ID format'}
    )
}
// delete supplier
if (req.method === 'DELETE') {
    const { error } = await supabase.from('suppliers').delete().eq('supplier_id', supplier_id)

    if (error){
        return res.status(500).json({ error: error.message})
    }
    return res.status(200).json({ message: `Supplier ${supplier_id} deleted`})
}
//update supplier
if (req.method === 'PUT') {
    const {
        supplier_name,
        contact_person,
        phone,
        email,
        address,
        notes
    } = req.body

    const { data, error} = await supabase
    .from('suppliers')
    .update({
        supplier_name,
        contact_person,
        phone,
        email,
        address,
        notes
    })
    .eq('supplier_id', supplier_id)
    if (error) {
        return res.status(500).json({error: error.message})
    }
    return res.status(200).json({message: `Supplier ${supplier_id} updated`, data })
}

//uynsupported methods
res.setHeader('Allow', ['DELETE', 'PUT']);
return res.status(405).end(`Method ${req.method} Not Allowed`);

}