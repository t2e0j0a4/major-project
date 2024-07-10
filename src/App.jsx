import Upscaler from 'upscaler';
import styles from './App.module.css';
import React, { useState } from 'react';

// Toast Notifications.
import { Toaster, toast } from 'react-hot-toast';

// React Icons
import { FiUpload, FiImage } from 'react-icons/fi';

// Initialize the Upscaler
const upscaler = new Upscaler();

const App = () => {
  const [image, setImage] = useState(null); // State to hold the uploaded image
  const [enhancedImage, setEnhancedImage] = useState(null); // State to hold the enhanced image
  const [loading, setLoading] = useState(false); // State to control the loading bar visibility

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.size <= 2 * 1024 * 1024)) { // Ensure file size is less than 2 MB
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // Set the uploaded image
      };
      reader.readAsDataURL(file);
    } else {
      event.target.value = '';
      toast.error('Image is larger than 2 MB.'); // Show error using react-hot-toast with icon
    }
  };


  // Enhance the image using Upscaler.js
  const enhanceImage = async () => {
    if (!image) return;

    console.log('Enchaning Image...');
    setLoading(true); // Show loading bar

    const img = new Image();
    img.src = image;
    img.onload = async () => {
      try {
        console.log('On Enhancing Image...');
        const upscaledImage = await upscaler.upscale(img);
        console.log(upscaledImage);
        const enhancedImageDataUrl = upscaledImage.toDataURL(); // Convert canvas to data URL
        console.log(enhancedImageDataUrl);
        setEnhancedImage(enhancedImageDataUrl); // Set the enhanced image
      } catch (error) {
        console.error(error);
        toast.error('Image enhancement failed.'); // Show error toast with icon
      } finally {
        setLoading(false); // Hide loading bar
      }
    };
  };

  return (
    <div className={styles.container}>
      <Toaster position='bottom-right' gutter={8} containerStyle={{ minWidth: '280px' }} /> {/* React Hot Toast container */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBar}>Enhancing Image...</div>
        </div>
      )}
      <div className={styles.uploadSection}>
        <label htmlFor="fileInput" className={styles.fileLabel}>
          <FiUpload className={styles.uploadIcon} />
          <span>Upload Image</span>
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.fileInput}
        />
        <button type="button" onClick={enhanceImage} className={styles.enhanceButton}>
          Enhance Image
        </button>
      </div>
      <div className={styles.imageSection}>
        <div className={styles.subSection}>
          <h3>Before</h3>
          {image ? <img src={image} alt="Before Enhancement" /> : <FiImage className={styles.placeholderIcon} />}
        </div>
        <div className={styles.subSection}>
          <h3>After</h3>
          {enhancedImage ? <img src={enhancedImage} alt="After Enhancement" /> : <FiImage className={styles.placeholderIcon} />}
        </div>
      </div>
    </div>
  );
};

export default App;
