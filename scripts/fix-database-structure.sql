-- Fix database structure for Blockfest Africa Leaderboard
-- Run these commands in your Supabase SQL Editor

-- Step 1: Add missing columns if they don't exist
ALTER TABLE tweets ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE tweets ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0;
ALTER TABLE tweets ADD COLUMN IF NOT EXISTS mindshare_percentage DECIMAL(5,2) DEFAULT 0.0;

-- Step 2: Remove columns we don't need (if they exist)
-- ALTER TABLE tweets DROP COLUMN IF EXISTS score;
-- ALTER TABLE tweets DROP COLUMN IF EXISTS tweets;
-- ALTER TABLE tweets DROP COLUMN IF EXISTS content_quality;

-- Step 3: Clear existing data
DELETE FROM tweets;

-- Step 4: Insert the top 20 users (we'll add more later)
INSERT INTO tweets (tweet_id, username, name, profile_pic, text, date, likes, retweets, replies, quotes, followers, impressions, mindshare_percentage) VALUES
('seed_blockfestafrica_1', '@blockfestafrica', 'BlockFest Africa', 'https://pbs.twimg.com/profile_images/1686290184248209408/4aCtgQwz.jpg', 'Welcome to Blockfest Africa 2025! The biggest Web3 event in Africa is here. Join us for an incredible journey into the future of blockchain technology. #blockfestafrica #web3 #africa', '2025-01-26T10:00:00Z', 2500, 450, 120, 180, 15023, 65409, 68.5),
('seed_cryptoduke01_2', '@cryptoduke01', 'duke.sol', 'https://pbs.twimg.com/profile_images/1944609630153314304/HlSKV9c1.jpg', 'Excited to be part of Blockfest Africa 2025! The energy here is incredible. Building the future of Web3 in Africa, one block at a time. #blockfestafrica #solana #web3', '2025-01-26T09:30:00Z', 890, 156, 45, 78, 5123, 9231, 9.7),
('seed_leleofweb3_3', '@leleofweb3', 'LELE 🥷', 'https://pbs.twimg.com/profile_images/1942866884115705856/HH8BZJnV.jpg', 'Blockfest Africa is where innovation meets culture. Proud to be part of this amazing community driving Web3 adoption across Africa. #blockfestafrica #innovation', '2025-01-26T08:45:00Z', 234, 45, 12, 23, 2345, 942, 1.0),
('seed_Iamceejaymac_4', '@Iamceejaymac', 'Ceejaymac 😮‍💨🥥', 'https://pbs.twimg.com/profile_images/1946821277651468288/ikiD6meW.jpg', 'The future of blockchain in Africa starts here at Blockfest! Amazing to see so many builders and creators coming together. #blockfestafrica #blockchain', '2025-01-26T08:15:00Z', 456, 78, 23, 34, 4567, 2059, 2.2),
('seed_Pascal_x0_5', '@Pascal_x0', 'Pascal (♟,♟)', 'https://pbs.twimg.com/profile_images/1939403774008672256/mmRKWv1Z.jpg', 'Chess meets blockchain at Blockfest Africa! Strategic thinking in both domains. Excited to be part of this journey. #blockfestafrica #chess #web3', '2025-01-26T07:30:00Z', 89, 12, 5, 8, 1234, 64, 0.1),
('seed_JolexCreativity_6', '@JolexCreativity', 'Jolex Creativity', 'https://pbs.twimg.com/profile_images/1919909367060602880/RSDtBWNi.jpg', 'Creativity and blockchain innovation collide at Blockfest Africa. Building the next generation of digital creators. #blockfestafrica #creativity', '2025-01-26T07:00:00Z', 156, 23, 8, 12, 890, 235, 0.2),
('seed_Onoja_Cee_7', '@Onoja_Cee', 'Shy🧬', 'https://pbs.twimg.com/profile_images/1963764593525723136/PGS6YHiv.jpg', 'From shy to blockchain pioneer! Blockfest Africa is transforming how we think about technology and community. #blockfestafrica #transformation', '2025-01-26T06:45:00Z', 234, 45, 15, 28, 1678, 658, 0.7),
('seed_Cryptobaby_web3_8', '@Cryptobaby_web3', 'Cryptobaby (♟️,♟️)', 'https://pbs.twimg.com/profile_images/1941631097088991232/NXBcSN8w.jpg', 'Baby steps into the world of Web3 at Blockfest Africa. Every expert was once a beginner! #blockfestafrica #learning #web3', '2025-01-26T06:15:00Z', 178, 34, 9, 16, 2345, 365, 0.4),
('seed_danielfashh_9', '@danielfashh', 'Daniel Fash', 'https://pbs.twimg.com/profile_images/1969169756050649088/AgUFkq9c.jpg', 'Fashion meets blockchain at Blockfest Africa. Style and technology creating the future together. #blockfestafrica #fashion #tech', '2025-01-26T05:30:00Z', 67, 8, 3, 5, 789, 35, 0.0),
('seed_Princev20158850_10', '@Princev20158850', 'Billie 🤍 (Ø,G)', 'https://pbs.twimg.com/profile_images/1967602430129930240/7N_Ie9Xw.jpg', 'Royalty in the blockchain space! Blockfest Africa bringing together the best minds in Web3. #blockfestafrica #royalty #web3', '2025-01-26T05:00:00Z', 123, 18, 6, 11, 1234, 32, 0.0),
('seed_Pretoria01_11', '@Pretoria01', 'Pretoria', 'https://pbs.twimg.com/profile_images/1970643443744391168/Xo6vp8UY.jpg', 'From Pretoria to the world! Blockfest Africa showcasing South African innovation in Web3. #blockfestafrica #southafrica #web3', '2025-01-26T04:30:00Z', 289, 45, 12, 18, 1157, 1157, 1.2),
('seed_web3_theo_12', '@web3_theo', 'WEB3 Theo', 'https://pbs.twimg.com/profile_images/1970484413919121408/m5Chl708.jpg', 'Theo here, diving deep into Web3 at Blockfest Africa. The future is decentralized and we are building it! #blockfestafrica #decentralized', '2025-01-26T04:00:00Z', 156, 23, 8, 12, 250, 250, 0.3),
('seed_BIGDEE_INAFRICA_13', '@BIGDEE_INAFRICA', 'BIG DEE🎒💳', 'https://pbs.twimg.com/profile_images/1917379932289650688/pT-SsgzL.jpg', 'Big moves in Africa! Blockfest Africa is where dreams become reality. Proud to be part of this movement. #blockfestafrica #bigmoves', '2025-01-26T03:30:00Z', 134, 18, 6, 9, 225, 225, 0.2),
('seed_tycayomide_14', '@tycayomide', 'Ayomide($/acc)', 'https://pbs.twimg.com/profile_images/1923094542409961472/JmL8k7hQ.jpg', 'Account management meets blockchain at Blockfest Africa. Building secure financial futures. #blockfestafrica #finance #security', '2025-01-26T03:00:00Z', 98, 12, 4, 7, 189, 189, 0.2),
('seed_meenahtalksweb3_15', '@meenahtalksweb3', 'MeenahTalks 🎙✍🏽', 'https://pbs.twimg.com/profile_images/1969309611455860736/vqS6xAAu.jpg', 'Talking Web3 at Blockfest Africa! The power of conversation in driving blockchain adoption. #blockfestafrica #conversation #web3', '2025-01-26T02:30:00Z', 45, 6, 2, 4, 58, 58, 0.1),
('seed_Rid_doh_16', '@Rid_doh', 'Ridoh | Web3 Community Manager', 'https://pbs.twimg.com/profile_images/1933140274265419776/lGZSh94s.jpg', 'Community management in Web3 is an art! Blockfest Africa bringing together the best communities. #blockfestafrica #community #web3', '2025-01-26T02:00:00Z', 52, 7, 3, 5, 62, 62, 0.1),
('seed_nafsgirly_17', '@nafsgirly', 'Nafisa', 'https://pbs.twimg.com/profile_images/1949944374520885248/-BlB8K92.jpg', 'Girl power in Web3! Blockfest Africa celebrating women in blockchain technology. #blockfestafrica #womeninweb3 #empowerment', '2025-01-26T01:30:00Z', 78, 12, 4, 8, 90, 90, 0.1),
('seed_Tabbyomodudu_18', '@Tabbyomodudu', '💢Tabbytheblack.sign🧡👀🟠🔱', 'https://pbs.twimg.com/profile_images/1938182350048727040/HdMN8m28.jpg', 'Digital signatures and blockchain security at Blockfest Africa. Building trust in the digital world. #blockfestafrica #security #trust', '2025-01-26T01:00:00Z', 134, 18, 6, 12, 167, 167, 0.2),
('seed_starrgaxe_19', '@starrgaxe', 'starrgaxe(❖,❖)', 'https://pbs.twimg.com/profile_images/1970241410298159104/HeAChPTS.jpg', 'Star power in Web3! Blockfest Africa showcasing the brightest minds in blockchain. #blockfestafrica #stars #web3', '2025-01-26T00:30:00Z', 23, 3, 1, 2, 30, 30, 0.0),
('seed_oyebamms_20', '@oyebamms', 'Bamms sol⚡️💻', 'https://pbs.twimg.com/profile_images/1961368077762805760/Eht3SYGZ.jpg', 'Lightning fast development at Blockfest Africa! Solana ecosystem growing stronger. #blockfestafrica #solana #lightning', '2025-01-26T00:00:00Z', 8, 1, 0, 1, 10, 10, 0.0);

-- Step 5: Verify the data was inserted
SELECT COUNT(*) as total_users FROM tweets;
SELECT username, name, rank() OVER (ORDER BY mindshare_percentage DESC) as rank, mindshare_percentage FROM tweets ORDER BY mindshare_percentage DESC LIMIT 10;
