'use client'

import { Avatar } from '@mui/material';
import React, { useState } from 'react';

type CommentDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  comments: Array<any>;
  onAddComment: (newComment: string) => void;
};

const CommentDrawer = ({ isOpen, onClose, comments, onAddComment }: CommentDrawerProps) => {
  const [newComment, setNewComment] = useState<string>('');

  const handleSubmit = () => {
    if (newComment.trim().length > 0) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return   <div
  className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg transform transition-transform ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
  <div className="flex justify-between p-4 border-b dark:border-gray-700">
    <h3 className="text-lg font-medium dark:text-white">Comments</h3>
    <button
      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      onClick={onClose}
    >
      Close
    </button>
  </div>
  <div className="flex-1 overflow-y-auto p-4">
    {comments.map((comment, index) => (
      <div key={index} className="flex items-center mb-4">
        <Avatar
          src={comment.user.profilePicture || ''}
          alt={comment.user.username}
          sx={{ width: 34, height: 34 }}
        />
        <div className="ml-3">
          <p className="font-medium dark:text-white">{comment.user.username}</p>
          <p className="text-sm text-gray-500 dark:text-neutral-400">{comment.text}</p>
        </div>
      </div>
    ))}
  </div>
  <div className="p-4 border-t dark:border-gray-700">
    <div className="flex items-center">
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:ring dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={handleSubmit}
        className="ml-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700 focus:ring"
        disabled={newComment.trim().length === 0}
      >
        Post
      </button>
    </div>
  </div>
</div>
}
export default CommentDrawer;
