import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in CSE (Data Science)</h4>
                <h5>CSVTU, Raipur</h5>
              </div>
              <h3>2024-2028</h3>
            </div>
            <p>
              Pursuing Bachelor of Technology (Honours). Core subjects include Data Science, Problem Solving, and system design.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Hackathon Finalist</h4>
                <h5>Sustainovation 2025, Amity University</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Finalist in a national-level 30-hour sustainability hackathon focused on real-world ESG challenges. Collaborated to design data-driven solutions.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>NSS Volunteer</h4>
                <h5>Community Service</h5>
              </div>
              <h3>Present</h3>
            </div>
            <p>
              Actively participated in community service initiatives and awareness campaigns. Organized and executed events, strengthening teamwork and leadership.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
