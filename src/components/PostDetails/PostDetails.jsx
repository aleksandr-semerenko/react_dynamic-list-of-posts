import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { NewCommentForm } from '../NewCommentForm';
import { Loader } from '../Loader';
import { removeComment, getPostComments } from '../../api/comments';

import './PostDetails.scss';

export const PostDetails = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  const onChangeCommentsVisibility = () => {
    setCommentsVisible(prevState => !prevState);
  };

  const getComments = () => {
    (async() => setComments(await getPostComments(post.id)))();

    setShowLoader(false);
  };

  const deleteComment = async(id) => {
    setShowLoader(true);
    await removeComment(id);
    getComments();
  };

  useEffect(() => {
    setShowLoader(true);
    (async() => setComments(await getPostComments(post.id)))();

    setShowLoader(false);
  }, [post]);

  return (
    <div className="PostDetails">
      <h2>Post details:</h2>

      <section className="PostDetails__post">
        <p>{post.body}</p>
      </section>
      {showLoader
        ? <Loader />
        : (
          <section className="PostDetails__comments">
            {!!comments.length
              && (
                <button
                  type="button"
                  className="button"
                  onClick={onChangeCommentsVisibility}
                >
                  {commentsVisible
                    ? `Hide ${comments.length} comments`
                    : `Show ${comments.length} comments`
                  }
                </button>
              )}
            {commentsVisible
              && (
                <ul className="PostDetails__list">
                  {comments.map(comment => (
                    <li
                      className="PostDetails__list-item"
                      key={comments.id}
                    >
                      <button
                        type="button"
                        className="PostDetails__remove-button button"
                        onClick={() => deleteComment(comment.id)}
                      >
                        DELETE
                      </button>
                      <p>{comment.body}</p>
                    </li>
                  ))}
                </ul>
              )
              }
          </section>
        )
      }
      <section>
        <div className="PostDetails__form-wrapper">
          <NewCommentForm
            postId={post.id}
            loadComments={getComments}
            showLoader={setShowLoader}
          />
        </div>
      </section>
    </div>
  );
};

PostDetails.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};