import templateImage from "../../demo.png";

const icons = [
  <i class="fa-solid fa-hexagon-nodes"></i>,
  <i class="fa-solid fa-wrench"></i>,
  <i class="fa-brands fa-pied-piper-hat"></i>,
  <i class="fa-solid fa-wand-magic-sparkles"></i>,
  <i class="fa-solid fa-feather-pointed"></i>,
  <i class="fa-brands fa-forgejo"></i>,
  <i class="fa-solid fa-hand-point-right"></i>
]

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
        minHeight:'900px',
        minWidth:'900px',
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
            marginTop: "0.5vw",
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
              width: '40px',
              height: '40px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <i className="fa-solid fa-location-dot" style={{ color: '#000000', fontSize: '26px' }} />
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
            <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#ffffff', fontSize: '30px', transform: 'scaleX(-1) ' }} />
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
            style={{ display: "flex", alignItems: "center", gap: "1vw", }}
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
            <span style={{ ...poppinsStyle, fontSize: "16px", fontWeight: 600, lineHeight: 1.2,flex:1 }}>
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
              padding: "0.4vw 1vw",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 600,
              color: "#004aad",
              marginBottom: "0.8vw"
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
