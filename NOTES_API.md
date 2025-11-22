# Notes API 문서

## 개요

Notes는 사용자 간 실시간 쪽지(메시지) 기능을 제공하는 API입니다. WebSocket(STOMP)을 통한 실시간 메시지 전송과 REST API를 통한 메시지 조회를 지원합니다.

**주요 기능:**
- 1:1 쪽지방 자동 생성 및 관리
- 실시간 메시지 송수신 (STOMP over WebSocket)
- 메시지 히스토리 조회 (커서 기반 페이지네이션)
- 쪽지방 목록 조회
- 안읽은 메시지 수 관리
- Redis를 활용한 실시간 메시지 전달 및 캐싱

**기술 스택:**
- WebSocket + STOMP (실시간 메시징)
- Redis Pub/Sub (분산 메시지 브로드캐스팅)
- Redis Cache (방 목록, 안읽은 메시지 수, 마지막 메시지 정보)
- MySQL (메시지 영구 저장)

---

## 아키텍처

### 데이터 모델

#### NotesRoom (쪽지방)
```
- id: Long (PK)
- memberOneId: Long (작은 사용자 ID, unique constraint)
- memberTwoId: Long (큰 사용자 ID, unique constraint)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

**특징:**
- 두 사용자 간 1:1 대화방
- (memberOneId, memberTwoId) 조합이 unique하여 중복 방 생성 방지
- 항상 작은 ID가 memberOneId에 저장됨 (정규화)

#### NotesMessage (쪽지 메시지)
```
- id: Long (PK)
- roomId: Long (쪽지방 ID)
- senderId: Long (발신자 ID)
- content: String (메시지 내용)
- createdAt: LocalDateTime
```

### Redis 데이터 구조

#### 1. 사용자별 쪽지방 목록 (Sorted Set)
```
Key: user:{userId}:rooms
Value: roomId (String)
Score: timestamp (메시지 발생 시각, epoch millis)
```
**용도:** 사용자의 쪽지방 목록을 최신순으로 조회

#### 2. 사용자별 안읽은 메시지 수 (Hash)
```
Key: user:{userId}:unread
Field: roomId
Value: unreadCount
```
**용도:** 각 방별 안읽은 메시지 개수 관리

#### 3. 쪽지방 메타 정보 (Hash)
```
Key: room:{roomId}:meta
Fields:
  - lastMessage: 마지막 메시지 내용
  - senderId: 마지막 메시지 발신자 ID
  - timestamp: 마지막 메시지 시각 (epoch millis)
```
**용도:** 쪽지방 목록에 표시할 정보 캐싱

#### 4. 쪽지방 조회 캐시 (String)
```
Key: notes:room:{smallerId}:{largerId}
Value: roomId
```
**용도:** 두 사용자 간 쪽지방 ID 캐싱 (DB 조회 최소화)

#### 5. Redis Pub/Sub 채널
```
Channel: notes
Message: MessageResponse (JSON)
```
**용도:** 실시간 메시지를 모든 서버 인스턴스에 브로드캐스팅

---

## WebSocket 연결

### 연결 설정

**WebSocket Endpoint:**
```
ws://localhost:{port}/ws-stomp
```

**STOMP Configuration:**
- Application Destination Prefix: `/pub`
- Broker Destination Prefix: `/sub`

### 클라이언트 연결 예시

#### JavaScript (SockJS + STOMP)
```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws-stomp');
const stompClient = new Client({
  webSocketFactory: () => socket,
  debug: (str) => console.log(str),

  onConnect: () => {
    console.log('Connected to STOMP');

    // 특정 쪽지방 구독
    stompClient.subscribe('/sub/notes/rooms/1', (message) => {
      const receivedMessage = JSON.parse(message.body);
      console.log('New message:', receivedMessage);
    });
  },

  onStompError: (frame) => {
    console.error('STOMP error:', frame);
  }
});

