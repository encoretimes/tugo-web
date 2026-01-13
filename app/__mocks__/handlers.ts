import { http, HttpResponse } from 'msw';

// For tests, use localhost as default
const API_URL = 'http://localhost:30000';

// Mock data
const mockPosts = [
  {
    postId: 1,
    author: {
      name: '테스트 유저',
      username: 'testuser',
      profileImageUrl: null,
    },
    contentText: '테스트 게시물입니다.',
    postType: 'FREE',
    ppvPrice: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    stats: {
      comments: 5,
      likes: 10,
    },
    mediaUrls: [],
    poll: null,
    isLiked: false,
    isSaved: false,
  },
  {
    postId: 2,
    author: {
      name: '다른 유저',
      username: 'otheruser',
      profileImageUrl: null,
    },
    contentText: '두 번째 게시물입니다.',
    postType: 'SUBSCRIBER_ONLY',
    ppvPrice: null,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    stats: {
      comments: 3,
      likes: 7,
    },
    mediaUrls: [],
    poll: null,
    isLiked: true,
    isSaved: false,
  },
];

const mockSubscriptionStatus = {
  isSubscribed: false,
  subscriptionId: null,
};

export const handlers = [
  // Posts handlers
  http.get(`${API_URL}/api/v1/posts`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 0);
    const size = Number(url.searchParams.get('size') || 10);

    return HttpResponse.json({
      content: mockPosts,
      page: {
        size,
        number: page,
        totalElements: mockPosts.length,
        totalPages: 1,
      },
    });
  }),

  http.get(`${API_URL}/api/v1/posts/:postId`, ({ params }) => {
    const { postId } = params;
    const post = mockPosts.find((p) => p.postId === Number(postId));

    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  http.post(`${API_URL}/api/v1/posts`, async ({ request }) => {
    const body = (await request.json()) as {
      contentText: string;
      postType: string;
    };

    const newPost = {
      postId: mockPosts.length + 1,
      author: {
        name: '현재 유저',
        username: 'currentuser',
        profileImageUrl: null,
      },
      contentText: body.contentText,
      postType: body.postType || 'FREE',
      ppvPrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        comments: 0,
        likes: 0,
      },
      mediaUrls: [],
      poll: null,
      isLiked: false,
      isSaved: false,
    };

    return HttpResponse.json(newPost, { status: 201 });
  }),

  http.delete(`${API_URL}/api/v1/posts/:postId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Subscription handlers
  http.get(`${API_URL}/api/v1/subscriptions/status/:targetMemberId`, () => {
    return HttpResponse.json(mockSubscriptionStatus);
  }),

  http.post(`${API_URL}/api/v1/subscriptions`, async ({ request }) => {
    const body = (await request.json()) as { targetMemberId: number };

    return HttpResponse.json({
      id: 1,
      targetMemberId: body.targetMemberId,
      memberId: 999,
      subscriptionStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  http.delete(`${API_URL}/api/v1/subscriptions/:subscriptionId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Like handlers
  http.post(`${API_URL}/api/v1/likes/posts/:postId`, () => {
    return HttpResponse.json({ message: 'Liked' });
  }),

  http.delete(`${API_URL}/api/v1/likes/posts/:postId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
