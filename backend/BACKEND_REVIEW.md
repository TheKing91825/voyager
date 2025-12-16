# Backend Review & Recommendations

## ✅ What's Working

Your backend is now **successfully running** on `http://localhost:3001`!

### Current Architecture
- **Framework**: Express.js (v5.2.1)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT via Supabase Auth
- **AI Integration**: Google Gemini API
- **Port**: 3001

### Routes Implemented
- `GET /health` - Health check endpoint
- `GET /` - Status endpoint
- `GET /api/profile/me` - Get current user profile
- `PATCH /api/profile/me` - Update current user profile
- `GET /api/posts` - Get all posts (latest 50)
- `POST /api/posts` - Create new post
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create new trip
- `POST /api/ai/explore` - AI-powered activity suggestions

---

## 🔧 Issues Fixed

### 1. Environment Variables Not Loading
**Problem**: `authRequired.js` was creating Supabase client before dotenv loaded
**Solution**: Added `dotenv.config()` to middleware file

---

## 🚀 Production Readiness Recommendations

### 1. **Input Validation (Critical)**

Currently missing request validation. Add Zod schemas for all routes:

```javascript
// Example: backend/src/schemas/post.schema.js
import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1).max(1000),
  image_url: z.string().url().optional()
});

export const createTripSchema = z.object({
  name: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  description: z.string().max(2000).optional()
});
```

Then use in routes:
```javascript
router.post("/", async (req, res, next) => {
  try {
    const validated = createPostSchema.parse(req.body);
    // ... rest of code
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }
    next(e);
  }
});
```

### 2. **Error Handling (Important)**

Create a custom error handler:

```javascript
// backend/src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase errors
  if (err.code) {
    return res.status(400).json({
      error: err.message,
      details: err.details
    });
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};
```

### 3. **Rate Limiting (Critical for Production)**

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
// backend/src/index.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20 // stricter limit for AI endpoints
});

app.use('/api/', limiter);
app.use('/api/ai/', aiLimiter);
```

### 4. **Environment Variables Security**

**CRITICAL**: Your `.env` file contains sensitive keys and is currently in version control!

Update `.gitignore`:
```
# Environment variables
backend/.env
.env
*.env
.env.local
.env.production

# Dependencies
backend/node_modules/
node_modules/

# Build outputs
backend/dist/
backend/build/
```

Create `.env.example`:
```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**ACTION REQUIRED**: Remove sensitive data from git history:
```bash
git rm --cached backend/.env
git commit -m "Remove .env from version control"
```

### 5. **Logging (Important)**

Replace console.log with proper logging:

```bash
npm install winston
```

```javascript
// backend/src/utils/logger.js
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### 6. **Database Query Optimizations**

Add pagination to all list endpoints:

```javascript
// Example for posts
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // max 100
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("posts")
      .select("*, profiles:profiles(username, profile_image_url)", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    res.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (e) {
    next(e);
  }
});
```

### 7. **API Documentation**

Add Swagger/OpenAPI documentation:

```bash
npm install swagger-jsdoc swagger-ui-express
```

### 8. **Testing**

Add test suite:

```bash
npm install --save-dev jest supertest @types/jest
```

Create test structure:
```
backend/
├── src/
└── tests/
    ├── routes/
    │   ├── profile.test.js
    │   ├── posts.test.js
    │   └── trips.test.js
    └── setup.js
