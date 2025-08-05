// Test script for chat creation
// Run this in browser console on any page while logged in

async function testChatCreation() {
  console.log('🧪 Testing chat creation...');
  
  try {
    // Test with a sample user ID (replace with actual dentist user ID)
    const testUserId = 'cm57dq5ct000214ykfmwprj9b';
    console.log('🧪 Testing with userId:', testUserId);
    
    // Import the action (this won't work in browser, but shows the structure)
    // const { getOrCreateConversation } = await import('/app/actions/chat');
    
    // Instead, we can test the API directly
    const response = await fetch('/api/test-chat-creation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: testUserId })
    });
    
    const result = await response.json();
    console.log('🧪 API Response:', result);
    
    if (response.ok) {
      console.log('✅ Chat creation successful');
      console.log('📄 Conversation ID:', result.conversationId);
    } else {
      console.error('❌ Chat creation failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testChatCreation(); 