import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    //Pagination
    const start = Number(req.query.start) || 0;
    const end = start + 9;

    const { data, error } = await supabase
      .from("suppliers")
      .select(
        "supplier_id, supplier_name, contact_person, phone, email, address, notes"
      )
      .range(start, end);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } else if (req.method === "POST") {
    const { supplier_name, contact_person, phone, email, address, notes } =
      req.body;

    // Input validation
    const hasName = supplier_name || contact_person;
    const hasContact = phone || email || address;

    if (!hasName) {
      return res
        .status(400)
        .json({ error: "Please provide supplier or contact person" });
    }
    if (!hasContact)
      return res
        .status(400)
        .json({ error: "Please provide at least one way to contact supplier" });

    const { data, error } = await supabase
      .from("suppliers")
      .insert([
        { supplier_name, contact_person, phone, email, address, notes },
      ]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
