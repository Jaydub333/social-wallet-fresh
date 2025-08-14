const http = require('http');
const url = require('url');
const port = process.env.PORT || 3000;

console.log('🚀 Social Wallet API starting...');

// In-memory database (for demo - in production use MongoDB/PostgreSQL)
let database = {
  users: [
    {
      id: 'user_001',
      username: 'demo_user',
      displayName: 'Demo User',
      email: 'demo@socialwallet.com',
      bio: 'Social Wallet demo user',
      profileImage: null,
      createdAt: new Date().toISOString(),
      verified: true
    }
  ],
  posts: [
    {
      id: 'post_001',
      userId: 'user_001',
      content: 'Welcome to Social Wallet! 🚀 This is a real post stored in the database.',
      media: null,
      hashtags: ['SocialWallet', 'Welcome'],
      likes: 5,
      shares: 2,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  comments: [
    {
      id: 'comment_001',
      postId: 'post_001',
      userId: 'user_001',
      content: 'This is a real comment from the database!',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  likes: [
    {
      id: 'like_001',
      postId: 'post_001',
      userId: 'user_001',
      createdAt: new Date().toISOString()
    }
  ]
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        resolve({});
      }
    });
  });
}

function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Root endpoint
  if (path === '/' || path === '') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: '🚀 Social Wallet API is LIVE with Database!',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      status: 'Working perfectly',
      endpoints: {
        users: '/api/users',
        posts: '/api/posts',
        comments: '/api/comments',
        likes: '/api/likes'
      }
    }));
    return;
  }

  // Health check
  if (path === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      healthy: true,
      uptime: process.uptime(),
      database: {
        users: database.users.length,
        posts: database.posts.length,
        comments: database.comments.length,
        likes: database.likes.length
      }
    }));
    return;
  }

  // API Routes
  try {
    // Users endpoints
    if (path === '/api/users' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        users: database.users.map(user => ({
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          bio: user.bio,
          profileImage: user.profileImage,
          verified: user.verified,
          createdAt: user.createdAt
        }))
      }));
      return;
    }

    if (path === '/api/users' && method === 'POST') {
      const body = await parseBody(req);
      const newUser = {
        id: generateId('user'),
        username: body.username || `user_${Date.now()}`,
        displayName: body.displayName || 'New User',
        email: body.email || '',
        bio: body.bio || '',
        profileImage: body.profileImage || null,
        createdAt: new Date().toISOString(),
        verified: false
      };
      
      database.users.push(newUser);
      
      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        message: 'User created successfully',
        user: newUser
      }));
      return;
    }

    // Posts endpoints
    if (path === '/api/posts' && method === 'GET') {
      const postsWithUsers = database.posts.map(post => {
        const user = database.users.find(u => u.id === post.userId);
        const postComments = database.comments.filter(c => c.postId === post.id);
        const postLikes = database.likes.filter(l => l.postId === post.id);
        
        return {
          ...post,
          author: {
            id: user?.id,
            username: user?.username,
            displayName: user?.displayName,
            profileImage: user?.profileImage
          },
          commentsCount: postComments.length,
          likesCount: postLikes.length,
          comments: postComments.map(comment => {
            const commentUser = database.users.find(u => u.id === comment.userId);
            return {
              ...comment,
              author: {
                displayName: commentUser?.displayName || 'Anonymous'
              }
            };
          })
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        posts: postsWithUsers
      }));
      return;
    }

    if (path === '/api/posts' && method === 'POST') {
      const body = await parseBody(req);
      
      if (!body.content && !body.media) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: 'Post content or media is required'
        }));
        return;
      }

      const hashtags = body.content ? body.content.match(/#[\w]+/g)?.map(tag => tag.substring(1)) || [] : [];
      
      const newPost = {
        id: generateId('post'),
        userId: body.userId || 'user_001', // Default to demo user
        content: body.content || '',
        media: body.media || null,
        hashtags: hashtags,
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString()
      };
      
      database.posts.push(newPost);
      
      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        message: 'Post created successfully',
        post: newPost
      }));
      return;
    }

    // Comments endpoints
    if (path.startsWith('/api/posts/') && path.endsWith('/comments') && method === 'POST') {
      const postId = path.split('/')[3];
      const body = await parseBody(req);
      
      if (!body.content) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: 'Comment content is required'
        }));
        return;
      }

      const newComment = {
        id: generateId('comment'),
        postId: postId,
        userId: body.userId || 'user_001',
        content: body.content,
        createdAt: new Date().toISOString()
      };
      
      database.comments.push(newComment);
      
      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        message: 'Comment added successfully',
        comment: newComment
      }));
      return;
    }

    // Likes endpoints
    if (path.startsWith('/api/posts/') && path.endsWith('/like') && method === 'POST') {
      const postId = path.split('/')[3];
      const body = await parseBody(req);
      const userId = body.userId || 'user_001';
      
      // Check if already liked
      const existingLike = database.likes.find(l => l.postId === postId && l.userId === userId);
      
      if (existingLike) {
        // Unlike
        database.likes = database.likes.filter(l => l.id !== existingLike.id);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Post unliked',
          liked: false
        }));
      } else {
        // Like
        const newLike = {
          id: generateId('like'),
          postId: postId,
          userId: userId,
          createdAt: new Date().toISOString()
        };
        
        database.likes.push(newLike);
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          message: 'Post liked',
          liked: true
        }));
      }
      return;
    }

    // Profile endpoint
    if (path === '/api/profile' && method === 'GET') {
      const userId = parsedUrl.query.userId || 'user_001';
      const user = database.users.find(u => u.id === userId);
      
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          error: 'User not found'
        }));
        return;
      }

      const userPosts = database.posts.filter(p => p.userId === userId);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        profile: {
          ...user,
          postsCount: userPosts.length,
          followersCount: 0,
          followingCount: 0
        }
      }));
      return;
    }

    if (path === '/api/profile' && method === 'PUT') {
      const body = await parseBody(req);
      const userId = body.userId || 'user_001';
      const userIndex = database.users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          error: 'User not found'
        }));
        return;
      }

      // Update user profile
      database.users[userIndex] = {
        ...database.users[userIndex],
        displayName: body.displayName || database.users[userIndex].displayName,
        bio: body.bio || database.users[userIndex].bio,
        profileImage: body.profileImage || database.users[userIndex].profileImage
      };

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Profile updated successfully',
        profile: database.users[userIndex]
      }));
      return;
    }

    // 404 for unknown routes
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      error: 'Endpoint not found',
      availableEndpoints: [
        'GET /',
        'GET /health',
        'GET /api/users',
        'POST /api/users',
        'GET /api/posts',
        'POST /api/posts',
        'POST /api/posts/:id/comments',
        'POST /api/posts/:id/like',
        'GET /api/profile',
        'PUT /api/profile'
      ]
    }));

  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }));
  }
});

server.listen(port, () => {
  console.log('✅ Social Wallet API with Database running on port', port);
  console.log('📊 Database initialized with sample data');
});