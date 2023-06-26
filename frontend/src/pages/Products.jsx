import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getAllProducts, deleteProduct } from "../services/productService";
import { useEffect, useState } from "react";
import CustomSpinner from "../components/CustomSpinner";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await getAllProducts();
      setProducts(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      const newProducts = products.filter((p) => p._id !== id);
      setProducts(newProducts);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <CustomSpinner size="lg" />;

  return (
    <Row>
      {products.map((product) => (
        <Col
          key={product._id}
          sm={12}
          md={6}
          lg={4}
          xl={3}
          className="d-flex align-items-center justify-content-center my-4"
        >
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Title className="text-muted">
                ₹ {product.price.toLocaleString("en-IN")}
              </Card.Title>
              <Card.Text>{`${product.description.slice(0, 120)}...`}</Card.Text>
              <div className="d-flex align-items-center justify-content-between">
                <Button variant="warning">Buy</Button>
                <Button
                  variant="primary"
                  as={Link}
                  to={`/products/${product._id}`}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product._id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Products;
