async function testSearchAPI() {
  console.log('🔍 Testing Search API Functionality\n');
  
  const fetch = (await import('node-fetch')).default;
  
  const baseURL = 'http://localhost:3000';
  const testCases = [
    // Test basic dentists endpoint
    {
      name: 'Basic dentists endpoint (no filters)',
      url: `${baseURL}/api/dentists?page=1&limit=5`
    },
    // Test with city filter
    {
      name: 'Dentists by city (Ahmedabad)',
      url: `${baseURL}/api/dentists?page=1&limit=5&city=Ahmedabad`
    },
    // Test with search parameter
    {
      name: 'Search for "dentist"',
      url: `${baseURL}/api/dentists?page=1&limit=5&search=dentist`
    },
    // Test with location
    {
      name: 'Location search (Mumbai)',
      url: `${baseURL}/api/dentists?page=1&limit=5&location=Mumbai`
    },
    // Test near me search
    {
      name: 'Near me search',
      url: `${baseURL}/api/dentists?page=1&limit=5&search=near%20me&nearby=true`
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    try {
      const response = await fetch(testCase.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'referer': 'http://localhost:3000'
        }
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success:`);
        console.log(`   - Total dentists found: ${data.pagination?.total || 0}`);
        console.log(`   - Dentists in this page: ${data.dentists?.length || 0}`);
        console.log(`   - Has more pages: ${data.pagination?.hasMore || false}`);
        
        if (data.dentists && data.dentists.length > 0) {
          console.log(`   - First dentist: ${data.dentists[0].name || 'Unknown'} (${data.dentists[0].city || 'No city'})`);
        }
        
        if (data.error) {
          console.log(`   ⚠️ API returned error: ${data.error}`);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Could not parse error response' }));
        console.log(`❌ Failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log('─'.repeat(50));
  }
  
  console.log('\n🔍 Database Connection Test');
  try {
    const dbTestResponse = await fetch(`${baseURL}/api/test-db`, {
      headers: {
        'referer': 'http://localhost:3000'
      }
    });
    console.log(`Database test status: ${dbTestResponse.status}`);
    if (dbTestResponse.ok) {
      const dbData = await dbTestResponse.json();
      console.log('✅ Database connection successful');
      console.log(`   - Total dentists in DB: ${dbData.totalDentists || 'Unknown'}`);
    } else {
      console.log('❌ Database connection failed');
    }
  } catch (error) {
    console.log(`❌ Database test error: ${error.message}`);
  }
}

// Run the test
testSearchAPI().catch(console.error);

module.exports = { testSearchAPI }; 