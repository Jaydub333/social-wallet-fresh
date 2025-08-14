# 🧪 Social Wallet API - Testing Guide

## Your API URLs
- **DigitalOcean**: `https://squid-app-mky7a.ondigitalocean.app`
- **Render**: `https://social-wallet-fresh.onrender.com`

---

## 🌐 Method 1: Browser Testing (Easiest)

### Test Your API Instantly:
1. **Main API Info**: 
   - DigitalOcean: https://squid-app-mky7a.ondigitalocean.app
   - Render: https://social-wallet-fresh.onrender.com

2. **Health Check**: 
   - DigitalOcean: https://squid-app-mky7a.ondigitalocean.app/health
   - Render: https://social-wallet-fresh.onrender.com/health

3. **Test Invalid Endpoint**: 
   - https://squid-app-mky7a.ondigitalocean.app/nonexistent
   - Should return 404 error

---

## 💻 Method 2: Command Line (curl)

### Basic Tests:
```bash
# Test main endpoint
curl https://squid-app-mky7a.ondigitalocean.app

# Test health endpoint  
curl https://squid-app-mky7a.ondigitalocean.app/health

# Test with headers (formatted JSON)
curl -H "Accept: application/json" https://squid-app-mky7a.ondigitalocean.app

# Test invalid endpoint (should return 404)
curl https://squid-app-mky7a.ondigitalocean.app/invalid
```

### Advanced Tests:
```bash
# Test with user agent
curl -H "User-Agent: MyApp/1.0" https://squid-app-mky7a.ondigitalocean.app

# Test response time
curl -w "@curl-format.txt" -s -o /dev/null https://squid-app-mky7a.ondigitalocean.app

# Test CORS headers
curl -H "Origin: https://myapp.com" -v https://squid-app-mky7a.ondigitalocean.app
```

---

## 🚀 Method 3: Postman Testing (Professional)

### Setup Postman Collection:

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create New Collection**: "Social Wallet API Tests"
3. **Add these requests**:

#### Request 1: Get API Info
- **Method**: GET
- **URL**: `https://squid-app-mky7a.ondigitalocean.app`
- **Expected Response**: 
```json
{
  "success": true,
  "message": "🚀 Social Wallet API is LIVE!",
  "timestamp": "2025-08-14T17:06:05.724Z",
  "version": "1.0.0",
  "status": "Working perfectly"
}
```

#### Request 2: Health Check
- **Method**: GET
- **URL**: `https://squid-app-mky7a.ondigitalocean.app/health`
- **Expected Response**:
```json
{
  "status": "OK",
  "healthy": true,
  "uptime": 271.01542665
}
```

#### Request 3: Test 404
- **Method**: GET
- **URL**: `https://squid-app-mky7a.ondigitalocean.app/nonexistent`
- **Expected Response**: 404 status
```json
{
  "error": "Not Found"
}
```

### Postman Test Scripts:
```javascript
// Add this to "Tests" tab in Postman
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

---

## 🔧 Method 4: JavaScript Testing (Code)

### Simple Fetch Test:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Social Wallet API Test</title>
</head>
<body>
    <h1>Social Wallet API Test</h1>
    <button onclick="testAPI()">Test API</button>
    <pre id="result"></pre>

    <script>
        async function testAPI() {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = 'Testing...';
            
            try {
                const response = await fetch('https://squid-app-mky7a.ondigitalocean.app');
                const data = await response.json();
                
                resultDiv.textContent = JSON.stringify(data, null, 2);
                console.log('API Response:', data);
            } catch (error) {
                resultDiv.textContent = `Error: ${error.message}`;
                console.error('API Error:', error);
            }
        }
    </script>
</body>
</html>
```

