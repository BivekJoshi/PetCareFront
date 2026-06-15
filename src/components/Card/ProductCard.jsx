import { useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import defaultImage from "../../assets/Image3.png";

/**
 * Product tile with a hover "Add to Cart" overlay.
 *
 * @param {{ image?: string, title: string, price: string, oldPrice: string, discount: string }} props
 */
const ProductCard = ({
  image = defaultImage,
  title,
  price,
  oldPrice,
  discount,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        width: "220px",
        height: "250px",
        margin: "0.5rem",
        padding: "8px",
        border: "1px solid rgb(219, 219, 219)",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
          backdropFilter: "blur(88px)",
        },
      }}
    >
      <Box sx={{ width: "100%", height: "170px" }}>
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{ width: "100%", height: "100%", borderRadius: "6px" }}
        />
      </Box>
      <Divider />
      <Typography variant="h7">{title}</Typography>
      <Typography variant="h7" sx={{ display: "flex", gap: "5px" }}>
        <b>Rs.</b> {price}
        <Box component="span" sx={{ textDecoration: "line-through", color: "grey" }}>
          Rs. {oldPrice}
        </Box>
        <Box component="span" sx={{ color: "red", fontWeight: "bold" }}>
          {discount}
        </Box>
      </Typography>
      {isHovered && (
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFA500",
            color: "white",
            fontWeight: "bold",
            fontSize: "10px",
          }}
        >
          Add to Cart
        </Button>
      )}
    </Box>
  );
};

export default ProductCard;
