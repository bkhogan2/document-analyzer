// Simple test script to simulate frontend uploads
const testUpload = async () => {
  try {
    // Create a test file
    const testContent = 'This is a test PDF content';
    const testFile = new File([testContent], 'test-document.pdf', { type: 'application/pdf' });
    
    // Test the upload
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('user_id', 'default');
    
    const response = await fetch('http://localhost:8000/files/upload/balance-sheet', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Upload result:', result);
    
    if (response.ok) {
      console.log('✅ Upload successful!');
    } else {
      console.log('❌ Upload failed:', result);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testUpload(); 