stompClient.activate();
```

---

## REST API

### 1. 쪽지방 목록 조회

사용자의 모든 쪽지방을 최신 메시지 순으로 조회합니다.

**Endpoint:**
```
GET /api/v1/notes/rooms
```

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| page | int | X | 0 | 페이지 번호 (0부터 시작) |
| size | int | X | 20 | 페이지 크기 |

**Response:** `200 OK`
```json
[
  {
    "roomId": 1,
    "lastMessage": "안녕하세요!",
    "isMyLastMessage": true,
    "lastMessageTimestamp": "2025-11-22T10:30:00",
    "unreadCount": 0
  },
  {
    "roomId": 2,
    "lastMessage": "네 알겠습니다",
    "isMyLastMessage": false,
    "lastMessageTimestamp": "2025-11-22T09:15:00",
    "unreadCount": 3
  }
]
```

**Response Fields:**
| 필드 | 타입 | 설명 |
|------|------|------|
| roomId | Long | 쪽지방 ID |
| lastMessage | String | 마지막 메시지 내용 |
| isMyLastMessage | boolean | 마지막 메시지를 내가 보냈는지 여부 |
| lastMessageTimestamp | LocalDateTime | 마지막 메시지 시각 (ISO 8601) |
| unreadCount | long | 안읽은 메시지 수 |

**예시:**
```bash
curl -X GET "http://localhost:8080/api/v1/notes/rooms?page=0&size=20"
```

---

### 2. 특정 사용자와의 메시지 조회

특정 사용자와의 쪽지방 및 메시지 목록을 조회합니다. 쪽지방이 없으면 자동으로 생성됩니다.

**Endpoint:**
```
GET /api/v1/notes/user/{otherUserId}/messages
```

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| otherUserId | Long | O | 대화 상대방 사용자 ID |

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| cursor | Long | X | null | 커서 (이전 응답의 nextCursor 값) |
| size | int | X | 30 | 한 번에 조회할 메시지 수 |

**Response:** `200 OK`
```json
{
  "roomId": 1,
  "messages": [
    {
      "roomId": 1,
      "messageId": 15,
      "senderId": 2,
      "content": "안녕하세요!",
      "timestamp": "2025-11-22T10:30:00"
    },
    {
      "roomId": 1,
      "messageId": 14,
      "senderId": 3,
      "content": "네 반갑습니다",
      "timestamp": "2025-11-22T10:29:00"
    }
  ],
  "nextCursor": 14
}
```

**Response Fields:**
| 필드 | 타입 | 설명 |
|------|------|------|
| roomId | Long | 쪽지방 ID |
| messages | Array | 메시지 목록 (최신순) |
| messages[].roomId | Long | 쪽지방 ID |
| messages[].messageId | Long | 메시지 ID |
| messages[].senderId | Long | 발신자 사용자 ID |
| messages[].content | String | 메시지 내용 |
| messages[].timestamp | LocalDateTime | 메시지 전송 시각 (ISO 8601) |
| nextCursor | Long | 다음 페이지 조회용 커서 (더 이상 없으면 null) |

**커서 기반 페이지네이션:**
1. 첫 조회: `cursor` 파라미터 없이 요청
2. 이후 조회: 응답의 `nextCursor` 값을 `cursor` 파라미터로 전달
3. `nextCursor`가 null이면 마지막 페이지

**예시:**
```bash
# 첫 페이지 조회
curl -X GET "http://localhost:8080/api/v1/notes/user/3/messages?size=30"

