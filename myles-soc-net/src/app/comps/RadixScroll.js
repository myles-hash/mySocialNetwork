"use client";
import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import Link from 'next/link';



const ScrollAreaDemo = ({posts, profileId}) => (
    
  <ScrollArea.Root className="ScrollAreaRoot">
    
    <ScrollArea.Viewport className="ScrollAreaViewport">
      <div style={{ padding: '15px 20px' }}>
        {posts.rows.map((post) => {
            return (
                <ul key ={post.id}>
              <li key ={post.id}><Link key ={post.id} href={`/profiles/${profileId}/posts/${post.id}`}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                </Link>
                </li>
                </ul>
            )})}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
      <ScrollArea.Thumb className="ScrollAreaThumb" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
      <ScrollArea.Thumb className="ScrollAreaThumb" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner className="ScrollAreaCorner" />
  </ScrollArea.Root>
);

export default ScrollAreaDemo;