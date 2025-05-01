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
      .from("products")
      .select(
        "product_id, product_name, category, unit_of_measure, par_level, standard_cost, supplier_id, active"
      )
      .range(start, end);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  } else if (req.method === "POST") {
    const {
      product_name,
      category,
      unit_of_measure,
      par_level,
      standard_cost,
      supplier_id,
      active,
    } = req.body;

    // Input validation
    const hasName = product_name && category;
    const hasProductDetails =
      unit_of_measure && par_level && standard_cost && supplier_id && active;

    if (!hasName) {
      return res
        .status(400)
        .json({ error: "Please provide product name and category" });
    }
    if (!hasProductDetails)
      return res.status(400).json({ error: "Please provide product details" });

    const { data, error } = await supabase.from("products").insert([
      {
        product_name,
        category,
        unit_of_measure,
        par_level,
        standard_cost,
        supplier_id,
        active,
      },
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