# 다음 페이지 조회 (nextCursor=14 사용)
curl -X GET "http://localhost:8080/api/v1/notes/user/3/messages?cursor=14&size=30"
```

---

### 3. 메시지 읽음 처리

특정 쪽지방의 모든 안읽은 메시지를 읽음으로 처리합니다.

**Endpoint:**
```
POST /api/v1/notes/rooms/{roomId}/read
```

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| roomId | Long | O | 쪽지방 ID |

**Response:** `204 No Content`

**예시:**
```bash
curl -X POST "http://localhost:8080/api/v1/notes/rooms/1/read"
```

---

## STOMP 메시지 전송

### 메시지 전송

특정 쪽지방에 메시지를 전송합니다.

**Destination:**
```
/pub/rooms/{roomId}/messages
```

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| roomId | Long | O | 쪽지방 ID |

**Request Body:**
```json
{
  "content": "안녕하세요!"
}
```

**Request Fields:**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| content | String | O | 메시지 내용 |

**예시 (JavaScript):**
```javascript
// 메시지 전송
stompClient.publish({
  destination: '/pub/rooms/1/messages',
  body: JSON.stringify({
    content: '안녕하세요!'
  })
});
```

---

### 메시지 구독

특정 쪽지방의 메시지를 실시간으로 수신합니다.

**Destination:**
```
/sub/notes/rooms/{roomId}
```

**Path Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| roomId | Long | O | 쪽지방 ID |

**Received Message:**
```json
{
  "roomId": 1,
  "messageId": 16,
  "senderId": 2,
  "content": "안녕하세요!",
  "timestamp": "2025-11-22T10:35:00"
}
```

**Message Fields:**
| 필드 | 타입 | 설명 |
|------|------|------|
| roomId | Long | 쪽지방 ID |
| messageId | Long | 메시지 ID |
| senderId | Long | 발신자 사용자 ID |
| content | String | 메시지 내용 |
| timestamp | LocalDateTime | 메시지 전송 시각 (ISO 8601) |

**예시 (JavaScript):**
```javascript
// 쪽지방 1번 구독
const subscription = stompClient.subscribe('/sub/notes/rooms/1', (message) => {
  const data = JSON.parse(message.body);
  console.log('New message from user', data.senderId, ':', data.content);

  // UI 업데이트 등의 처리
  updateMessageList(data);
});

// 구독 해제
subscription.unsubscribe();
```

---

## 데이터 흐름

### 1. 메시지 전송 플로우

```
클라이언트 A (userId=2)
  ↓ STOMP: /pub/rooms/1/messages
  ↓ {content: "Hello"}

NotesStompController
  ↓ NotesService.sendMessage(2, 1, "Hello")

1. MySQL에 메시지 저장
   - NotesMessage 생성 (id=16, roomId=1, senderId=2, content="Hello")

2. Redis 캐시 업데이트
   - user:2:rooms 에 room=1, score=timestamp 추가/업데이트
   - user:3:rooms 에 room=1, score=timestamp 추가/업데이트
   - room:1:meta 업데이트 (lastMessage, senderId, timestamp)
   - user:3:unread 에서 room:1 카운트 증가 (+1)

3. Redis Pub/Sub
   - RedisPublisher.publish("notes", MessageResponse)
   - "notes" 채널에 메시지 발행

Redis Channel "notes"
  ↓ MessageResponse (JSON)

RedisSubscriber (모든 서버 인스턴스)
  ↓ SimpMessageSendingOperations
  ↓ STOMP: /sub/notes/rooms/1

클라이언트 A, B (구독자들)
  ← MessageResponse 수신
```

### 2. 쪽지방 목록 조회 플로우

```
클라이언트
  ↓ GET /api/v1/notes/rooms?page=0&size=20

NotesController
  ↓ NotesService.getRooms(userId=2, pageable)

1. Redis에서 사용자의 쪽지방 ID 목록 조회
   - ZREVRANGE user:2:rooms 0 19
   - 결과: [1, 2, 3, ...] (최신순)

2. Redis에서 각 방의 메타 정보 조회 (배치)
   - HMGET user:2:unread 1 2 3 ... (안읽은 메시지 수)
   - HGETALL room:1:meta, HGETALL room:2:meta, ... (마지막 메시지 정보)

3. RoomResponse 목록 생성 및 반환

클라이언트
  ← List<RoomResponse>
```

### 3. 특정 사용자와 메시지 조회 플로우

```
클라이언트 (userId=2)
  ↓ GET /api/v1/notes/user/3/messages

NotesController
  ↓ NotesService.getMessagesWithUser(2, 3, cursor, size)

1. 쪽지방 조회 (findOrCreateRoom)
   a. Redis 캐시 확인
      - GET notes:room:2:3 (정규화된 키)
      - Hit → roomId 반환
      - Miss → b 단계로

   b. MySQL에서 쪽지방 조회
      - findByMemberOneIdAndMemberTwoId(2, 3)
      - 존재 → Redis에 캐시 저장 후 반환
      - 없음 → c 단계로

   c. 새 쪽지방 생성
      - NotesRoom 생성 (memberOneId=2, memberTwoId=3)
      - MySQL 저장
      - Redis에 캐시 저장

