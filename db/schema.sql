CREATE EXTENSION IF NOT EXISTS "uuid-osap"

-- users section
CREATE TABLE users (
    id PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_hashed VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);


-- channels section
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL, 
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- posts section
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- replies for posts
CREATE TABLE replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id REFERENCES users(id),
    target_type VARCHAR(50) NOT NULL, 
    target_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_vote UNIQUE(user_id, target_type, target_id)
);

-- attachments for a post
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    mime_type VARCHAR(100),
    size_bytes INTEGER,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX posts_channel ON posts(channel_id);
CREATE INDEX replies_channel ON replies(channel_id);
CREATE INDEX replies_parent ON replies(parent_reply_id);
CREATE INDEX votes_target ON votes(target_type, target_id);