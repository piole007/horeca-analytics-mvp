import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { product_id } = req.query;

  //check if ID is valid
  if (typeof product_id !== "string") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  // delete product
  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", product_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: `Product ${product_id} deleted` });
  }
  //update product
  if (req.method === "PUT") {
    const {
      product_name,
      category,
      unit_of_measure,
      par_level,
      standard_cost,
      supplier_id,
      active,
    } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({
        product_name,
        category,
        unit_of_measure,
        par_level,
        standard_cost,
        supplier_id,
        active,
      })
      .eq("product_id", product_id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res
      .status(200)
      .json({ message: `Product ${product_id} updated`, data });
  }

  //uynsupported methods
  res.setHeader("Allow", ["DELETE", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