2. 메시지 목록 조회 (getMessages)
   - QueryDSL로 메시지 조회
   - cursor가 null → 최신 30개
   - cursor=14 → id < 14인 메시지 30개
   - ORDER BY id DESC

클라이언트
  ← RoomWithMessageResponse
```

---

## 전체 사용 시나리오

### 시나리오 1: 새로운 대화 시작

**1. 클라이언트 A (userId=2)가 사용자 3과 대화 시작**

```bash
# 메시지 조회 (쪽지방 자동 생성)
GET /api/v1/notes/user/3/messages
```

응답:
```json
{
  "roomId": 1,
  "messages": [],
  "nextCursor": null
}
```

**2. WebSocket 연결 및 쪽지방 구독**

```javascript
stompClient.subscribe('/sub/notes/rooms/1', (message) => {
  const data = JSON.parse(message.body);
  console.log('New message:', data);
});
```

**3. 메시지 전송**

```javascript
stompClient.publish({
  destination: '/pub/rooms/1/messages',
  body: JSON.stringify({ content: '안녕하세요!' })
});
```

**4. 메시지 수신 (실시간)**

구독자(클라이언트 A, B)가 받는 메시지:
```json
{
  "roomId": 1,
  "messageId": 1,
  "senderId": 2,
  "content": "안녕하세요!",
  "timestamp": "2025-11-22T10:30:00"
}
```

---

### 시나리오 2: 기존 대화 이어가기

**1. 쪽지방 목록 조회**

```bash
GET /api/v1/notes/rooms
```

응답:
```json
[
  {
    "roomId": 1,
    "lastMessage": "안녕하세요!",
    "isMyLastMessage": true,
    "lastMessageTimestamp": "2025-11-22T10:30:00",
    "unreadCount": 0
  }
]
```

**2. 특정 쪽지방의 메시지 히스토리 조회**

```bash
GET /api/v1/notes/user/3/messages?size=30
```

응답:
```json
{
  "roomId": 1,
  "messages": [
    {
      "roomId": 1,
      "messageId": 5,
      "senderId": 3,
      "content": "네 잘 지내요",
      "timestamp": "2025-11-22T10:32:00"
    },
    {
      "roomId": 1,
      "messageId": 4,
      "senderId": 2,
      "content": "잘 지내시나요?",
      "timestamp": "2025-11-22T10:31:00"
    },
    {
      "roomId": 1,
      "messageId": 1,
      "senderId": 2,
      "content": "안녕하세요!",
      "timestamp": "2025-11-22T10:30:00"
    }
  ],
  "nextCursor": 1
}
```

**3. 이전 메시지 더 불러오기**

```bash
GET /api/v1/notes/user/3/messages?cursor=1&size=30
```

**4. 쪽지방 입장 시 읽음 처리**

```bash
POST /api/v1/notes/rooms/1/read
```

---

### 시나리오 3: 완전한 채팅 UI 구현 예시

```javascript
// 1. WebSocket 연결
const socket = new SockJS('http://localhost:8080/ws-stomp');
const stompClient = new Client({
  webSocketFactory: () => socket,

  onConnect: async () => {
    console.log('Connected');

    // 2. 쪽지방 목록 조회
    const rooms = await fetch('/api/v1/notes/rooms').then(r => r.json());
    renderRoomList(rooms);

    // 3. 특정 방 선택 시
    const selectedRoomId = 1;
    const otherUserId = 3;

    // 3-1. 메시지 히스토리 조회
    const history = await fetch(`/api/v1/notes/user/${otherUserId}/messages`)
      .then(r => r.json());
    renderMessages(history.messages);

    // 3-2. 실시간 메시지 구독
    stompClient.subscribe(`/sub/notes/rooms/${selectedRoomId}`, (message) => {
      const newMessage = JSON.parse(message.body);
      appendMessage(newMessage);
    });

    // 3-3. 읽음 처리
    await fetch(`/api/v1/notes/rooms/${selectedRoomId}/read`, {
      method: 'POST'
    });

    // 4. 메시지 전송
    document.getElementById('sendBtn').addEventListener('click', () => {
      const content = document.getElementById('messageInput').value;

      stompClient.publish({
        destination: `/pub/rooms/${selectedRoomId}/messages`,
        body: JSON.stringify({ content })
      });

      document.getElementById('messageInput').value = '';
    });
  }
});

