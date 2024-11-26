import React, { useEffect, useState } from "react";
import "./Trending.css";
import { useRef } from "react";
import { FaStar } from "react-icons/fa";
import MovieServices from "../Services/MovieServices";
import { useNavigate } from "react-router-dom";
import ViewMovieModal from "../moviemodal";
import UserFetch from "../UserFetch.jsx";

const Trending = () => {
  let [rmovie, setRmovie] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isLoggedIn, creds, bigtoken, isRole } = UserFetch();


  const fetchMovies = async () => {
    MovieServices.getTrending()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRmovie(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  };
  useEffect(() => {
    fetchMovies();
  }, []);
  const handleDelete = (id) => {
    MovieServices.deleteMovie(id, bigtoken).then(
      () => {
        rmovie = rmovie.filter((movie) => movie.movieId !== id);
        setRmovie(rmovie)

      }
    )
  };
  const containerRef = useRef(null);
  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -500,
      behavior: "smooth",
    });
  };
  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: 500,
      behavior: "smooth",
    });
  };
  const handleShowModal = (rmovie) => {
    setSelectedMovie(rmovie)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };



  const viewAll = () => {
    navigate("/viewall");
  }
  const openMovie = (movieId) => {
    navigate(`/view-movie/${movieId}`, { state: { isRole: isRole, isLoggedIn: isLoggedIn } });
  };

  return (
    <>
      <div className="flex-fill">
        <div className="sectionTitle">
          <h3 id="headc">Trending Movies</h3>
          <h3 id="viewAll" onClick={() => viewAll()}>View All</h3>
        </div>
        <br />
        {rmovie.length <= 0 ?
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/loading.gif"
              style={{ height: 'auto', width: '200px' }}
            />
          </div>
          :
          <div>
            <div className="tscroll-buttons">
              <button className="tscroll-button left" onClick={scrollLeft}>
                <img src={"icons8-arrow-50.png"}></img>
              </button>
            </div>

            <div
              id="recomm"
              className="container mt-4 container-scroll"
              ref={containerRef}
            >
              <div className="row row-scroll">
                {rmovie.map((rmovie, index) => (
                  <div className="col-md-3" key={index}>
                    <div className="card rcards" id={rmovie.movieId}>
                      {isRole == "ROLE_ADMIN" ? (
                        <div className="card-delete">
                          <i onClick={() => handleDelete(index)}>
                            <img src={"delete.png"} height={25} width={25} />
                          </i>
                        </div>
                      ) : (
                        <></>
                      )}

                      <img
                        src={rmovie.posterUrl}
                        className="card-img-top"
                        onClick={() => openMovie(rmovie.movieId)}
                        alt={rmovie.title}
                        style={{
                          height: "400px",
                          objectFit: "cover",
                          overflow: "hidden",
                          cursor: 'pointer'
                        }}
                      />
                      <div
                        className="card-body"
                        style={{ backgroundColor: "black" }}
                      >
                        <div className="row">
                          <div className="col-sm-6">
                            <h5
                              className="card-title"
                              style={{
                                color: "wheat",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                width: '14rem'
                              }}
                            >
                              {rmovie.title}
                            </h5>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                          <div>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleShowModal(rmovie)}
                              style={{
                                backgroundColor: "#FFA500",
                                borderColor: "#FFA500",
                                color: "black",
                              }}
                            >
                              Watch Option
                            </button>
                          </div>
                          <div className="col-sm-4" style={{ pading: '0.3rem' }}>
                            <span>{rmovie.rating !== null ?
                              rmovie.rating : "NA"}
                              <FaStar style={{ marginBottom: "4px" }} />
                            </span>
                          </div>

                        </div>
                        {selectedMovie && <ViewMovieModal showModal={showModal} handleCloseModal={handleCloseModal} movie={{
                          image: selectedMovie.posterUrl,
                          title: selectedMovie.title,
                          description: selectedMovie.movieDesc,
                          rating: selectedMovie.rating,
                        }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tscroll-buttons-right">
              <button className="tscroll-button right" onClick={scrollRight}>
                <img src={"icons8-right-arrow-50.png"}></img>
              </button>
            </div>
          </div>
        }
      </div >
    </>
  );
};

export default Trending;
