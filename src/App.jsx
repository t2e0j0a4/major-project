
import styles from './App.module.css';
import React, { useEffect, useState } from 'react';

// Toast Notifications.
import { Toaster, toast } from 'react-hot-toast';

// React Icons
import { FiUpload, FiImage } from 'react-icons/fi';

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

  useEffect(() => {

    if (!image) {
      return 
    };

    const toastId = toast.loading('Enhancing image...');
    setLoading(true);

    const timout = setTimeout(() => {
      setEnhancedImage(image);
      setLoading(false);
      toast.success('Image enhanced successfully!', {
        id: toastId
      });
    }, 3000);

    return () => clearTimeout(timout)
  }, [image])

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