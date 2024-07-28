import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import DisplayProfile from "./displayProfile";

const ProfileCol = (props) => {
  const [imgLinks, setImgLinks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [travels, setTravels] = useState([]);
  const [usernames, setUsername] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState([]);

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
          console.log(data);
          setMoods(data.map((datas) => datas[0]));
          setBudgets(data.map((datas) => datas[1]));
          setTravels(data.map((datas) => datas[2]));
          setImgLinks(data.map((datas) => datas[3]));
          setUsername(data.map((datas) => datas[4]));
          setIsHovered(new Array(data.length).fill(false));
        } else {
          console.error("Received data is not an array:", data);
          setImgLinks([]);
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

  const handleMouseEnter = (index) => {
    setIsHovered((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleMouseLeave = (index) => {
    setIsHovered((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

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
                  opacity: isHovered[index] ? 0.6 : 1,
                  transition: "opacity 0.3s",
                }}
                onClick={() => setSelectedProfile(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              />
              {selectedProfile === index && (
                <DisplayProfile
                  show={true}
                  handleClose={() => setSelectedProfile(null)}
                  username={usernames[index]}
                  picture={imgLinks[index]}
                  mood={moods[index]}
                  travel={travels[index]}
                  budget={budgets[index]}
                />
              )}
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default ProfileCol;
