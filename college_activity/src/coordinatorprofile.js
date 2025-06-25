import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api/axiosfetch";
import "./CoordinatorProfile.css";

const CoordinatorProfile = () => {
  const defaultProfileImage = "/images/profile-image.jpg"; // Ensure this image exists in the 'public' folder
  const [profile, setProfile] = useState({
    name: "N/A",
    email: "N/A",
    affiliation: "N/A",
  });

  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      console.error("❌ No user email found in localStorage. Please log in.");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(`/coordinatorinfo/${userEmail}`);
        console.log("✅ API Response:", response.data);

        if (!response.data) {
          console.error("❌ No user data received.");
          return;
        }

        setProfile({
          name: response.data.name || "N/A",
          email: response.data.email || "N/A",
          affiliation: response.data.affiliation || "N/A",
        });

        // Use fetched image or fallback to default
        setProfileImage(response.data.image || defaultProfileImage);
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [userEmail]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
    setShowOptions(false);
  };

  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      stream.getTracks().forEach((track) => track.stop());
      setProfileImage(canvas.toDataURL());
    } catch (error) {
      console.error("❌ Error accessing the webcam:", error);
    }
    setShowOptions(false);
  };

  const handleDeleteImage = () => {
    setProfileImage(defaultProfileImage);
    setShowOptions(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
            onError={(e) => {
              e.target.src = defaultProfileImage;
            }}
          />
          <button onClick={() => setShowOptions(!showOptions)} className="camera-icon-button">
            <img src="/images/camera-icon.jpg" alt="Camera Icon" className="camera-icon" />
          </button>
        </div>
        <h2 className="profile-username">{profile.name}</h2>
        <p className="profile-role">Coordinator</p>
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Affiliation:</strong> {profile.affiliation}</p>
        </div>
        <div className="profile-actions">
          <button className="action-button" onClick={() => navigate("/Postspage")}>Posts</button>
          <button className="action-button" onClick={() => navigate("/DraftsPage")}>Drafts</button>
        </div>
        {showOptions && (
          <div className="options-menu">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-button" />
            <div className="capture-delete-row">
              <button onClick={handleCaptureImage} className="capture-button">Capture Image</button>
              <button onClick={handleDeleteImage} className="delete-button">
                <img src="/images/delete-icon.jpg" alt="Delete" className="dustbin-icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorProfile;