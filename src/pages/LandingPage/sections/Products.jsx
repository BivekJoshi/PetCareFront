import { Box, Typography } from "@mui/material";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../../../components/Card/ProductCard";
import { PRODUCTS, PRODUCTS_INTRO } from "../data";

const Products = () => (
  <Box sx={{ margin: "2rem 100px" }}>
    <SectionHeading
      segments={[{ text: "Our" }, { text: "Products", color: "primary" }]}
    />
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      <Typography variant="h5" sx={{ margin: "1rem 12rem", textAlign: "center" }}>
        {PRODUCTS_INTRO}
      </Typography>
      {PRODUCTS.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </Box>
  </Box>
);

export default Products;
