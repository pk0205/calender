import "./App.css";

import { useEffect, useRef, useState } from "react";

import StarRating from "./StarRatingComponent";

import styled from "styled-components";

import {
  ScheduleComponent,
  Inject,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
} from "@syncfusion/ej2-react-schedule";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

const Styles = styled.div`
  .crossContainer {
    display: flex;
    justify-content: right;
  }
  .crossmark {
    cursor: pointer;
    margin-top: 30px;
    margin-right: 10px;
    position: relative;
    width: 60px;
    height: 60px;
    &:after {
      position: absolute;
      content: "";
      display: block;
      width: 50px;
      height: 0px;
      border: solid #dddcdc;
      border-width: 0 0px 8px 0;
      transform: rotate(45deg);
      right: 0;
      top: 0;
    }
    &:before {
      position: absolute;
      content: "";
      display: block;
      width: 50px;
      height: 0px;
      border: solid #dddcdc;
      border-width: 0 0px 8px 0;
      transform: rotate(-45deg);
      right: 0;
      top: 0;
    }
  }
  .mobile {
    display: none;
  }

  .swiper-wrapper {
    /* margin-top: 20px; */
    width: 100vw;
  }

  .swiper-slide {
    width: 50vw !important;
    .card {
      width: 100%;
      display: flex;
      flex-direction: column;
      .image {
        width: 100%;
        height: 700px;
      }
      .body1 {
        height: 50px;
        margin: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .types {
          display: flex;
        }

        .type {
          margin-right: 10px;
          border-radius: 100px;
          padding: 7px;
        }
        .DC {
          background-color: #f5caf1;
          padding-left: 9px;
          padding-right: 9px;
        }
        .Cu {
          background-color: #e949d9;
        }
        .Pr {
          background-color: #f34655;
          padding-left: 11px;
          padding-right: 11px;
        }
        .HC {
          background-color: #2ed3f0;
        }
        .C {
          background-color: #2efda7;
          padding-left: 14px;
          padding-right: 14px;
        }
      }

      .body2 {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 22px;
        font-weight: 500;
      }

      .body3 {
        margin: 10px;
        height: 110px;
      }

      .footer {
        border-top: 2px solid black;
        padding: 15px;
        background-color: #ebebeb;

        font-size: 18px;
        font-weight: 500;

        text-align: center;
      }
    }
  }

  @media only screen and (max-width: 760px) {
    .mobile {
      display: block;
    }

    .desktop {
      display: none;
    }

    img {
      height: 350px !important;
    }

    .body3 {
      height: 80px;
    }
  }
`;

function App() {
  var tmp = [
    {
      Id: 2,
      Subject: "Meeting",
      StartTime: new Date(2021, 11, 18, 10, 0),
      EndTime: new Date(2021, 11, 18, 23, 30),
    },
  ];

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);

  const sliderRef = useRef(null);

  const legendCodes = {
    "hair cut": "Cu",
    "protein treatment": "Pr",
    "hair color": "HC",
    "deep conditioning": "DC",
    clarifying: "C",
  };

  useEffect(() => {
    async function fetchAPI() {
      try {
        let response = await fetch("https://api.quinn.care/graph", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            requestobjects: [
              {
                posts: {
                  operationtype: "read",
                  id: {
                    return: true,
                  },
                  iscalendarentry: {
                    searchvalues: ["true"],
                    return: true,
                  },
                  media: {
                    return: true,
                  },
                  rating: {
                    return: true,
                  },
                  text: {
                    return: true,
                  },
                  privacy: {
                    searchvalues: [18],
                    return: true,
                  },
                  typeofday: {
                    return: true,
                  },
                  calendardatetime: {
                    return: true,
                    sort: "descending",
                  },
                  maxitemcount: "20",
                  continuationtoken: null,
                },
              },
            ],
          }),
        });
        response = await response.json();
        const posts = response.responseobjects[0].posts;

        const newPosts = posts.map((post) => {
          // console.log(post.typeofday);

          let typeofday = post.typeofday
            ? post.typeofday.map((type) => legendCodes[type])
            : [];

          typeofday = typeofday.filter((type) => type != null);
          return {
            id: post.id,
            StartTime: new Date(post.calendardatetime),
            EndTime: new Date(post.calendardatetime),
            media: post.media[0],
            rating: post.rating,
            text: post.text,
            typeofday,
          };
        });
        console.log(newPosts);
        // console.log(posts);
        setData(newPosts);
      } catch (err) {
        console.log(err);
      }
    }

    fetchAPI();
  }, []);

  const handleClick = () => {
    console.log("object");
    setVisible(true);
  };

  return (
    <Styles>
      {!visible && (
        <ScheduleComponent
          currentView="Month"
          height="100vh"
          selectedDate={new Date(2021, 11, 18)}
          // minDate={new Date(1970, 0, 1)}
          // maxDate={new Date(2050, 11, 31)}
          eventSettings={{
            dataSource: data,
            fields: {
              id: "id",
              subject: { name: "text" },
              startTime: { name: "StartTime" },
              endTime: { name: "EndTime" },
            },
          }}
          eventClick={handleClick}
        >
          <Inject services={[Day, Week, WorkWeek, Month, Agenda]}></Inject>
        </ScheduleComponent>
      )}
      {visible && data && (
        <>
          <div className="crossContainer">
            <div className="crossmark" onClick={() => setVisible(false)}></div>
          </div>
          <Swiper
            centeredSlides
            slidesPerView="auto"
            pagination={{ clickable: true }}
            spaceBetween={14}
            loop
            loopedSlides={9}
            refs={sliderRef}
            slideToClickedSlide={true}
          >
            {data.map((el, idx) => {
              return (
                <SwiperSlide key={idx} className={"card"}>
                  <div
                    className={"card"}
                    onClick={() => {
                      sliderRef.current?.slideToLoop(idx);
                    }}
                  >
                    <div className="header">
                      <img
                        className="image"
                        src={el.media.mediaurl}
                        alt={el.media.fileid}
                      />
                    </div>
                    <div className="body1">
                      <div className="types">
                        {el.typeofday ? (
                          el.typeofday.map((type, id) => {
                            return (
                              <div key={id} className={`${type} type`}>
                                {type}
                              </div>
                            );
                          })
                        ) : (
                          <div></div>
                        )}
                      </div>

                      <StarRating name="rate1" value={el.rating} />
                    </div>
                    <div className="body2">
                      {el.StartTime.getDate()}
                      &nbsp;
                      {el.StartTime.toLocaleString("default", {
                        month: "long",
                      })}
                    </div>
                    <div className="body3 desktop">{el.text.slice(0, 200)}</div>
                    <div className="body3 mobile">{el.text.slice(0, 70)}</div>
                    <div className="footer">View Full Post</div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      )}
    </Styles>
  );
}

export default App;