stompClient.activate();
```

---

## React/Next.js 구현 예시

### 필요한 패키지 설치

```bash
npm install sockjs-client @stomp/stompjs
```

### 커스텀 훅: useNotesWebSocket

```typescript
// hooks/useNotesWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

interface MessageResponse {
  roomId: number;
  messageId: number;
  senderId: number;
  content: string;
  timestamp: string;
}

export const useNotesWebSocket = (serverUrl: string) => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS(serverUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),

      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
      },

      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [serverUrl]);

  const subscribe = (roomId: number, onMessage: (message: MessageResponse) => void) => {
    if (!clientRef.current || !connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const subscription = clientRef.current.subscribe(
      `/sub/notes/rooms/${roomId}`,
      (message: IMessage) => {
        const data: MessageResponse = JSON.parse(message.body);
        onMessage(data);
      }
    );

    return subscription;
  };

  const sendMessage = (roomId: number, content: string) => {
    if (!clientRef.current || !connected) {
      console.warn('WebSocket not connected');
      return;
    }

    clientRef.current.publish({
      destination: `/pub/rooms/${roomId}/messages`,
      body: JSON.stringify({ content })
    });
  };

  return {
    connected,
    subscribe,
    sendMessage
  };
};
```

### 채팅 컴포넌트 예시

```typescript
// components/ChatRoom.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useNotesWebSocket } from '@/hooks/useNotesWebSocket';

interface Message {
  roomId: number;
  messageId: number;
  senderId: number;
  content: string;
  timestamp: string;
}

interface ChatRoomProps {
  roomId: number;
  otherUserId: number;
  currentUserId: number;
}

