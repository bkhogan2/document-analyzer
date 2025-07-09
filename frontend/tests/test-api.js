// Test the API service directly
import { documentService } from '../src/services/documentService.ts';

const testApiService = async () => {
  try {
    console.log('🧪 Testing API service...');
    
    // Create a test file
    const testContent = 'This is a test PDF content';
    const testFile = new File([testContent], 'test-document.pdf', { type: 'application/pdf' });
    
    // Test upload to category
    const result = await documentService.uploadFileToCategory('balance-sheet', testFile);
    console.log('✅ Upload successful:', result);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testApiService(); 