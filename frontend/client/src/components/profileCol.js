import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

const ProfileCol = (props) => {
  const [imgLinks, setImgLinks] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(`blog/users/${props.id}`, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setImgLinks(data);
        } else {
          console.error("Received data is not an array:", data);
          setImgLinks([]); // Set to empty array if data is not as expected
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(error.message);
      }
    };

    fetchImages();
  }, [props.id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container fluid>
      <Row xs={12} lg="auto" className="justify-content-start">
        {Array.isArray(imgLinks) &&
          imgLinks.map((img, index) => (
            <Col key={index} xs={12} lg={1} className="ps-0 mb-2">
              <img
                src={img}
                alt={`Image ${index}`}
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default ProfileCol;
