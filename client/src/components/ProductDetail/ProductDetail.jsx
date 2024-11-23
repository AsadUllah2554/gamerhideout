import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col } from "antd";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { user } = useUserContext();
  const [product, setProduct] = useState(null); // State to hold the product data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the product data
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.SERVER_URL}/api/market/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Return to marketplace page
  const handleBack = () => {
    navigate("/");
  };

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div style={{ padding: "50px", maxWidth: "1200px", margin: "0 auto" }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <img
            src={product.imageUrl || "https://via.placeholder.com/600"}
            alt={product.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            style={{
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>
              {product.title}
            </h1>
            <p style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#555" }}>
              {product.description}
            </p>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>
              Price: {product.price} PKR
            </p>
            <p style={{ fontSize: "1rem", color: "#888", marginBottom: "20px" }}>
              Category: {product.category}
            </p>
            <Button type="primary" style={{ marginRight: "10px" }}>
              Message Seller
            </Button>
            <Button type="default" onClick={handleBack}>
              Back to Marketplace
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
