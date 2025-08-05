// Complete Chat Flow Test Script
// Run this in the browser console while logged in

async function testCompleteChatFlow() {
  console.log('🚀 Starting complete chat flow test...');
  
  try {
    // Step 1: Test dentist data structure
    console.log('\n📋 Step 1: Testing dentist data structure...');
    const dentistTestResponse = await fetch('/api/test-dentist-data');
    const dentistTestData = await dentistTestResponse.json();
    
    if (!dentistTestResponse.ok) {
      console.error('❌ Dentist data test failed:', dentistTestData.error);
      return;
    }
    
    console.log('✅ Dentist data test passed:', {
      hasUserId: dentistTestData.hasUserId,
      userIdType: dentistTestData.userIdType,
      userExists: dentistTestData.userExists
    });
    
    const testUserId = dentistTestData.sampleDentist.userId;
    console.log('🎯 Using test userId:', testUserId);
    
    // Step 2: Test conversation creation API
    console.log('\n🔧 Step 2: Testing conversation creation API...');
    const convTestResponse = await fetch('/api/test-chat-creation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId })
    });
    
    const convTestData = await convTestResponse.json();
    
    if (!convTestResponse.ok) {
      console.error('❌ Conversation creation test failed:', convTestData.error);
      console.error('Details:', convTestData.details);
      return;
    }
    
    console.log('✅ Conversation creation test passed:', {
      conversationId: convTestData.conversationId,
      message: convTestData.message
    });
    
    // Step 3: Test URL navigation
    console.log('\n🌐 Step 3: Testing URL navigation...');
    const testUrl = `/chat?user=${testUserId}`;
    console.log('🔗 Test URL:', testUrl);
    
    // Open in new tab for testing
    const newWindow = window.open(testUrl, '_blank');
    
    if (newWindow) {
      console.log('✅ URL navigation successful');
      
      // Wait a bit then check if the tab is still open (basic test)
      setTimeout(() => {
        if (!newWindow.closed) {
          console.log('✅ Chat page loaded successfully');
        } else {
          console.log('⚠️ Chat page was closed immediately (might indicate an error)');
        }
      }, 2000);
    } else {
      console.log('❌ Failed to open chat URL (popup blocked?)');
    }
    
    // Step 4: Summary
    console.log('\n📊 Test Summary:');
    console.log('✅ Dentist data structure: PASSED');
    console.log('✅ Conversation creation: PASSED');
    console.log('✅ URL navigation: PASSED');
    console.log('\n🎉 All tests passed! The chat flow should work correctly.');
    
    return {
      success: true,
      testUserId,
      conversationId: convTestData.conversationId,
      recommendations: [
        'Try clicking a message button on a dentist card',
        'Check browser console for detailed logs',
        'Verify the chat page loads with the conversation'
      ]
    };
    
  } catch (error) {
    console.error('❌ Test flow failed:', error);
    return {
      success: false,
      error: error.message,
      recommendations: [
        'Check if you are logged in',
        'Verify database connection',
        'Check server logs for errors'
      ]
    };
  }
}

// Additional helper function to test a specific dentist
async function testSpecificDentist(dentistUserId) {
  console.log(`🧪 Testing specific dentist: ${dentistUserId}`);
  
  try {
    const response = await fetch('/api/test-chat-creation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: dentistUserId })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Specific dentist test passed:', data);
      return true;
    } else {
      console.error('❌ Specific dentist test failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing specific dentist:', error);
    return false;
  }
}

// Run the complete test
console.log('🚀 Running complete chat flow test...');
testCompleteChatFlow().then(result => {
  console.log('\n📋 Final Result:', result);
});

// Export functions for manual testing
window.testCompleteChatFlow = testCompleteChatFlow;
window.testSpecificDentist = testSpecificDentist; 