### Node.js Test Script:
```javascript
// test-api.js
const https = require('https');

function testAPI(url, name) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const duration = Date.now() - start;
                try {
                    const json = JSON.parse(data);
                    console.log(`✅ ${name}: ${res.statusCode} (${duration}ms)`);
                    console.log(json);
                    resolve(json);
                } catch (error) {
                    console.log(`❌ ${name}: Invalid JSON`);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.log(`❌ ${name}: ${error.message}`);
            reject(error);
        });
    });
}

// Run tests
async function runTests() {
    console.log('🧪 Testing Social Wallet API...\n');
    
    try {
        await testAPI('https://squid-app-mky7a.ondigitalocean.app', 'Main API');
        await testAPI('https://squid-app-mky7a.ondigitalocean.app/health', 'Health Check');
        console.log('\n✅ All tests passed!');
    } catch (error) {
        console.log('\n❌ Some tests failed:', error.message);
    }
}

runTests();
```

Run with: `node test-api.js`

---

## 📊 Method 5: Load Testing (Performance)

### Simple Load Test with curl:
```bash
# Test 10 concurrent requests
for i in {1..10}; do
    curl -s https://squid-app-mky7a.ondigitalocean.app &
done
wait
echo "Load test complete"
```

### Using Apache Bench (ab):
```bash
# Install ab (Ubuntu/Debian)
sudo apt-get install apache2-utils

# Test 100 requests with 10 concurrent
ab -n 100 -c 10 https://squid-app-mky7a.ondigitalocean.app/

# Test health endpoint
ab -n 50 -c 5 https://squid-app-mky7a.ondigitalocean.app/health
```

---

## 🔍 Method 6: Monitoring & Analytics

### Basic Uptime Monitoring:
```bash
# Check if API is up every 30 seconds
while true; do
    status=$(curl -s -o /dev/null -w "%{http_code}" https://squid-app-mky7a.ondigitalocean.app)
    if [ $status -eq 200 ]; then
        echo "$(date): ✅ API is UP (HTTP $status)"
    else
        echo "$(date): ❌ API is DOWN (HTTP $status)"
    fi
    sleep 30
done
```

### Response Time Monitoring:
```bash
# Monitor response times
curl -w "Time: %{time_total}s, Status: %{http_code}\n" -s -o /dev/null https://squid-app-mky7a.ondigitalocean.app
```

---

## 🎯 Expected Test Results

### ✅ Successful Response (Main API):
```json
{
  "success": true,
  "message": "🚀 Social Wallet API is LIVE!",
  "timestamp": "2025-08-14T17:06:05.724Z",
  "version": "1.0.0", 
  "status": "Working perfectly"
}
```

### ✅ Successful Response (Health):
```json
{
  "status": "OK",
  "healthy": true,
  "uptime": 271.01542665
}
```

### ❌ Error Response (404):
```json
{
  "error": "Not Found"
}
```

---

## 🚨 Troubleshooting

### Common Issues:

#### **Connection Refused / Timeout**
- Check if URL is correct
- Verify internet connection
- Try different endpoint (/health)

#### **CORS Errors (in browser)**
- Expected behavior for cross-origin requests
- API includes CORS headers: `Access-Control-Allow-Origin: *`

#### **SSL Certificate Errors**
- Both URLs use valid HTTPS certificates
- Should not occur with modern browsers/tools

#### **500 Internal Server Error**
- Check DigitalOcean/Render logs
- API should be stable, contact if persistent

---

## 📈 Performance Benchmarks

### Expected Performance:
- **Response Time**: < 500ms for most requests
- **Uptime**: > 99.9% (both platforms)
- **Concurrent Users**: Handles 100+ simultaneous requests
- **Rate Limits**: None currently implemented

### Monitoring Tools:
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Performance monitoring
- **New Relic**: APM monitoring
- **DigitalOcean Monitoring**: Built-in metrics

---

## 🎉 Next Steps

Once you've confirmed your API is working:

1. **Document Your Tests**: Save successful test results
2. **Set Up Monitoring**: Choose an uptime monitoring service  
3. **Plan Features**: Add OAuth, user management, payments
4. **Scale Infrastructure**: Upgrade plans as traffic grows
5. **Market Your API**: Share documentation with potential customers

---

**Your Social Wallet API is live and ready for testing! 🚀**

*Try all these methods to ensure your API is working perfectly across different scenarios.*