export default function ChatRoom({ roomId, otherUserId, currentUserId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { connected, subscribe, sendMessage } = useNotesWebSocket('http://localhost:8080/ws-stomp');

  // 초기 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/v1/notes/user/${otherUserId}/messages?size=50`);
        const data = await response.json();
        setMessages(data.messages.reverse()); // 오래된 순서로 정렬
        setLoading(false);

        // 읽음 처리
        await fetch(`/api/v1/notes/rooms/${roomId}/read`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to load messages:', error);
        setLoading(false);
      }
    };

    loadMessages();
  }, [roomId, otherUserId]);

  // WebSocket 구독
  useEffect(() => {
    if (!connected) return;

    const subscription = subscribe(roomId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);

      // 상대방 메시지인 경우 읽음 처리
      if (newMessage.senderId !== currentUserId) {
        fetch(`/api/v1/notes/rooms/${roomId}/read`, { method: 'POST' });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [connected, roomId, currentUserId]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    sendMessage(roomId, inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.senderId === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border rounded-lg px-4 py-2"
            disabled={!connected}
          />
          <button
            onClick={handleSend}
            disabled={!connected || !inputValue.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            전송
          </button>
        </div>
        {!connected && (
          <p className="text-sm text-red-500 mt-2">연결 중...</p>
        )}
      </div>
    </div>
  );
}
```

### 쪽지방 목록 컴포넌트

```typescript
// components/RoomList.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Room {
  roomId: number;
  lastMessage: string;
  isMyLastMessage: boolean;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch('/api/v1/notes/rooms');
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load rooms:', error);
        setLoading(false);
      }
    };

    loadRooms();

    // 주기적으로 목록 갱신 (선택사항)
    const interval = setInterval(loadRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="divide-y">
      {rooms.map((room) => (
        <div
          key={room.roomId}
          onClick={() => router.push(`/notes/${room.roomId}`)}
          className="p-4 hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium">Room {room.roomId}</p>
              <p className="text-sm text-gray-600 truncate">
                {room.isMyLastMessage ? '나: ' : ''}
                {room.lastMessage}
              </p>
            </div>
            <div className="flex flex-col items-end ml-2">
              <span className="text-xs text-gray-500">
                {new Date(room.lastMessageTimestamp).toLocaleTimeString()}
              </span>
              {room.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                  {room.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 주의사항 및 제약사항

### 현재 구현 상태

1. **인증 미적용**
   - 현재 모든 요청이 `MOCK_USER_ID = 2L`로 처리됩니다
   - NotesController.java:26, NotesStompController.java:21
   - 실제 배포 전 Spring Security 인증 정보로 교체 필요

2. **CORS 설정**
   - WebSocketConfig.java:16에서 `setAllowedOrigins("*")`로 설정
   - 프로덕션 환경에서는 특정 도메인만 허용하도록 변경 필요

3. **메시지 삭제 기능 미구현**
   - 현재 메시지 삭제 API 없음
   - 필요시 추가 구현 필요

4. **파일 첨부 미지원**
   - 텍스트 메시지만 지원
   - 이미지/파일 전송 기능 없음

### 데이터베이스 마이그레이션

unique constraint를 추가했으므로 Flyway 마이그레이션이 필요합니다:

```sql
-- 예시 마이그레이션 파일
ALTER TABLE notes_room
ADD CONSTRAINT uk_notes_room_members
UNIQUE (member_one_id, member_two_id);
```

### 성능 고려사항

1. **Redis 의존성**
   - 쪽지방 목록 조회는 Redis에 전적으로 의존
   - Redis 장애 시 방 목록 조회 불가 (메시지 조회는 가능)

2. **메시지 히스토리 조회**
   - 커서 기반 페이지네이션으로 효율적 조회
   - 권장 인덱스: `notes_message(room_id, id DESC)`

3. **WebSocket 연결 관리**
   - 클라이언트가 페이지를 벗어날 때 연결 해제 필요
   - 재연결 로직 구현 권장

---

## 에러 처리

### 일반적인 에러 케이스

1. **방을 찾을 수 없음**
```json
{
  "error": "Room not found"
}
```

2. **사용자를 찾을 수 없음**
```json
{
  "error": "Member not found"
}
```

3. **자기 자신에게 쪽지 전송 시도**
```json
{
  "error": "DO_NOT_SELF_CREATE_ROOM"
}
```

### WebSocket 에러 처리

```javascript
stompClient.onStompError = (frame) => {
  console.error('STOMP error:', frame.headers['message']);
  // 재연결 로직
  setTimeout(() => {
    stompClient.activate();
  }, 5000);
};
```

---

## FAQ

### Q1. 쪽지방 ID를 모르는데 어떻게 메시지를 보내나요?
**A:** `/api/v1/notes/user/{otherUserId}/messages` 엔드포인트를 사용하면 쪽지방이 없을 경우 자동으로 생성됩니다.

### Q2. 메시지가 실시간으로 안 오는 경우는?
**A:** 다음을 확인하세요:
- WebSocket 연결 상태 (`connected` 값)
- 올바른 roomId로 구독했는지
- Redis 서버가 정상 동작하는지

### Q3. 페이지를 새로고침하면 메시지가 사라지나요?
**A:** 아니요. 메시지는 MySQL에 영구 저장되므로 `/api/v1/notes/user/{otherUserId}/messages` API로 다시 조회할 수 있습니다.

### Q4. 한 사용자가 여러 탭을 열면 어떻게 되나요?
**A:** 각 탭마다 별도의 WebSocket 연결이 생성되며, 모든 탭에서 메시지를 수신합니다.

### Q5. 안읽은 메시지 수는 어떻게 계산되나요?
**A:** 메시지가 전송될 때 수신자의 안읽은 카운트가 Redis에 증가하고, `/api/v1/notes/rooms/{roomId}/read`를 호출하면 0으로 초기화됩니다.

---

## 버전 정보

- **작성일:** 2025-11-22
- **백엔드 버전:** Spring Boot 3.5.5
- **테스트 환경:** Development (인증 비활성화)
- **프로덕션 준비도:** 인증 및 보안 설정 추가 필요