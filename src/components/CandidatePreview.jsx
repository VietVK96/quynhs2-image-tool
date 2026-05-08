import templateImage from "../../demo.png";

const baseUrl = import.meta.env.BASE_URL;
const icons = [
  <img src={`${baseUrl}icon1.png`} alt="icon1" style={{ width: "22px", height: "22px", objectFit: "contain" }} />,
  <img src={`${baseUrl}icon2.png`} alt="icon2" style={{ width: "22px", height: "22px", objectFit: "contain" }} />,
  <img src={`${baseUrl}icon3.png`} alt="icon3" style={{ width: "22px", height: "22px", objectFit: "contain" }} />,
  <i className="fa-solid fa-wrench"></i>,
  <i className="fa-brands fa-pied-piper-hat"></i>,
  <i className="fa-solid fa-wand-magic-sparkles"></i>,
  <i className="fa-solid fa-feather-pointed"></i>,
  <i className="fa-brands fa-forgejo"></i>,
  <i className="fa-solid fa-hand-point-right"></i>,
  <i className="fa-solid fa-hexagon-nodes"></i>
];

function CandidatePreview({ candidate, setCardRef }) {
  const montserratStyle = { fontFamily: "Montserrat, sans-serif" };
  const paytoneStyle = { fontFamily: "'Paytone One', sans-serif" };
  const muliStyle = { fontFamily: "Muli, sans-serif" };
  const poppinsStyle = { fontFamily: "Poppins, roboto, sans-serif" };
  const stelaStyles = {
    300: { fontFamily: '"Stellar", sans-serif', fontWeight: 300 },
    400: { fontFamily: '"Stellar", sans-serif', fontWeight: 400 },
    500: { fontFamily: '"Stellar", sans-serif', fontWeight: 500 },
    600: { fontFamily: '"Stellar", sans-serif', fontWeight: 600 },
    700: { fontFamily: '"Stellar", sans-serif', fontWeight: 700 },
  };
  const whiteText = { color: "#ffffff" };

  return (
    <div
      ref={setCardRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        overflow: "hidden",
        borderRadius: "0",
        minHeight: '900px',
        minWidth: '900px',
      }}
    >
      <img
        src={templateImage}
        alt="Candidate template"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "20.6%",
          width: "62%",
          transform: "translateX(-50%)",
          textAlign: "center",
          ...whiteText
        }}
      >
        <p style={{ ...montserratStyle, fontSize: "25.8px", fontWeight: 600, lineHeight: 1.2 }}>
          {candidate.code || ""}
        </p>
        <h2
          style={{
            ...paytoneStyle,
            marginTop: "12px",
            fontSize: "37px",
            fontWeight: 700,
            lineHeight: 1,
            textTransform: "uppercase"
          }}
        >
          {candidate.position || ""}
        </h2>
      </div>
      <div style={{
        position: "absolute",
        top: "31%",
        display: "flex",
        width: '78%',
        left: '11%',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100px',
        padding: '20px 0px',
        ...whiteText
      }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: '2px solid #ffffff',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '35px',
              height: '35px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i className="fa-solid fa-location-dot" style={{ color: '#000000', fontSize: '25px' }} />
          </div>
          <div>
            <p style={{ ...stelaStyles[500], fontSize: "10.7px", fontWeight: 500, lineHeight: 1 }}>
              Khu vực
            </p>
            <p style={{ ...muliStyle, fontSize: "19.7px", fontWeight: 600, lineHeight: 1.5 }}>
              {candidate.region || "-"}
            </p>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: '2px solid #ffffff',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              preserveAspectRatio="xMidYMid meet" version="1.0"
              viewBox="3.6 3.8 85.6 85.7" zoomAndPan="magnify"
              style={{ fill: "rgb(255, 255, 255)" }}
              original_string_length="2631"
              width="30px"
              height="30px">
              <g id="__id0_slrlg51ujc">
                <circle cx="78" cy="81.4" r="1.3" />
              </g>
              <g id="__id1_slrlg51ujc">
                <path d="M38.2,41.5c0.8-0.1,1.5-0.8,1.5-1.7v-2c0-0.3-0.4-0.9-1-1.2l-0.4-0.2L38.2,41.5z"  />
                <path d="M28,50.9h17.6c0.3,0,5.7,0,8.9-3.7c1.8-2.1,2.6-4.9,2.1-8.3c-1.3-10.7-10.9-19.5-14.2-21.7c0,0,4.8-5.7,4.9-5.8 c0.6-1.5-0.1-3.2-1.6-3.8l-2-0.8c-0.1-1.7-1.5-3-3.2-3h-7.3c-1.7,0-3.1,1.3-3.2,3l-2,0.8c-1.5,0.6-2.2,2.3-1.6,3.8 c0.1,0.1,4.9,5.8,4.9,5.8C27.9,19.5,18.3,28.3,17,39c-0.4,3.4,0.3,6.2,2.1,8.3C22.4,50.9,27.7,50.9,28,50.9z M42.2,30.1 c0,0.7-0.6,1.2-1.2,1.2s-1.2-0.6-1.2-1.2v-0.9c0-0.8-0.6-1.6-1.5-1.7v6.2l1.7,0.7c1.3,0.5,2.2,1.9,2.3,3.4v2c0,2.2-1.8,4.1-4,4.2 v1.5c0,0.7-0.6,1.2-1.2,1.2s-1.2-0.6-1.2-1.2V44h-0.1c-2.3,0-4.2-1.9-4.2-4.2v-0.9c0-0.7,0.6-1.2,1.2-1.2c0.7,0,1.2,0.6,1.2,1.2 v0.9c0,0.9,0.8,1.7,1.7,1.7h0.1v-6.1l-2.1-0.8c-1.9-0.8-2.3-2.5-2.3-3.4v-2c0-2.3,1.9-4.2,4.2-4.2c0,0,0.2,0,0.2,0v-1.4 c0-0.7,0.6-1.2,1.2-1.2s1.2,0.6,1.2,1.2V25c2.2,0.1,4,1.9,4,4.2L42.2,30.1z M28.9,10l2-0.8l1.5,2.8c0.2,0.4,0.6,0.7,1.1,0.7 c0.7,0,1.3-0.6,1.2-1.3c0-0.2-0.1-0.4-0.1-0.6c0,0-2.1-3.9-2.2-4l0,0c0.1-0.3,0.4-0.5,0.7-0.5h7.3c0.3,0,0.6,0.2,0.7,0.5l-2.1,3.9 c-0.3,0.6-0.1,1.4,0.5,1.7c0.2,0.1,0.4,0.1,0.6,0.1c0.5,0,0.9-0.3,1.1-0.7l1.5-2.8l1.9,0.8c0.2,0.1,0.3,0.2,0.3,0.4l-5.2,6 c-2-0.2-4-0.2-6,0l-5.2-6C28.6,10.2,28.7,10.1,28.9,10z"  />
                <path d="M33.9,29.2v2c0,0.3,0.3,1,1,1.2l0.8,0.3v-5.2h-0.1C34.7,27.5,33.9,28.3,33.9,29.2z" />
                <path d="M88.2,87.1H72.4V59.5h13.2c0.7,0,1.2-0.6,1.2-1.2S86.3,57,85.6,57H72.4v-4c0-0.7-0.6-1.2-1.2-1.2s-1.2,0.6-1.2,1.2v4h-7.1 c-0.7,0-1.2,0.6-1.2,1.2v3.6h-2.3l-7.3-6.4c-0.2-0.2-0.5-0.3-0.8-0.3H31.2c-0.6,0-1.2,0.4-1.2,1.1L29.9,57c0,1.8,0.6,3.5,1.7,4.9 h-1.4l-5-7.8c-1.6-3.1-5.1-5.6-8.7-4.4c-1.9,0.6-2,0.7-2,0.7c-0.3,0.1-0.6,0.4-0.7,0.7c-0.1,0.3-0.1,0.7,0.1,1l0.4,0.7 c-2.8-1.5-6.3-1.7-8.7,0.6C4.1,54.9,4,55,4,55c-0.4,0.5-0.4,1.3,0.2,1.8c0,0,17.9,12.4,17.9,12.4c0.1,0.1,28.2,10.5,28.2,10.5 s8.1,0.1,11.2,0.1v2c0,0.7,0.6,1.2,1.2,1.2h7.1v5.3c0,0.7,0.6,1.2,1.2,1.2h17c0.7,0,1.2-0.6,1.2-1.2S88.8,87.1,88.2,87.1L88.2,87.1 z M17.2,52.1c2.2-0.7,4.6,1.1,5.7,3.3l2.7,4.2l-7.3-4.2l-1.7-3.1L17.2,52.1z M61.5,77.2H51L23.4,67L6.9,55.6l0.4-0.4 c1.7-1.7,4.6-1.1,6.6,0.3l14.9,8.6c0.2,0.1,0.4,0.2,0.6,0.2h17.9c0.7,0,1.2-0.6,1.2-1.2s-0.6-1.2-1.2-1.2H35.9 c-1.9-0.3-3.3-2.4-3.5-4.3h18.2L58,64c0.2,0.2,0.5,0.3,0.8,0.3h2.8L61.5,77.2z" />
              </g>
            </svg>
          </div>
          <div
          >
            <p style={{ ...stelaStyles[500], fontSize: "10.7px", fontWeight: 500, lineHeight: 1 }}>
              Mức lương kỳ vọng
            </p>
            <p style={{ ...muliStyle, fontSize: "19.7px", fontWeight: 600, lineHeight: 1.5 }}>
              {candidate.salary || "-"}
            </p>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i className="fa-regular fa-clock" style={{ color: '#ffffff', fontSize: '32px' }} />
          </div>
          <div>
            <p style={{ ...stelaStyles[500], fontSize: "10.7px", fontWeight: 500, lineHeight: 1 }}>
              Kinh nghiệm
            </p>
            <p style={{ ...muliStyle, fontSize: "19.7px", fontWeight: 600, lineHeight: 1.5 }}>
              {candidate.experienceYears || "-"}
            </p>
          </div>
        </div>
      </div>

      <ul
        style={{
          position: "absolute",
          left: "13%",
          top: "52.5%",
          width: "50%",
          color: "#ffffff",
          listStyle: "none",
          margin: 0,
          padding: '35px 0px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          height: '340px',
        }}
      >
        {candidate.workExperiences.slice(0, 5).map((item, index) => (
          <li
            key={`${candidate.id}-work-${index}`}
            style={{ display: "flex", alignItems: "center", gap: "16px", }}
          >
            <span
              style={{
                display: "flex",
                width: "40px",
                height: "40px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                color: "#1e3a8a",
                fontSize: "20px"
              }}
            >
              {icons[index % icons.length]}
            </span>
            <span style={{ ...poppinsStyle, fontSize: "16px", fontWeight: 600, lineHeight: 1.2, flex: 1 }}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      <ul
        style={{
          position: "absolute",
          left: "71.5%",
          top: "53.8%",
          width: "190px",
          listStyle: "none",
          margin: 0,
          padding: '20px 30px',
        }}
      >
        {candidate.skills.slice(0, 7).map((item, index) => (
          <li
            key={`${candidate.id}-skill-${index}`}
            style={{
              ...poppinsStyle,
              borderRadius: "9999px",
              backgroundColor: "#f1f5f9",
              padding: "8px 16px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 600,
              color: "#004aad",
              marginBottom: "12px"
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CandidatePreview;
