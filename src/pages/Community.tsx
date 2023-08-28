import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { supabase } from "../supabase";

interface Comment {
  id: number;
  content: string;
  userNickname: string;
}

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  comments: Comment[];
}

export default function Community() {
  const navigate = useNavigate();

  // 상태로 게시물 데이터를 관리합니다.
  const [posts, setPosts] = useState<Post[]>([]);

  // 게시물 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("게시물 가져오기 오류:", error);
      } else {
        setPosts(posts);
      }
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <div>커뮤니티</div>
      <Link to="/create">작성</Link>
      {posts?.map((post) => (
        <PostBox key={post.id}>
          <Link to={`/post-detail/${post.id}`}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>
              {
                ReactHtmlParser(post.content, {
                  transform: (node, index) => {
                    if (node.type === "tag" && node.name === "img") {
                      const imgUrl = node.attribs.src; // 이미지 URL 추출
                      return (
                        // <div key={index} style={{ maxWidth: "100%" }}>
                        //   <img
                        //     src={imgUrl}
                        //     style={{
                        //       width: "100%",
                        //       height: "100%",
                        //       objectFit: "cover", // 이미지 크롭
                        //     }}
                        //     alt={`Image ${index}`}
                        //   />
                        // </div>

                        // 수진 : 정사각형, 직사각형 사진 크기 조정 때문에 안 예쁘게 나와서 모두
                        // 사진 크기는 유지하면 정사각형으로 나오게 함.
                        <div
                          key={index}
                          style={{
                            maxWidth: "100%",
                            height: 0,
                            paddingBottom: "100%",
                            position: "relative",
                          }}
                        >
                          <img
                            src={imgUrl}
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              top: 0,
                              left: 0,
                              objectFit: "cover", // 이미지 크롭
                            }}
                            alt={`Image ${index}`}
                          />
                        </div>
                      );
                    }
                    return undefined;
                  },
                })[0]
              }{" "}
              {/* 첫 번째 이미지만 반환 */}
            </PostContent>
            <div>{post.author}</div>
          </Link>
        </PostBox>
      ))}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const PostBox = styled.div`
  border: 1px solid gray;
  padding: 10px;
  margin-top: 10px;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const PostContent = styled.p`
  max-width: 100%;
  font-size: 1rem;
  color: #333;
  margin-bottom: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 250px; /* 원하는 너비 */
  height: 250px; /* 원하는 높이 */
`;