```

### 9. **CORS Configuration**

Update CORS for production:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 10. **Health Check Enhancement**

Improve health check to test dependencies:

```javascript
app.get("/health", async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok'
  };

  try {
    // Test Supabase connection
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    health.database = 'connected';
  } catch (e) {
    health.database = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### 11. **AI Route Improvements**

Add better error handling and response parsing for Gemini:

```javascript
router.post("/explore", async (req, res, next) => {
  try {
    // Add validation
    const { prompt, numActivities } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt required' });
    }
    
    const num = parseInt(numActivities) || 5;
    if (num < 1 || num > 20) {
      return res.status(400).json({ error: 'numActivities must be between 1 and 20' });
    }

    const finalPrompt = `
You are Voyager, a travel assistant.
User wants ${num} activities for: ${prompt}
Return a JSON array with exactly ${num} activities.
Each activity must have: name (string), description (string), category (string), latitude (number, optional), longitude (number, optional).
Respond ONLY with valid JSON, no markdown or code blocks.
`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + 
      process.env.GEMINI_API_KEY;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    });

    if (!r.ok) {
      throw new Error(`Gemini API error: ${r.status}`);
    }

    const json = await r.json();
    
    // Extract and parse the actual text response
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Invalid response from Gemini API');
    }

    // Try to parse as JSON
    try {
      const activities = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
      res.json({ activities });
    } catch (e) {
      // If parsing fails, return raw text
      res.json({ activities: [], rawResponse: text });
    }
  } catch (e) {
    next(e);
  }
});
```

### 12. **Additional Routes to Consider**

Based on your schema, you might want to add:

```javascript
// Get single post by ID
router.get("/:id", async (req, res, next) => { ... });

// Delete post
router.delete("/:id", async (req, res, next) => { ... });

// Like/Unlike post
router.post("/:id/like", async (req, res, next) => { ... });

// Get user profile by ID/username
router.get("/:username", async (req, res, next) => { ... });

// Trip members management
router.post("/trips/:id/members", async (req, res, next) => { ... });
router.delete("/trips/:id/members/:userId", async (req, res, next) => { ... });

// Trip activities
router.get("/trips/:id/activities", async (req, res, next) => { ... });
router.post("/trips/:id/activities", async (req, res, next) => { ... });
```

---

## 📁 Suggested File Structure

```
backend/
├── src/
│   ├── index.js                 ✅ Exists
│   ├── supabase.js              ✅ Exists
│   ├── config/
│   │   ├── cors.js              ⚠️ Add
│   │   └── rateLimit.js         ⚠️ Add
│   ├── middleware/
│   │   ├── authRequired.js      ✅ Fixed
│   │   ├── errorHandler.js      ⚠️ Add
│   │   └── validator.js         ⚠️ Add
│   ├── routes/
│   │   ├── profile.routes.js    ✅ Exists
│   │   ├── post.routes.js       ✅ Exists
│   │   ├── trip.routes.js       ✅ Exists
│   │   └── ai.routes.js         ✅ Exists
│   ├── controllers/             ⚠️ Optional (for separation)
│   ├── schemas/                 ⚠️ Add for Zod validation
│   │   ├── post.schema.js
│   │   ├── trip.schema.js
│   │   └── profile.schema.js
│   └── utils/
│       └── logger.js            ⚠️ Add
├── tests/                       ⚠️ Add
├── .env                         ✅ Exists (REMOVE FROM GIT!)
├── .env.example                 ⚠️ Add
├── .gitignore                   ⚠️ Update
├── package.json                 ✅ Exists
└── README.md                    ⚠️ Add
```

---

## 🔒 Security Checklist

- [x] Using Helmet for security headers
- [x] Using service role key on backend (correct approach)
- [x] JWT validation in authRequired middleware
- [ ] ⚠️ Add rate limiting
- [ ] ⚠️ Add input validation (Zod)
- [ ] ⚠️ Remove .env from git
- [ ] ⚠️ Add request size limits (already at 2mb for JSON)
- [ ] ⚠️ Add CORS whitelist for production
- [ ] ⚠️ Add SQL injection protection (Supabase handles this)
- [ ] ⚠️ Add XSS protection (sanitize user inputs)

---

## 📊 Performance Recommendations

1. **Add caching** for frequently accessed data (Redis)
2. **Database indexes** on Supabase for:
   - `posts.user_id`
   - `posts.created_at`
   - `trips.owner_id`
   - `profiles.username`
3. **Compression middleware**:
   ```bash
   npm install compression
   ```
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```
4. **Connection pooling** (Supabase handles this)

---

## 🚀 Deployment Considerations

### Environment Variables (Required)
```
NODE_ENV=production
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
PORT=3001
CORS_ORIGIN=https://yourdomain.com
```

### Platforms
- **Recommended**: Railway, Render, or Fly.io
- **Alternative**: AWS ECS, Google Cloud Run, or DigitalOcean App Platform

### Pre-deployment Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure CORS origins
- [ ] Set up environment variables
- [ ] Add monitoring (e.g., Sentry)
- [ ] Set up logging aggregation
- [ ] Configure health checks
- [ ] Set up CI/CD pipeline
- [ ] Add database backups

---

## 📝 Next Steps

### Immediate (Before Production)
1. ✅ Fix dotenv loading issue (DONE)
2. ⚠️ Remove .env from git and rotate all keys
3. ⚠️ Add input validation with Zod
4. ⚠️ Add rate limiting
5. ⚠️ Update .gitignore

### Short Term
1. Add comprehensive error handling
2. Add proper logging
3. Add pagination to all list endpoints
4. Write tests
5. Add API documentation

### Long Term
1. Add caching layer
2. Add monitoring and alerting
3. Implement CI/CD
4. Add database migrations management
5. Performance optimization

---

## 🎉 Summary

Your backend has a **solid foundation**! The architecture is clean, uses modern tools, and follows good practices. The main areas to focus on before production are:

1. **Security**: Remove secrets from git, add rate limiting
2. **Validation**: Add Zod schemas for all inputs
3. **Error Handling**: Comprehensive error handling
4. **Testing**: Add test coverage
5. **Documentation**: API docs for frontend developers

The backend is ready for development and can handle your Next.js and React Native apps!
